"use strict";

document.documentElement.classList.add("js");

const reducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  const visual = document.querySelector(".hero-visual");

  if (visual) {
    window.addEventListener(
      "pointermove",
      (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 8;
        const y = (event.clientY / window.innerHeight - 0.5) * 8;

        visual.style.transform =
          `translate3d(${x}px, ${y}px, 0)`;
      },
      { passive: true }
    );
  }
}
