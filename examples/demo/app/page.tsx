"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { AppFrame, BottomTabBar, BottomTabBarAction, TopNav, type NavAccent, type NavItem } from "@mattia/ui";
import { Button } from "@mattia/ui/components/button";
import { ConfirmationDialog } from "@mattia/ui/components/confirmation-dialog";
import { EmptyState } from "@mattia/ui/components/empty-state";
import { ErrorState } from "@mattia/ui/components/error-state";
import { Icon } from "@mattia/ui/components/icon";
import { PeriodChips, type SpendingMonths } from "@mattia/ui/components/period-chips";
import { CollectionGridSkeleton } from "@mattia/ui/components/collection-grid-skeleton";

type Section = "sunset" | "lagoon";

// Le classi sono scritte per intero: Tailwind non vede quelle composte a runtime.
const ACCENTS: Record<Section, NavAccent & { tab: string; solid: string; backdrop: [string, string] }> = {
  sunset: {
    gradient: "from-sunset-500 to-sunset-alt-500",
    text: "text-sunset-600 dark:text-sunset-400",
    border: "border-sunset-200 dark:border-sunset-900/30",
    tab: "Tramonti",
    solid: "bg-sunset-600",
    backdrop: ["#f59e0b", "#f43f5e"],
  },
  lagoon: {
    gradient: "from-lagoon-500 to-lagoon-alt-500",
    text: "text-lagoon-600 dark:text-lagoon-400",
    border: "border-lagoon-200 dark:border-lagoon-900/30",
    tab: "Lagune",
    solid: "bg-lagoon-600",
    backdrop: ["#06b6d4", "#8b5cf6"],
  },
};

const ITEMS: NavItem[] = [
  { href: "#componenti", label: "Componenti", icon: "library_books" },
  { href: "#stati", label: "Stati", icon: "event" },
  { href: "#caricamento", label: "Caricamento", icon: "analytics" },
];

export default function Page() {
  const [section, setSection] = useState<Section>("sunset");
  const [active, setActive] = useState("#componenti");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [months, setMonths] = useState<SpendingMonths>(6);
  const { resolvedTheme, setTheme } = useTheme();
  const accent = ACCENTS[section];

  return (
    <AppFrame
      backdrop={accent.backdrop}
      header={
        <TopNav
          brand={{ href: "/", title: "Demo Kit", icon: "auto_awesome" }}
          accent={accent}
          items={ITEMS}
          activeHref={active}
          onBrandPress={() => setSection(section === "sunset" ? "lagoon" : "sunset")}
          brandPressLabel="Cambia sezione"
          actions={
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Cambia tema"
              className="flex w-11 h-11 lg:w-10 lg:h-10 rounded-full items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
            >
              <Icon name={resolvedTheme === "dark" ? "light_mode" : "dark_mode"} />
            </button>
          }
        />
      }
      tabBar={
        <BottomTabBar
          items={ITEMS}
          activeHref={active}
          accent={accent}
          ariaLabel="Navigazione principale"
          trailing={<BottomTabBarAction icon="menu" label="Sezione" ariaLabel="Cambia sezione" onClick={() => setSection(section === "sunset" ? "lagoon" : "sunset")} />}
        />
      }
    >
      <div className="py-6 space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sezione «{accent.tab}»</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Stessi componenti del sito principale, palette diversa: viola profondo e accenti ambra/ciano. Cambia sezione dal marchio (su
            telefono) o dal pulsante Sezione, e il tema dal sole/luna.
          </p>
          <div className="mt-3 flex gap-2">
            {ITEMS.map((i) => (
              <button key={i.href} onClick={() => setActive(i.href)} className="text-xs font-bold underline cursor-pointer text-slate-500 dark:text-slate-300">
                {i.label}
              </button>
            ))}
          </div>
        </header>

        <section id="componenti" className="glass-panel space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Componenti</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primario (--primary)</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondario</Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Elimina…
            </Button>
          </div>
          <PeriodChips value={months} onChange={setMonths} accent={accent.solid + " text-white border-transparent"} />
          <ConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} message="L'elemento sarà rimosso per sempre." onConfirm={() => {}} />
        </section>

        <section id="stati" className="space-y-4">
          <EmptyState icon="inbox" title="Niente qui, per ora" description="Un invito a fare il primo passo." accent={accent.solid} primary={{ label: "Aggiungi", onClick: () => {} }} />
          <ErrorState onRetry={() => {}} />
        </section>

        <section id="caricamento" className="glass-panel">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Caricamento</h2>
          <CollectionGridSkeleton count={6} />
        </section>
      </div>
    </AppFrame>
  );
}
