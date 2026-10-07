"use client";

import type { ReactNode } from "react";

import { useUIKit } from "../provider";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import type { NavAccent, NavItem } from "./nav-types";

export interface TopNavProps {
  brand: { href: string; title: string; icon: string };
  accent: NavAccent;
  items: NavItem[];
  /** `href` della voce attiva, o null. */
  activeHref: string | null;
  /**
   * Se presente, su telefono il marchio diventa un pulsante (di solito
   * apre il cambio sezione) invece di un link alla home.
   */
  onBrandPress?: () => void;
  brandPressLabel?: string;
  /** Contenuto a destra: ricerca, tema, account… */
  actions?: ReactNode;
  className?: string;
}

/**
 * Barra in alto fissa. Da `lg` il marchio è un link e le voci stanno al
 * centro; sotto `lg` restano solo marchio e azioni (le voci vanno nella
 * BottomTabBar). La visibilità è in CSS, non in JS, così non c'è scatto
 * a idratazione. Il nav ha `data-appbar-nav`: si nasconde scendendo con
 * la pagina quando `html[data-appbar="hidden"]` (vedi shell.css).
 */
export function TopNav({ brand, accent, items, activeHref, onBrandPress, brandPressLabel, actions, className }: TopNavProps) {
  const { Link } = useUIKit();
  return (
    <nav
      data-app-chrome
      data-appbar-nav
      // h-appbar/pt-safe: l'altezza include l'inset del notch, così il
      // contenuto non ci finisce sotto in landscape o con Dynamic Island.
      className={cn(
        "fixed top-0 z-50 w-full bg-white/95 dark:bg-midnight-950/95 backdrop-blur-md shadow-sm shadow-black/5 dark:shadow-black/30 border-b h-appbar pt-safe px-safe transition-[transform,background-color,border-color] duration-[250ms] ease-out",
        accent.border,
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 shrink-0 min-w-0">
          {/* Il marchio porta il colore solo nell'icona. Non è un <h1>:
              è chrome persistente, il titolo vero è quello del contenuto. */}
          <Link href={brand.href} className="hidden lg:flex items-center gap-3 group cursor-pointer">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br", accent.gradient)}>
              <Icon name={brand.icon} className="!text-[24px]" />
            </div>
            <span className="block text-lg font-bold text-slate-900 dark:text-white">{brand.title}</span>
          </Link>
          {onBrandPress ? (
            <button
              type="button"
              onClick={onBrandPress}
              data-press
              aria-label={brandPressLabel ?? brand.title}
              className="lg:hidden flex items-center gap-2 min-h-11 min-w-0 cursor-pointer"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br", accent.gradient)}>
                <Icon name={brand.icon} className="!text-[20px]" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white truncate">{brand.title}</span>
              <Icon name="expand_more" className="!text-[20px] text-slate-500 dark:text-slate-300 shrink-0" />
            </button>
          ) : (
            <Link href={brand.href} className="lg:hidden flex items-center gap-2 min-h-11 min-w-0 cursor-pointer">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br", accent.gradient)}>
                <Icon name={brand.icon} className="!text-[20px]" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white truncate">{brand.title}</span>
            </Link>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-midnight-950/50 p-1 rounded-2xl border border-slate-200/50 dark:border-midnight-800 shrink-0">
          {items.map((item) => {
            const active = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all border border-transparent flex items-center gap-2",
                  active
                    ? cn("bg-white dark:bg-white/10 shadow-sm border-slate-200 dark:border-white/5", accent.text)
                    : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white",
                )}
              >
                <Icon name={item.icon} className="!text-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">{actions}</div>
      </div>
    </nav>
  );
}
