const contentPanel = document.querySelector(".content-panel");
const navButtons = [...document.querySelectorAll(".nav-link")];
const subNavButtons = [...document.querySelectorAll(".nav-sublink")];
const projectNavGroups = [...document.querySelectorAll("[data-project-nav]")];
const sections = [...document.querySelectorAll(".section-block")];
const subSectionIds = subNavButtons.map((button) => button.dataset.target);

function setActiveNav(targetId) {
  navButtons.forEach((button) => {
    const group = button.closest("[data-project-nav]");
    const childTargets = group ? [...group.querySelectorAll(".nav-sublink")].map((link) => link.dataset.target) : [];
    const isProjectChild = childTargets.includes(targetId);
    button.classList.toggle("is-active", button.dataset.target === targetId || isProjectChild);
  });

  projectNavGroups.forEach((group) => {
    const projectButton = group.querySelector(".nav-link-project");
    const childTargets = [...group.querySelectorAll(".nav-sublink")].map((link) => link.dataset.target);
    const isExpanded = projectButton?.dataset.target === targetId || childTargets.includes(targetId);
    group.classList.toggle("is-expanded", isExpanded);
    projectButton?.setAttribute("aria-expanded", String(isExpanded));
  });

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

subSectionIds.forEach((id) => {
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

const heroStage = document.querySelector("[data-hero-stage]");
const heroButtons = [...document.querySelectorAll(".project-track .project-sticker")];
const projectHint = document.querySelector("[data-project-hint]");
const carouselButtons = [...document.querySelectorAll("[data-carousel-select]")];
const projectPreview = document.querySelector("[data-project-preview]");
const previewImage = projectPreview?.querySelector("[data-preview-image]");
const previewTitle = projectPreview?.querySelector("[data-preview-title]");
const previewTags = projectPreview?.querySelector("[data-preview-tags]");
const previewOverview = projectPreview?.querySelector("[data-preview-overview]");
const previewGo = projectPreview?.querySelector("[data-preview-go]");
const previewClose = projectPreview?.querySelector("[data-preview-close]");
const previewNavButtons = [...document.querySelectorAll("[data-preview-nav]")];

const projectDetails = {
  vitband: {
    title: "VITBAND",
    tags: "UI/UX Design · Product Design · B2C Mobile App",
    image: "assets/hero/vitband-object.png",
    page: "vitband.html",
    overview:
      "VITBAND is a fitness technology platform designed to help users better understand their physical condition during training. By connecting with a wearable fitness band, the app tracks muscle fatigue, workout activity, and recovery data, helping users make more informed decisions about training and recovery. As the UI/UX Designer, I worked on the end-to-end mobile experience, including user flows, information architecture, wireframes, interactive prototypes, and high-fidelity interface design. I also designed key features including real-time muscle monitoring, AI Coach, workout history, and data dashboards.",
  },
  heytea: {
    title: "HEYTEA",
    tags: "Brand Identity · Rebranding · Visual Design",
    image: "assets/hero/heytea-object.png",
    page: "heytea.html",
    overview:
      "HEYTEA is a rebranding project focused on refreshing the brand through a more contemporary and distinctive visual identity. I developed a new visual direction through typography, color, graphic elements, packaging, and brand applications. The project explores how a cohesive visual system can strengthen brand recognition while creating a more consistent and engaging experience across different brand touchpoints.",
  },
  nomoo: {
    title: "NOMOO",
    tags: "Editorial Design · Publication Design · Web Design",
    image: "assets/hero/nomoo-object.png",
    page: "nomoo.html",
    overview:
      "NOMOO is an editorial design project that extends a publication concept from print into a digital experience. I designed both the physical publication and its accompanying website, focusing on typography, editorial layout, visual hierarchy, imagery, and the relationship between print and screen. The project creates a consistent visual language while adapting the content and reading experience across different formats.",
  },
  floyce: {
    title: "FLOYCE",
    tags: "Art Direction · Campaign Design · Content Creation",
    image: "assets/hero/floyce-object.png",
    page: "floyce.html",
    overview:
      "FLOYCE is a women’s footwear brand project focused on creating visual content that communicates the personality and qualities of its products. I worked across creative concept development, art direction, photography, video production, editing, motion graphics, and campaign design. Through a series of product-focused visuals and social media content, I developed playful and experimental ways to present the shoes while maintaining a consistent brand identity.",
  },
};

let selectedHeroIndex = heroButtons.findIndex((button) => button.classList.contains("is-selected"));
if (selectedHeroIndex < 0) selectedHeroIndex = 0;

function getSelectedProject() {
  return projectDetails[heroButtons[selectedHeroIndex]?.dataset.projectKey] || projectDetails.vitband;
}

function updateHeroSelection(index) {
  if (heroButtons.length === 0) return;
  selectedHeroIndex = (index + heroButtons.length) % heroButtons.length;

  heroButtons.forEach((button, buttonIndex) => {
    const distance = Math.min(
      Math.abs(buttonIndex - selectedHeroIndex),
      heroButtons.length - Math.abs(buttonIndex - selectedHeroIndex),
    );
    button.classList.toggle("is-selected", buttonIndex === selectedHeroIndex);
    button.classList.toggle("is-neighbor", distance === 1);
    button.classList.toggle("is-dim", distance > 1);
  });
}

function renderProjectPreview() {
  const project = getSelectedProject();
  if (!projectPreview || !project) return;

  previewImage.src = project.image;
  previewImage.alt = `${project.title} project preview`;
  previewTitle.textContent = project.title;
  previewTags.innerHTML = project.tags
    .split(" · ")
    .map((tag) => `<span>${tag}</span>`)
    .join("");
  previewOverview.textContent = project.overview;
  previewGo.href = project.page;
  projectPreview.hidden = false;
  heroStage?.classList.add("is-previewing");
  projectHint && (projectHint.hidden = true);
}

function closeProjectPreview() {
  if (!projectPreview) return;
  projectPreview.hidden = true;
  heroStage?.classList.remove("is-previewing");
}

heroButtons.forEach((button, buttonIndex) => {
  const showHoverHint = () => {
    updateHeroSelection(buttonIndex);
    if (projectHint) projectHint.hidden = true;
  };

  button.addEventListener("mouseenter", showHoverHint);
  button.addEventListener("focus", showHoverHint);
  button.addEventListener("click", () => {
    updateHeroSelection(buttonIndex);
    renderProjectPreview();
  });
});

document.querySelector(".project-track")?.addEventListener("mouseleave", () => {
  if (projectHint && !heroStage?.classList.contains("is-previewing")) projectHint.hidden = true;
});

carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateHeroSelection(selectedHeroIndex + (button.dataset.carouselSelect === "next" ? 1 : -1));
  });
});

previewNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateHeroSelection(selectedHeroIndex + (button.dataset.previewNav === "next" ? 1 : -1));
    renderProjectPreview();
  });
});

previewClose?.addEventListener("click", closeProjectPreview);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProjectPreview();
});

updateHeroSelection(selectedHeroIndex);

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
    cursorDot.classList.toggle(
      "is-hovering",
      Boolean(event.target.closest("a, button, input, textarea, select, [role='button']")),
    );
  });
}
