"use client";

import { useEffect, useRef } from "react";
import { useUIKit } from "../provider";

let pushSeq = 0;
/** Id delle istanze aperte, dalla più esterna alla più interna. */
const openStack: number[] = [];

/** Link interno che il router di Next navigherebbe (niente nuove schede,
 *  download, ancore della stessa pagina o destinazioni esterne). */
function internalHref(event: MouseEvent): string | null {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.hasAttribute("download")) return null;
  const target = anchor.getAttribute("target");
  if (target && target !== "_self") return null;
  if (anchor.getAttribute("href")?.startsWith("#")) return null;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) return null;
  return url.pathname + url.search + url.hash;
}

/**
 * Sincronizza open/onOpenChange con la cronologia del browser: mentre è
 * aperto, il tasto indietro (o lo swipe-back) chiude invece di navigare
 * via dalla pagina sotto. Un id per apertura (non un booleano) distingue
 * l'entry di QUESTA istanza da quella di un dialog annidato aperto sopra
 * (es. una conferma dentro un altro dialog): ogni livello ha la propria
 * entry, il back chiude il più interno per primo.
 *
 * I link dentro il dialog (le voci del menu mobile, il cambio sezione)
 * vanno gestiti a parte. Prima la chiusura innescata dal tap faceva
 * `history.back()` per togliere l'entry, ma quel back arrivava mentre la
 * navigazione del link era ancora in corso e la annullava: il router
 * tornava alla pagina di partenza e il tap sembrava non fare nulla.
 * Ora il link sostituisce l'entry del dialog invece di aggiungerne una:
 * la cronologia resta pulita e non serve alcun back.
 */
export function useCloseOnBack(open: boolean | undefined, onOpenChange?: (open: boolean) => void) {
  const { navigation: router } = useUIKit();
  const closedByBackRef = useRef(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const id = ++pushSeq;
    openStack.push(id);
    history.pushState({ __dialogId: id }, "", location.href);

    const onPopState = (event: PopStateEvent) => {
      const state = event.state as { __dialogId?: number } | null;
      if (state?.__dialogId !== id) {
        closedByBackRef.current = true;
        onOpenChange?.(false);
      }
    };
    window.addEventListener("popstate", onPopState);

    // Fase di cattura: gira prima dei gestori React. Il preventDefault
    // ferma la navigazione del <Link> (che controlla defaultPrevented
    // dopo aver eseguito il proprio onClick, quindi chiusura del foglio
    // e cambio contesto avvengono comunque).
    const onClick = (event: MouseEvent) => {
      if (openStack[openStack.length - 1] !== id) return;
      const href = internalHref(event);
      if (!href) return;
      event.preventDefault();
      navigatedRef.current = true;
      const current = history.state as { __dialogId?: number } | null;
      if (current?.__dialogId === id) router.replace(href);
      else router.push(href);
      onOpenChange?.(false);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick, true);
      const index = openStack.lastIndexOf(id);
      if (index !== -1) openStack.splice(index, 1);
      if (closedByBackRef.current || navigatedRef.current) {
        closedByBackRef.current = false;
        navigatedRef.current = false;
        return;
      }
      // Chiusura per altra via (bottone, overlay, salvataggio...): rimuovere
      // l'entry pushata così un "avanti" del browser non riapre un dialog
      // fantasma. Solo se è ancora la nostra (nulla l'ha già rimossa).
      const current = history.state as { __dialogId?: number } | null;
      if (current?.__dialogId === id) {
        history.back();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
}
