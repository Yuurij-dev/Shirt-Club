import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import {
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

type FooterLink = {
  label: string;
  href: string;
};

const socialLinks = [
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/shirt_club_brasil/",
    label: "Instagram",
  },
  {
    icon: FaWhatsapp,
    href: "#",
    label: "WhatsApp",
  },
  {
    icon: FaTiktok,
    href: "#",
    label: "TikTok",
  },
  {
    icon: FaYoutube,
    href: "#",
    label: "YouTube",
  },
];

const institutionalLinks: FooterLink[] = [
  { label: "Sobre nós", href: "/sobre-nos" },
  { label: "Contato", href: "/contato" },
  { label: "Trocas e devoluções", href: "/trocas-e-devolucoes" },
  { label: "Política de privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de uso", href: "/termos-de-uso" },
];

const categoryLinks: FooterLink[] = [
  { label: "Times", href: "/times" },
  { label: "Seleções", href: "/selecoes" },
  { label: "Lançamentos", href: "/lancamentos" },
  { label: "Retro", href: "/retro" },
  { label: "Personalize", href: "/personalize" },
];

const helpLinks: FooterLink[] = [
  { label: "Perguntas frequentes", href: "/perguntas-frequentes" },
  { label: "Formas de pagamento", href: "/formas-de-pagamento" },
  { label: "Prazos e entregas", href: "/prazos-e-entregas" },
  { label: "Rastreamento", href: "/rastreamento" },
  { label: "Trocas e devoluções", href: "/trocas-e-devolucoes" },
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
    name: "Hipercard",
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
  links: FooterLink[];
}) => {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-wide">{title}</h3>

      <ul className="!mt-4 flex flex-col gap-3 text-sm text-zinc-400">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="transition-all duration-200 hover:text-white"
            >
              {link.label}
            </Link>
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
              A maior loja de camisas de futebol do Brasil. Qualidade premium e
              paixão pelo futebol.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="transition-all duration-200 hover:text-zinc-400"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <FooterLinks title="Institucional" links={institutionalLinks} />
        <FooterLinks title="Categorias" links={categoryLinks} />
        <FooterLinks title="Ajuda" links={helpLinks} />

        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">
              Formas de pagamento
            </h3>

            <div className="!mt-4 flex flex-wrap items-center gap-2">
              {payments.map((payment) => (
                <div key={payment.name} className="rounded bg-white !p-1">
                  <Image
                    src={payment.image}
                    alt={payment.name}
                    width={34}
                    height={24}
                    className="h-6 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>

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
                <p className="text-sm font-medium">Site 100% seguro</p>

                <span className="text-xs text-zinc-400">
                  Seus dados protegidos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
