import localFont from "next/font/local";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

const lexend = localFont({
  src: "./fonts/Lexend.ttf",
  variable: "--font-lexend",
  weight: "100 900",
});

export const metadata = {
  title: "Qistbazaar",
  description: "Qistbazaar is BNPL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} antialiased`}>{children}</body>
    </html>
  );
}
