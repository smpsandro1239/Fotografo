import { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fotografo - Plataforma Premium para Fotógrafos',
  description: 'Gestão de eventos, galerias protegidas, reservas com pagamento e app mobile para clientes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-background`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}