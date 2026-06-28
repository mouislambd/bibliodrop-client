import Providers from "@/components/shared/Providers";
import "./globals.css";

export const metadata = {
  title: "BiblioDrop",
  description: "Your local library, delivered to your doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
