import { afterEach } from "vitest";

// Solo per i test di componenti (docblock `@vitest-environment jsdom`):
// negli altri file non c'è un DOM e non serve né il matcher né la pulizia.
if (typeof document !== "undefined") {
  const { cleanup } = await import("@testing-library/react");
  await import("@testing-library/jest-dom/vitest");
  afterEach(() => cleanup());
}
