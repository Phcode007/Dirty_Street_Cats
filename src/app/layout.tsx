import type { Metadata } from "next";
import { Cinzel, Crimson_Text } from "next/font/google";
import "./globals.css";

// CONFIGURANDO A FONTE CINZEL (para títulos)
const cinzel = Cinzel({
  subsets: ["latin"], // Caracteres latinos
  variable: "--font-cinzel", // Variável CSS
  weight: ["400", "600", "700"], // Pesos disponíveis
});

// CONFIGURANDO A FONTE CRIMSON TEXT (para corpo do texto)
const crimsonText = Crimson_Text({
  subsets: ["latin"],
  variable: "--font-crimson",
  weight: ["400", "600"],
  style: ["normal", "italic"], // Normal + Itálico
});

// METADATA: Informações que aparecem na aba do navegador
export const metadata: Metadata = {
  title: "Dirty Street Cats - Uma história de Eldor",
  description: "Uma épica história de fantasia sombria",
};

// COMPONENTE ROOT LAYOUT
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${crimsonText.variable}`}>
      <head>
        {/* Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        {/* O conteúdo de cada página vai aqui */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
