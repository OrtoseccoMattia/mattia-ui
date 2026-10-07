"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { UIKitProvider } from "@mattia/ui";
import { TooltipProvider } from "@mattia/ui/components/tooltip";

/** Collega il kit a questo sito: tema chiaro/scuro, router di Next, testi in italiano. */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <UIKitProvider
        Link={Link}
        navigation={{ push: (href) => router.push(href), replace: (href) => router.replace(href) }}
        labels={{ close: "Chiudi", cancel: "Annulla", confirm: "Conferma", areYouSure: "Sei sicuro?", retry: "Riprova", loadError: "Impossibile caricare i dati." }}
      >
        <TooltipProvider>{children}</TooltipProvider>
      </UIKitProvider>
    </ThemeProvider>
  );
}
