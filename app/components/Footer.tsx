import {
  FaWhatsapp,
  FaTiktok,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import { ShieldCheck } from "lucide-react";

const socialLinks = [
  {
    icon: FaInstagram,
    href: "#",
  },
  {
    icon: FaWhatsapp,
    href: "#",
  },
  {
    icon: FaTiktok,
    href: "#",
  },
  {
    icon: FaYoutube,
    href: "#",
  },
];

const institutionalLinks = [
  "Sobre nós",
  "Contato",
  "Trocas e devoluções",
  "Política de privacidade",
  "Termos de uso",
];

const categoryLinks = [
  "Nacionais",
  "Internacionais",
  "Retrô",
  "Lançamentos",
  "Promoções",
];

const helpLinks = [
  "Perguntas frequentes",
  "Formas de pagamento",
  "Prazos e entregas",
  "Rastreamento",
  "Trocas e devoluções",
];

const payments = [
  {
    name: "Visa",
    image: "/payments/visa.svg",
  },
  {
    name: "Mastercard",
    image: "/payments/mastercard.svg",
  },
  {
    name: "Elo",
    image: "/payments/elo.svg",
  },
  {
    name: "American Express",
    image: "/payments/american-express.svg",
  },
  {
    name: "hipercard",
    image: "/payments/hipercard.svg",
  },
  {
    name: "Pix",
    image: "/payments/pix.svg",
  },
];

const FooterLinks = ({
  title,
  links,
}: {
  title: string;
  links: string[];
}) => {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide">
        {title}
      </h3>

      <ul className="!mt-4 flex flex-col gap-3 text-sm text-zinc-400">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="transition-all duration-200 hover:text-white"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white">
      
      <div
        className="
          container
          !mx-auto
          grid
          grid-cols-1
          gap-10

          !px-4
          !py-10

          sm:grid-cols-2
          sm:!px-6

          lg:grid-cols-5
          lg:!px-0
        "
      >

        {/* LOGO */}
        <div className="flex flex-col gap-5">
          
          <div>
            <h2
              className="
                font-[family-name:var(--font-bebas)]
                text-5xl
                leading-none
              "
            >
              SHIRT <br />
              CLUB
            </h2>

            <p className="!mt-4 max-w-[220px] text-sm text-zinc-400">
              A maior loja de camisas de futebol do Brasil.
              Qualidade premium e paixão pelo futebol.
            </p>
          </div>

          {/* SOCIAL */}
          <div className="flex items-center gap-4">
            {socialLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <a
                  key={index}
                  href={item.href}
                  className="transition-all duration-200 hover:text-zinc-400"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

        </div>

        {/* COLUNAS */}
        <FooterLinks
          title="Institucional"
          links={institutionalLinks}
        />

        <FooterLinks
          title="Categorias"
          links={categoryLinks}
        />

        <FooterLinks
          title="Ajuda"
          links={helpLinks}
        />

        {/* PAGAMENTOS */}
        <div className="flex flex-col gap-8">
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">
              Formas de pagamento
            </h3>

            <div className="!mt-4 flex flex-wrap items-center gap-2">
              {payments.map((payment) => (
                <div
                  key={payment.name}
                  className="rounded bg-white !p-1"
                >
                  <img
                    src={payment.image}
                    alt={payment.name}
                    className="h-6 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEGURANÇA */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">
              Segurança
            </h3>

            <div className="!mt-4 flex items-start gap-3">
              
              <div
                className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-zinc-700
                    bg-zinc-950
                "
                >
                <ShieldCheck
                    size={22}
                    className="text-white"
                    strokeWidth={2.2}
                />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Site 100% seguro
                </p>

                <span className="text-xs text-zinc-400">
                  Seus dados protegidos
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* COPYRIGHT */}
      <div
        className="
          border-t
          border-zinc-800
          !px-4
          !py-4
          text-center
          text-xs
          text-zinc-500
        "
      >
        © 2024 Shirt Club. Todos os direitos reservados.
      </div>

    </footer>
  );
};

export default Footer;