import type { Metadata } from "next";
import { IBM_Plex_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { MainLayout } from "../core/components/MainLayout";
import { AppRefreshProvider } from "../core/context/AppRefreshContext";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair-display',
});

export const metadata: Metadata = {
  title: "ADN",
  description: "Servicios digitales de su ciudad, simplificados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${ibmPlexSans.variable} ${playfairDisplay.variable} font-sans`}>
        <AppRefreshProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AppRefreshProvider>
      </body>
    </html>
  );
}
