import type { Metadata } from "next";
import { Geist } from "next/font/google";
//import { ThemeProvider } from "next-themes";
import "./globals.css";
import QueryProvider from "@/lib/QueryProvider";
import { Toaster } from "react-hot-toast";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Canvasly - Discover Art",
  description: "A web-based online community and art marketplace",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <QueryProvider>
          <main>
            <div>{children}</div>
          </main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
