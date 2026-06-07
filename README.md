# Shirt Club

E-commerce em Next.js com carrinho, checkout, Pix, Mercado Pago, painel admin,
cupons, pedidos e notificações de compra confirmada.

## Rodando o projeto

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env.local` baseado no `.env.example`:

```bash
cp .env.example .env.local
```

Inicie o site:

```bash
npm run dev
```

Abra `http://localhost:3000`.

## WhatsApp com Baileys

O envio de WhatsApp não roda dentro da Vercel. Ele precisa ficar em um processo
Node separado, porque o Baileys mantém sessão ativa do WhatsApp.

### Variáveis necessárias

No `.env.local`, configure:

```env
WHATSAPP_BOT_URL=http://localhost:3333
WHATSAPP_BOT_SECRET=uma_chave_secreta
WHATSAPP_BOT_PORT=3333
WHATSAPP_BAILEYS_AUTH_DIR=./baileys_auth
```

Use a mesma `WHATSAPP_BOT_SECRET` no site e no bot.

### Iniciando o bot

Em um terminal separado, rode:

```bash
npm run whatsapp:bot
```

Na primeira execução, o terminal vai mostrar um QR Code. Escaneie com o WhatsApp:

1. Abra o WhatsApp no celular.
2. Vá em **Aparelhos conectados**.
3. Clique em **Conectar um aparelho**.
4. Escaneie o QR Code do terminal.

A sessão será salva na pasta configurada em `WHATSAPP_BAILEYS_AUTH_DIR`.
Por padrão, ela fica em `./baileys_auth` e está ignorada no Git.

### Testando o envio

Com o site e o bot rodando:

1. Faça um pedido no site.
2. Aprove o pagamento.
3. Quando o pedido for atualizado para `paid`, o backend chama o bot:

```http
POST http://localhost:3333/send-order-paid
```

Com o header:

```http
x-bot-secret: WHATSAPP_BOT_SECRET
```

O cliente recebe uma mensagem no WhatsApp cadastrado no pedido.

Para testar manualmente:

```bash
curl -X POST http://localhost:3333/send-order-paid \
  -H "Content-Type: application/json" \
  -H "x-bot-secret: uma_chave_secreta" \
  -d "{\"phone\":\"5561999999999\",\"customerName\":\"Cliente Teste\",\"orderId\":\"SC-123\",\"total\":\"R$ 189,90\"}"
```

## Notificações de pedido pago

O envio de e-mail e WhatsApp acontece no backend, quando o pedido é confirmado
como pago. Não depende da tela de sucesso do front-end.

O campo `paid_notified_at` evita envio duplicado. Se uma notificação falhar, o
erro é registrado no console, mas o fluxo do pedido continua.

## Banco de dados

Os schemas SQL ficam na pasta `database`.

Para pedidos, rode no Supabase:

```sql
alter table public.orders
  add column if not exists paid_notified_at timestamptz;

alter table public.orders
  add column if not exists delivery_status text not null default 'not_separated';
```
