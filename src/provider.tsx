"use client";

import { createContext, useContext, useMemo, type AnchorHTMLAttributes, type ComponentType, type ReactNode } from "react";

/** Testi che i componenti del kit mostrano da soli (aria-label e bottoni di default). */
export interface UIKitLabels {
  close: string;
  cancel: string;
  confirm: string;
  areYouSure: string;
  period: string;
  months: string;
  retry: string;
  loadError: string;
}

/** Come il kit cambia pagina senza dipendere da un framework (es. dal router di Next). */
export interface UIKitNavigation {
  push: (href: string) => void;
  replace: (href: string) => void;
}

/** Link del sito: `next/link`, il Link di React Router, o un semplice <a>. */
export type UIKitLink = ComponentType<AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>;

export interface UIKitConfig {
  Link: UIKitLink;
  labels: UIKitLabels;
  navigation: UIKitNavigation;
  /** Icone aggiuntive, per nome, in più a quelle incluse nel kit. */
  icons: Record<string, ComponentType<{ className?: string; strokeWidth?: number; fill?: string }>>;
}

export const DEFAULT_LABELS: UIKitLabels = {
  close: "Close",
  cancel: "Cancel",
  confirm: "Confirm",
  areYouSure: "Are you sure?",
  period: "Period",
  months: "months",
  retry: "Retry",
  loadError: "Unable to load data. Please try again in a moment.",
};

const DEFAULT_NAVIGATION: UIKitNavigation = {
  push: (href) => window.location.assign(href),
  replace: (href) => window.location.replace(href),
};

const DefaultLink: UIKitLink = (props) => <a {...props} />;

const DEFAULT_CONFIG: UIKitConfig = { Link: DefaultLink, labels: DEFAULT_LABELS, navigation: DEFAULT_NAVIGATION, icons: {} };

const UIKitContext = createContext<UIKitConfig>(DEFAULT_CONFIG);

export interface UIKitProviderProps {
  children: ReactNode;
  labels?: Partial<UIKitLabels>;
  navigation?: UIKitNavigation;
  Link?: UIKitLink;
  icons?: UIKitConfig["icons"];
}

/**
 * Configura il kit per il sito che lo usa: lingua dei testi, router e
 * icone extra. Tutto è facoltativo; senza provider il kit parla inglese
 * e naviga con `window.location`.
 */
export function UIKitProvider({ children, labels, navigation, Link, icons }: UIKitProviderProps) {
  const value = useMemo<UIKitConfig>(
    () => ({
      Link: Link ?? DefaultLink,
      labels: { ...DEFAULT_LABELS, ...labels },
      navigation: navigation ?? DEFAULT_NAVIGATION,
      icons: icons ?? {},
    }),
    [labels, navigation, Link, icons],
  );
  return <UIKitContext.Provider value={value}>{children}</UIKitContext.Provider>;
}

export function useUIKit(): UIKitConfig {
  return useContext(UIKitContext);
}
