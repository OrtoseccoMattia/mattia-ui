import type { Metadata, Viewport } from "next";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Demo Kit",
  description: "Un secondo sito costruito su @mattia/ui con una palette diversa.",
};

// `cover` serve alle utility di safe-area del kit (notch, home indicator).
export const viewport: Viewport = { viewportFit: "cover", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
