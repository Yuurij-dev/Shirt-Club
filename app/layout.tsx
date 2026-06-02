import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { FavoritesProvider } from "./context/FavoritesContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Shirt Club",
  description: "Loja de camisas de futebol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${bebas.variable}
          ${poppins.variable}
          antialiased
        `}
      >
        <FavoritesProvider>
          {children}

          <Toaster
            richColors
            position="bottom-right"
            expand
            toastOptions={{
              className: `
                !w-[calc(100vw-32px)]
                sm:!w-auto
                !max-w-[420px]
                !rounded-xl
                !text-sm
              `,
            }}
          />
        </FavoritesProvider>
      </body>
    </html>
  );
}