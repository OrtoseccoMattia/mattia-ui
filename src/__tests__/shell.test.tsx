// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { BottomTabBar, BottomTabBarAction, TopNav, UIKitProvider, type NavAccent, type NavItem } from "../index";

const accent: NavAccent = { gradient: "from-manga-500 to-manga-alt-500", text: "text-manga-600", border: "border-manga-200" };
const items: NavItem[] = [
  { href: "/collection", label: "Collezione", icon: "library_books" },
  { href: "/calendar", label: "Esplora", icon: "event" },
];

describe("TopNav", () => {
  it("evidenzia solo la voce attiva con il colore di accento", () => {
    render(<TopNav brand={{ href: "/", title: "Sito", icon: "auto_awesome" }} accent={accent} items={items} activeHref="/calendar" />);
    expect(screen.getByRole("link", { name: /Esplora/ })).toHaveClass("text-manga-600");
    expect(screen.getByRole("link", { name: /Collezione/ })).not.toHaveClass("text-manga-600");
  });

  it("su telefono il marchio diventa un pulsante se c'è onBrandPress", () => {
    const onBrandPress = vi.fn();
    render(<TopNav brand={{ href: "/", title: "Sito", icon: "auto_awesome" }} accent={accent} items={items} activeHref={null} onBrandPress={onBrandPress} brandPressLabel="Sito: cambia sezione" />);
    fireEvent.click(screen.getByRole("button", { name: "Sito: cambia sezione" }));
    expect(onBrandPress).toHaveBeenCalledOnce();
  });

  it("mostra le azioni passate dall'esterno", () => {
    render(<TopNav brand={{ href: "/", title: "Sito", icon: "auto_awesome" }} accent={accent} items={items} activeHref={null} actions={<button>Accedi</button>} />);
    expect(screen.getByRole("button", { name: "Accedi" })).toBeInTheDocument();
  });

  it("usa il Link fornito dal provider", () => {
    const Link = ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
      <a data-custom-link href={href} {...rest}>
        {children}
      </a>
    );
    const { container } = render(
      <UIKitProvider Link={Link}>
        <TopNav brand={{ href: "/", title: "Sito", icon: "auto_awesome" }} accent={accent} items={items} activeHref={null} />
      </UIKitProvider>,
    );
    expect(container.querySelectorAll("[data-custom-link]").length).toBeGreaterThan(0);
  });
});

describe("BottomTabBar", () => {
  it("segna aria-current sulla voce attiva", () => {
    render(<BottomTabBar items={items} activeHref="/collection" accent={accent} ariaLabel="Navigazione principale" />);
    expect(screen.getByRole("link", { name: /Collezione/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Esplora/ })).not.toHaveAttribute("aria-current");
  });

  it("è nascosta da lg in su (solo CSS, nessuno stato JS)", () => {
    render(<BottomTabBar items={items} activeHref={null} accent={accent} ariaLabel="Navigazione principale" />);
    expect(screen.getByRole("navigation", { name: "Navigazione principale" })).toHaveClass("lg:hidden");
  });

  it("ospita azioni in coda, come il menu", () => {
    const onClick = vi.fn();
    render(<BottomTabBar items={items} activeHref={null} accent={accent} ariaLabel="Nav" trailing={<BottomTabBarAction icon="menu" label="Menu" onClick={onClick} />} />);
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
