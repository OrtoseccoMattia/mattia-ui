// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { UIKitProvider } from "../index";
import { ConfirmationDialog } from "../components/confirmation-dialog";
import { ErrorState } from "../components/error-state";
import { Icon } from "../components/icon";

describe("testi del kit", () => {
  it("senza provider parlano inglese", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByText("Retry")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load data");
  });

  it("il provider li traduce, anche solo in parte", () => {
    render(
      <UIKitProvider labels={{ retry: "Riprova" }}>
        <ErrorState onRetry={() => {}} />
      </UIKitProvider>,
    );
    expect(screen.getByText("Riprova")).toBeInTheDocument();
    // Quelli non indicati restano ai default.
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load data");
  });

  it("ConfirmationDialog usa i testi del provider e conferma una volta sola", () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <UIKitProvider labels={{ areYouSure: "Sei sicuro?", confirm: "Conferma", cancel: "Annulla" }}>
        <ConfirmationDialog open onOpenChange={onOpenChange} message="Eliminare il volume?" onConfirm={onConfirm} />
      </UIKitProvider>,
    );
    expect(screen.getByText("Sei sicuro?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Conferma" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Icon: un nome sconosciuto ripiega sul font, uno extra del provider vince", () => {
    const Custom = ({ className }: { className?: string }) => <svg data-testid="custom" className={className} />;
    const { rerender } = render(<Icon name="non_esiste" />);
    expect(document.querySelector(".material-icons")).toHaveTextContent("non_esiste");
    rerender(
      <UIKitProvider icons={{ non_esiste: Custom }}>
        <Icon name="non_esiste" />
      </UIKitProvider>,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });
});
