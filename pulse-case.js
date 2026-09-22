(() => {
  const revealTargets = document.querySelectorAll(
    ".pulse-reveal, .pulse-reveal-title, .pulse-sequence, [data-pulse-sequence]"
  );

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10%",
      threshold: 0.08,
    }
  );

  revealTargets.forEach((target) => observer.observe(target));

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (finePointer.matches) {
    const cursorDot = document.createElement("div");
    cursorDot.className = "custom-cursor";
    cursorDot.setAttribute("aria-hidden", "true");
    document.body.append(cursorDot);

    window.addEventListener("pointermove", (event) => {
      cursorDot.style.left = `${event.clientX}px`;
      cursorDot.style.top = `${event.clientY}px`;
      cursorDot.classList.add("is-visible");
    });

    document.addEventListener("pointerleave", () => {
      cursorDot.classList.remove("is-visible");
    });

    document.addEventListener("pointerover", (event) => {
      const target = event.target instanceof Element ? event.target : null;
      cursorDot.classList.toggle(
        "is-hovering",
        Boolean(target?.closest("a, button, input, textarea, select, [role='button']")),
      );
    });
  }
})();
