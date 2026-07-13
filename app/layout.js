import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

export const metadata = {
  title: "Stock Sage Research Portal",
  description: "AI-powered equity research platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
