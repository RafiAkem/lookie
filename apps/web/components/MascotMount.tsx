"use client";

import { useEffect } from "react";

export function MascotMount({ src }: { src?: string }) {
  useEffect(() => {
    // Dynamically import lookie on client side to initialize listener loop and mascot
    import("lookie").then(({ Lookie }) => {
      // Lookie auto-initializes on import, ensure it finds the DOM node
      if (!Lookie.el) {
        // In case initialized before DOM ready, lookie runs init on module load
      }
    });
  }, []);

  return (
    <div
      className="lookie"
      {...(src ? { "data-lookie-src": src } : {})}
      data-lookie-auto
      aria-hidden="true"
    >
      <div className="bob-wrap" />
    </div>
  );
}
