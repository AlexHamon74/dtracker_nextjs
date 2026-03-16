import "./globals.css";
import Navbar from "./components/organisms/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DTracker – Suivi de dépenses minimaliste",
  description:
    "Suivez vos catégories, dépenses et aperçus rapides dans une interface simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-gray-50 text-gray-900">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
