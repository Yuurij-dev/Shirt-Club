"use client";

import { useEffect } from "react";

export function useScrollReveal(
  selector: string,
  options = {}
) {
  useEffect(() => {
    async function init() {
      if (typeof window === "undefined") return;

      const ScrollReveal = (await import("scrollreveal")).default;

      ScrollReveal().reveal(selector, {
        distance: "100px",
        duration: 600,
        easing: "ease-in-out",
        ...options,
      });
    }

    init();
  }, [selector, options]);
}
