import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Human × Agent CoLab — Better, together.",
  description: "Three playful missions. Two different perspectives. Discover what you and an AI teammate can achieve together. Free, no sign-up or API keys.",
  openGraph: { title: "Human × Agent CoLab", description: "Your intuition. An agent’s analysis. A better outcome.", type: "website" }
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}

