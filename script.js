const contentPanel = document.querySelector(".content-panel");
const navButtons = [...document.querySelectorAll(".nav-link")];
const subNavButtons = [...document.querySelectorAll(".nav-sublink")];
const projectNavGroup = document.querySelector("[data-project-nav]");
const projectNavButton = projectNavGroup?.querySelector(".nav-link-project");
const sections = [...document.querySelectorAll(".section-block")];
const vitbandSubSections = ["vitband-overview", "vitband-research", "vitband-insights", "vitband-highfi"];

function setActiveNav(targetId) {
  navButtons.forEach((button) => {
    const isProjectChild = targetId.startsWith("vitband-") && button.dataset.target === "project-one";
    button.classList.toggle("is-active", button.dataset.target === targetId || isProjectChild);
  });

  const isVitband = targetId === "project-one" || targetId.startsWith("vitband-");
  projectNavGroup?.classList.toggle("is-expanded", isVitband);
  projectNavButton?.setAttribute("aria-expanded", String(isVitband));

  subNavButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === targetId);
  });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(button.dataset.target);
  });
});

subNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveNav(button.dataset.target);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveNav(visible.target.id);
    }
  },
  {
    root: contentPanel,
    threshold: [0.05, 0.2, 0.45, 0.75],
  },
);

sections.forEach((section) => observer.observe(section));

const subSectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveNav(visible.target.id);
    }
  },
  {
    root: contentPanel,
    threshold: [0.14, 0.32, 0.56],
  },
);

vitbandSubSections.forEach((id) => {
  const section = document.getElementById(id);
  if (section) subSectionObserver.observe(section);
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const viewport = carousel.querySelector(".carousel-viewport");
  const track = carousel.querySelector(".carousel-track");
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const originals = [...track.children];
  if (!viewport || !track || !prevButton || !nextButton || originals.length === 0) return;

  let visibleCount = window.matchMedia("(max-width: 760px)").matches ? 1 : 3;
  let index = visibleCount;
  let slideStep = 0;
  let isAnimating = false;

  function rebuildClones() {
    track.querySelectorAll("[data-clone]").forEach((clone) => clone.remove());
    visibleCount = window.matchMedia("(max-width: 760px)").matches ? 1 : 3;

    originals.slice(-visibleCount).reverse().forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.dataset.clone = "true";
      track.prepend(clone);
    });

    originals.slice(0, visibleCount).forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.dataset.clone = "true";
      track.append(clone);
    });

    index = visibleCount;
  }

  function measure() {
    const firstSlide = track.querySelector(".screen-slide");
    if (!firstSlide) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    slideStep = firstSlide.getBoundingClientRect().width + gap;
  }

  function setPosition(animate = true) {
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(${-index * slideStep}px)`;

    if (!animate) {
      track.getBoundingClientRect();
      track.style.transition = "";
    }
  }

  function move(direction) {
    if (isAnimating) return;
    isAnimating = true;
    index += direction;
    setPosition(true);
  }

  rebuildClones();
  measure();
  setPosition(false);

  nextButton.addEventListener("click", () => move(1));
  prevButton.addEventListener("click", () => move(-1));

  track.addEventListener("transitionend", () => {
    if (index >= originals.length + visibleCount) {
      index = visibleCount;
      setPosition(false);
    }

    if (index < visibleCount) {
      index = originals.length + visibleCount - 1;
      setPosition(false);
    }

    isAnimating = false;
  });

  window.addEventListener("resize", () => {
    rebuildClones();
    measure();
    setPosition(false);
  });
});
