const heyteaReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!heyteaReducedMotion.matches) {
  const titleElements = [...document.querySelectorAll(".ht-reveal-title")];

  function wrapTitleLines(title) {
    if (!title || title.dataset.htRevealTitle !== undefined) return;

    const lines = title.innerHTML.split(/<br\s*\/?>/i);
    const accessibleLabel = lines
      .map((line) => {
        const label = document.createElement("span");
        label.innerHTML = line;
        return label.textContent.replace(/\s+/g, " ").trim();
      })
      .join(" ");

    title.dataset.htRevealTitle = "";
    title.setAttribute("aria-label", accessibleLabel);
    title.innerHTML = lines
      .map(
        (line, index) =>
          `<span class="ht-title-line" aria-hidden="true"><span class="ht-title-line-inner" style="--ht-line-index:${index}">${line.trim()}</span></span>`,
      )
      .join("");
  }

  titleElements.forEach(wrapTitleLines);

  const revealTargets = [
    ...titleElements,
    ...document.querySelectorAll("[data-ht-sequence], [data-ht-lines]"),
  ];

  document.querySelectorAll("[data-ht-sequence]").forEach((group) => {
    [...group.children].forEach((child, index) => {
      child.style.setProperty("--ht-delay", `${index * 90}ms`);
    });
  });

  document.body.classList.add("ht-motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));

  const vessels = [...document.querySelectorAll("[data-ht-float]")];
  let vesselFrame = 0;

  function updateVesselMotion() {
    vesselFrame = 0;

    vessels.forEach((vessel) => {
      const rect = vessel.getBoundingClientRect();
      const viewportRange = window.innerHeight + rect.height;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / viewportRange));
      const distance = Number(vessel.dataset.htFloat || 0);
      const offset = (progress - 0.5) * distance * 2;
      vessel.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });
  }

  function requestVesselMotion() {
    if (vesselFrame) return;
    vesselFrame = window.requestAnimationFrame(updateVesselMotion);
  }

  window.addEventListener("scroll", requestVesselMotion, { passive: true });
  window.addEventListener("resize", requestVesselMotion);
  updateVesselMotion();
}
