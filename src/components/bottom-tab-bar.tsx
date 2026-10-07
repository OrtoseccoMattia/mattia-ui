"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { useUIKit } from "../provider";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import type { NavAccent, NavItem } from "./nav-types";

export interface BottomTabBarProps {
  items: NavItem[];
  activeHref: string | null;
  accent: NavAccent;
  ariaLabel: string;
  /** Voci extra in coda, tipicamente <BottomTabBarAction> per il menu. */
  trailing?: ReactNode;
  className?: string;
}

/**
 * Tab bar in basso, solo sotto `lg`.
 *
 * Visibilità in CSS (`lg:hidden`) e non tramite uno stato JS `isMobile`:
 * quest'ultimo vale `false` durante l'SSR, quindi su telefono la barra
 * comparirebbe solo al secondo render, con uno scatto a idratazione.
 * z-40, sotto gli overlay Radix (z-[200]), così non copre i modali.
 */
export function BottomTabBar({ items, activeHref, accent, ariaLabel, trailing, className }: BottomTabBarProps) {
  const { Link } = useUIKit();
  return (
    <nav
      data-app-chrome
      aria-label={ariaLabel}
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40 h-tabbar pb-safe px-safe bg-white/85 dark:bg-midnight-950/90 backdrop-blur-xl border-t flex items-stretch",
        accent.border,
        className,
      )}
    >
      {items.map((item) => {
        const active = activeHref === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            data-press
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-1 min-h-11 transition-colors",
              active ? accent.text : "text-slate-500 dark:text-slate-400",
            )}
          >
            {active && (
              // `layoutId` fa scorrere l'indicatore da una voce all'altra
              // invece di farlo sparire e riapparire.
              <motion.span
                layoutId="tabbar-indicator"
                className={cn("absolute top-0 h-0.5 w-8 rounded-full bg-gradient-to-r", accent.gradient)}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <Icon name={item.icon} className={cn("!text-[22px] transition-transform", active && "scale-110")} />
            <span className="text-xs font-semibold tracking-tight">{item.label}</span>
          </Link>
        );
      })}
      {trailing}
    </nav>
  );
}

/** Voce della tab bar che non è un link (per esempio il pulsante "Menu"). */
export function BottomTabBarAction({ icon, label, onClick, ariaLabel }: { icon: string; label: string; onClick: () => void; ariaLabel?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-press
      aria-label={ariaLabel ?? label}
      className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 min-h-11 text-slate-500 dark:text-slate-400"
    >
      <Icon name={icon} className="!text-[22px]" />
      <span className="text-xs font-semibold tracking-tight">{label}</span>
    </button>
  );
}
