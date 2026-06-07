import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const loadEnvFile = () => {
  const envPath = path.join(rootDir, ".env.local");

  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) return;

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (!process.env[key]) {
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  });
};

loadEnvFile();

const port = Number(process.env.WHATSAPP_BOT_PORT || 3333);
const botSecret = process.env.WHATSAPP_BOT_SECRET;
const authDir = path.resolve(
  rootDir,
  process.env.WHATSAPP_BAILEYS_AUTH_DIR || "./baileys_auth"
);

if (!botSecret) {
  console.warn("WHATSAPP_BOT_SECRET nao configurado.");
}

let socket;
let isConnected = false;

const connectWhatsapp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  socket = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  socket.ev.on("creds.update", saveCreds);
  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("Escaneie o QR Code abaixo com o WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      isConnected = true;
      console.log("WhatsApp conectado com sucesso.");
    }

    if (connection === "close") {
      isConnected = false;
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log("Conexao do WhatsApp fechada.", {
        statusCode,
        shouldReconnect,
      });

      if (shouldReconnect) {
        await connectWhatsapp();
      } else {
        console.log("Sessao desconectada. Apague a pasta de auth e conecte novamente se necessario.");
      }
    }
  });
};

const readJsonBody = async (request) => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
};

const sendJson = (response, statusCode, body) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  response.end(JSON.stringify(body));
};

const normalizePhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) return null;
  if (digits.startsWith("55")) return digits;

  return `55${digits}`;
};

const buildOrderPaidMessage = ({ customerName, orderId, total }) => {
  return [
    `Fala, ${customerName || "cliente"}! ✅`,
    "",
    `Seu pedido #${orderId} foi confirmado com sucesso.`,
    "",
    `Valor: ${total}`,
    "",
    "Obrigado por comprar com a gente! 🙌",
    "Seu pedido já entrou na nossa fila de preparação. Em breve você receberá novas atualizações. 📦",
  ].join("\n");
};

const server = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    sendJson(response, 200, {
      ok: true,
      connected: isConnected,
    });
    return;
  }

  if (request.method !== "POST" || request.url !== "/send-order-paid") {
    sendJson(response, 404, { error: "Rota nao encontrada" });
    return;
  }

  if (botSecret && request.headers["x-bot-secret"] !== botSecret) {
    sendJson(response, 401, { error: "Nao autorizado" });
    return;
  }

  if (!socket || !isConnected) {
    sendJson(response, 503, { error: "WhatsApp ainda nao esta conectado" });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const phone = normalizePhone(body.phone);

    if (!phone || !body.orderId || !body.total) {
      sendJson(response, 400, {
        error: "phone, orderId e total sao obrigatorios",
      });
      return;
    }

    const rawJid = `${phone}@s.whatsapp.net`;
    const matchingNumbers = await socket.onWhatsApp(rawJid);
    const contact = matchingNumbers?.[0];

    if (!contact?.exists) {
      console.warn("Numero nao encontrado no WhatsApp", {
        phone,
        orderId: body.orderId,
      });
      sendJson(response, 400, {
        error: "Numero nao encontrado no WhatsApp",
        phone,
      });
      return;
    }

    const jid = contact.jid || rawJid;
    const message = buildOrderPaidMessage(body);
    const result = await socket.sendMessage(jid, {
      text: message,
    });

    console.log("Mensagem de pedido pago enviada", {
      phone,
      jid,
      orderId: body.orderId,
      messageId: result?.key?.id,
    });

    sendJson(response, 200, {
      ok: true,
      jid,
      messageId: result?.key?.id,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem de pedido pago", error);
    sendJson(response, 500, {
      error: "Nao foi possivel enviar a mensagem",
    });
  }
});

await connectWhatsapp();

server.listen(port, () => {
  console.log(`Bot Baileys ouvindo em http://localhost:${port}`);
  console.log(`Sessao salva em ${authDir}`);
});
