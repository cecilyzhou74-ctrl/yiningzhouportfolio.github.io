const vitbandCarousel = document.querySelector(".vb-screen-carousel[data-carousel]");

if (vitbandCarousel) {
  const originalScreens = [
    ...vitbandCarousel.querySelectorAll(".screen-slide:not([data-clone])"),
  ];
  const previousButton = vitbandCarousel.querySelector("[data-carousel-prev]");
  const nextButton = vitbandCarousel.querySelector("[data-carousel-next]");
  const screenCount = document.querySelector("[data-vb-screen-count]");
  const screenName = document.querySelector("[data-vb-screen-name]");
  const screenDescription = document.querySelector("[data-vb-screen-description]");
  const progressSteps = [...document.querySelectorAll("[data-vb-screen-step]")];
  const carouselViewport = vitbandCarousel.querySelector(".carousel-viewport");

  const descriptions = [
    "Performance overview and immediate training status.",
    "Muscle activation detail and balance at a glance.",
    "Internal and external load translated into a clear signal.",
    "Force and velocity feedback for active training.",
    "Fatigue detail designed for quick interpretation.",
    "A focused starting point for personalized guidance.",
    "Suggested actions that reduce decision fatigue.",
    "Context-aware coaching translated into natural language.",
    "Past conversations and recommendations in one place.",
  ];

  let currentScreen = 0;
  let carouselMotionTimer;

  function playCarouselMotion(direction) {
    if (!carouselViewport) return;

    const className = direction === "next" ? "is-switching-next" : "is-switching-previous";
    carouselViewport.classList.remove("is-switching-next", "is-switching-previous");
    carouselViewport.getBoundingClientRect();
    carouselViewport.classList.add(className);

    window.clearTimeout(carouselMotionTimer);
    carouselMotionTimer = window.setTimeout(() => {
      carouselViewport.classList.remove(className);
    }, 520);
  }

  function renderScreenMeta() {
    const screen = originalScreens[currentScreen];
    if (!screen) return;

    if (screenCount) {
      screenCount.textContent = `${String(currentScreen + 1).padStart(2, "0")} / ${String(originalScreens.length).padStart(2, "0")}`;
    }
    if (screenName) screenName.textContent = screen.dataset.screenName || "VITBAND";
    if (screenDescription) screenDescription.textContent = descriptions[currentScreen] || "";

    progressSteps.forEach((step, index) => {
      step.classList.toggle("is-active", index === currentScreen);
    });
  }

  previousButton?.addEventListener("click", () => {
    currentScreen = (currentScreen - 1 + originalScreens.length) % originalScreens.length;
    renderScreenMeta();
  });

  nextButton?.addEventListener("click", () => {
    currentScreen = (currentScreen + 1) % originalScreens.length;
    renderScreenMeta();
  });

  renderScreenMeta();

  previousButton?.addEventListener("click", () => playCarouselMotion("previous"), {
    capture: true,
  });
  nextButton?.addEventListener("click", () => playCarouselMotion("next"), {
    capture: true,
  });
}

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!reducedMotionQuery.matches) {
  const maskedTitleSelectors = new Set([
    ".vb-challenge h2",
    ".vb-energy > .vb-container > h2",
    ".vb-highfi h2",
    ".vb-outcome h2",
    ".vb-reflection h2",
  ]);
  const titleSelectors = [
    ".vb-context h2",
    ".vb-challenge h2",
    ".vb-research h2",
    ".vb-competitive h2",
    ".vb-audience h2",
    ".vb-insights h2",
    ".vb-lowfi h2",
    ".vb-ai-decision > .vb-container > h2",
    ".vb-energy > .vb-container > h2",
    ".vb-highfi h2",
    ".vb-hierarchy h2",
    ".vb-outcome h2",
    ".vb-reflection h2",
  ];

  function wrapTitleLines(title, masked) {
    if (!title || title.dataset.vbRevealTitle) return;

    const lines = title.innerHTML.split(/<br\s*\/?>/i);
    const accessibleLabel = lines
      .map((line) => {
        const label = document.createElement("span");
        label.innerHTML = line;
        return label.textContent.replace(/\s+/g, " ").trim();
      })
      .join(" ");
    title.dataset.vbRevealTitle = "";
    if (masked) title.dataset.vbMasked = "";
    title.setAttribute("aria-label", accessibleLabel);
    title.innerHTML = lines
      .map(
        (line, index) =>
          `<span class="vb-title-line" aria-hidden="true"><span class="vb-title-line-inner" style="--vb-line-index:${index}">${line.trim()}</span></span>`,
      )
      .join("");
  }

  titleSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((title) => {
      wrapTitleLines(title, maskedTitleSelectors.has(selector));
    });
  });

  const revealGroups = [
    [".vb-action-flow", 90],
    [".vb-research-framework", 95],
    [".vb-chart-bars", 55],
    [".vb-insight-grid", 110],
    [".vb-strategy-grid", 80],
    [".vb-ai-flow", 100],
    [".vb-energy-comparison", 120],
    [".vb-outcome-grid", 90],
  ];

  revealGroups.forEach(([selector, interval]) => {
    const group = document.querySelector(selector);
    if (!group) return;
    group.dataset.vbRevealGroup = "";
    [...group.children].forEach((child, index) => {
      child.style.setProperty("--vb-delay", `${index * interval}ms`);
    });
  });

  document.body.classList.add("vb-motion-ready");

  const revealTargets = [
    ...document.querySelectorAll("[data-vb-reveal-title], [data-vb-reveal-group]"),
  ];
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

  const strategySection = document.querySelector(".vb-strategy");
  let strategyFrame = 0;

  function updateStrategyMotion() {
    strategyFrame = 0;
    if (!strategySection) return;

    const rect = strategySection.getBoundingClientRect();
    const travel = window.innerHeight + Math.min(rect.height, window.innerHeight);
    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / travel));
    const shift = (1 - progress) * 15;
    const opacity = 0.5 + progress * 0.5;
    strategySection.style.setProperty("--vb-strategy-shift", `${shift.toFixed(2)}px`);
    strategySection.style.setProperty("--vb-strategy-opacity", opacity.toFixed(3));
  }

  function requestStrategyMotion() {
    if (strategyFrame) return;
    strategyFrame = window.requestAnimationFrame(updateStrategyMotion);
  }

  window.addEventListener("scroll", requestStrategyMotion, { passive: true });
  window.addEventListener("resize", requestStrategyMotion);
  updateStrategyMotion();
}
