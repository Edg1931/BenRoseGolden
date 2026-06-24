import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Benjamin Rose × The Golden Group",
  description:
    "Partnership tools: ESOP/Benjamin Rose referral tracker and Ohio down-payment-assistance finder.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Allow zoom for accessibility; don't lock scaling.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
