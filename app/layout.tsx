import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConvexProvider } from '@/providers/ConvexProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from './AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Elegant Interiors | Professional Interior Design Services',
  description: 'Transform your space with our expert interior design services. View our portfolio and get updates on your projects in real-time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}