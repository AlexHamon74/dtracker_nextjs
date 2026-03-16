import "./globals.css";
import Navbar from "./components/organisms/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
