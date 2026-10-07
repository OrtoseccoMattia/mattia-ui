"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { useCloseOnBack } from "../hooks/use-close-on-back"
import { useUIKit } from "../provider"
import { XIcon } from "lucide-react"

/**
 * Varianti di presentazione del contenuto.
 *
 * Su desktop tutte e tre si comportano come un dialog centrato: la
 * differenza esiste solo sotto il breakpoint `sm`, dove la convenzione
 * nativa non è il rettangolo galleggiante ma il foglio ancorato a un
 * bordo dello schermo.
 *
 * - `sheet`      bottom sheet trascinabile, altezza a contenuto (default)
 * - `fullscreen` occupa tutto lo schermo: per i form lunghi
 * - `center`     resta centrato anche su mobile: per conferme brevi
 */
type DialogVariant = "sheet" | "fullscreen" | "center"

function Dialog({
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  // Il back/swipe-back del browser deve chiudere il dialog invece di
  // navigare via dalla pagina sotto — vedi hooks/use-close-on-back.ts.
  useCloseOnBack(open, onOpenChange)
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      open={open}
      onOpenChange={onOpenChange}
      {...props}
    />
  )
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      // z-[200]: sopra tab bar e barre di selezione, che sono fixed ma
      // non portalate e quindi non partecipano allo stacking del portal.
      className={cn(
        "fixed inset-0 isolate z-[200] bg-black/60 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

const VARIANT_CLASSES: Record<DialogVariant, string> = {
  // Ancorato al fondo, a tutta larghezza, angoli superiori arrotondati.
  // Nessun `translate`: il centraggio verticale su uno schermo alto e
  // stretto lasciava il footer azioni sotto la home indicator.
  sheet:
    "inset-x-0 bottom-0 top-auto w-full max-w-none rounded-t-3xl rounded-b-none max-h-[92dvh] " +
    "data-open:slide-in-from-bottom data-closed:slide-out-to-bottom",
  fullscreen:
    "inset-0 w-full max-w-none rounded-none h-full max-h-none " +
    "data-open:slide-in-from-bottom data-closed:slide-out-to-bottom",
  center:
    "top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl max-h-[85dvh] " +
    "data-open:zoom-in-95 data-closed:zoom-out-95",
}

// Da `sm` in su ogni variante torna al dialog centrato classico:
// il comportamento desktop non cambia rispetto a prima.
const DESKTOP_CLASSES =
  "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:bottom-auto sm:h-auto " +
  "sm:w-full sm:max-w-sm sm:max-h-[90svh] sm:-translate-x-1/2 sm:-translate-y-1/2 " +
  "sm:rounded-xl sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95 " +
  "sm:data-open:slide-in-from-bottom-0 sm:data-closed:slide-out-to-bottom-0"

/** Oltre questo trascinamento (px) il foglio si chiude al rilascio. */
const DISMISS_DISTANCE = 110
/** …oppure con un flick verso il basso più rapido di così (px/s). */
const DISMISS_VELOCITY = 550

function DialogContent({
  className,
  children,
  showCloseButton = true,
  variant = "sheet",
  showGrabber,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  variant?: DialogVariant
  /** Maniglia di trascinamento. Default: attiva sulla variante `sheet`. */
  showGrabber?: boolean
}) {
  const { labels } = useUIKit()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const gesture = React.useRef<{ id: number; startY: number; startT: number } | null>(null)
  const [dragY, setDragY] = React.useState(0)

  const draggable = variant === "sheet"
  const grabber = showGrabber ?? draggable

  // Trascinamento per chiudere, come nei fogli di sistema iOS.
  //
  // Implementato con pointer events invece che con framer-motion perché
  // l'animazione di entrata è una @keyframes CSS che agisce su
  // `transform`: uno stile inline permanente la annullerebbe. Qui il
  // transform viene scritto solo mentre il gesto è in corso, ossia
  // quando l'animazione di entrata è già terminata.
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || event.pointerType === "mouse") return
    const target = event.target as HTMLElement

    // Il gesto parte dalla maniglia, oppure da un punto qualsiasi del
    // foglio purché non stia scrollando un contenuto già in cima:
    // altrimenti si ruberebbe lo scroll alle liste interne.
    const fromGrabber = !!target.closest("[data-sheet-grabber]")
    const scroller = target.closest<HTMLElement>("[data-slot=dialog-body], .scroll-area")
    if (!fromGrabber && scroller && scroller.scrollTop > 0) return
    // Non intercettare i gesti su controlli interattivi.
    if (!fromGrabber && target.closest("input, textarea, select, button, a, [role=slider]")) return

    gesture.current = { id: event.pointerId, startY: event.clientY, startT: event.timeStamp }
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.id !== event.pointerId) return
    const delta = event.clientY - g.startY
    // Solo verso il basso: il foglio non si stacca dal bordo inferiore.
    if (delta <= 0) {
      if (dragY !== 0) setDragY(0)
      return
    }
    setDragY(delta)
  }

  const endGesture = (event: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current
    if (!g || g.id !== event.pointerId) return
    gesture.current = null

    const delta = event.clientY - g.startY
    const elapsed = Math.max(event.timeStamp - g.startT, 1)
    const velocity = (delta / elapsed) * 1000

    if (delta > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
      // La chiusura passa da Radix, che ripristina focus e scroll lock.
      contentRef.current
        ?.querySelector<HTMLElement>("[data-slot=dialog-dismiss]")
        ?.click()
    }
    setDragY(0)
  }

  const dragging = dragY > 0

  return (
    <DialogPortal>
      <DialogOverlay />
        <DialogPrimitive.Content
          ref={contentRef}
          data-slot="dialog-content"
          data-variant={variant}
          data-dragging={dragging || undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
          style={
            dragging
              ? {
                  transform: `translateY(${dragY}px)`,
                  // Il foglio sbiadisce mentre scende: il gesto ha un
                  // riscontro visivo prima ancora di completarsi.
                  opacity: Math.max(0.55, 1 - dragY / 420),
                  transition: "none",
                }
              : undefined
          }
          className={cn(
            "fixed z-[210] flex flex-col gap-4 bg-popover p-4 text-sm text-popover-foreground",
            "ring-1 ring-foreground/10 duration-200 outline-none",
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            // Ritorno elastico quando il trascinamento non basta a
            // chiudere. Durante il gesto lo stile inline imposta
            // `transition: none`, così il foglio segue il dito.
            "transition-[transform,opacity] duration-200",
            VARIANT_CLASSES[variant],
            DESKTOP_CLASSES,
            className
          )}
          {...props}
        >
          {/* Bersaglio interno usato dal gesto per chiudere. */}
          <DialogPrimitive.Close data-slot="dialog-dismiss" className="hidden" />

          {grabber && (
            <div
              data-sheet-grabber
              data-app-chrome
              aria-hidden
              className="mx-auto -mt-1 mb-1 h-1.5 w-10 shrink-0 cursor-grab touch-none rounded-full bg-foreground/20 sm:hidden"
            />
          )}

          {children}

          {showCloseButton && (
            <DialogPrimitive.Close data-slot="dialog-close" asChild>
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              >
                <XIcon />
                <span className="sr-only">{labels.close}</span>
              </Button>
            </DialogPrimitive.Close>
          )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex shrink-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

/**
 * Corpo scorrevole. Va usato quando il contenuto può superare
 * l'altezza disponibile: `overscroll-contain` impedisce che, arrivati
 * in fondo alla lista, lo scroll prosegua trascinando la pagina sotto
 * — comportamento che su iOS fa sembrare il modale "attaccato" alla
 * pagina invece che sovrapposto.
 */
function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "-mx-4 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4",
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const { labels } = useUIKit()
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex shrink-0 flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4",
        // Resta sopra home indicator e tastiera virtuale.
        "pb-[calc(1rem+env(safe-area-inset-bottom)+var(--kb-inset,0px))]",
        "sm:flex-row sm:justify-end sm:pb-4",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">{labels.close}</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
