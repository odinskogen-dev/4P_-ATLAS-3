import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '4PLANET ATLAS — Spatial Intelligence Interface',
  description: 'A spatial interface for living systems intelligence.',
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
