import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PriceComp - Compare Prices',
  description: 'Compare prices across Amazon, Walmart & Best Buy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}