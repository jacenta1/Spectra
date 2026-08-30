import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NetworkProvider } from "@/lib/context/network-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spectra | Agent Observability for 0G",
  description:
    "Monitor, debug, verify, and audit autonomous AI agents on the 0G network. Real-time observability for the decentralized agent economy.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Spectra | Agent Observability for 0G",
    description:
      "Real-time monitoring, debugging, and verification for autonomous AI agents on 0G.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <NetworkProvider>{children}</NetworkProvider>
      </body>
    </html>
  );
}
