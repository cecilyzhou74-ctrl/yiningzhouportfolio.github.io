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
const previewEditorial = projectPreview?.querySelector(".project-hero__editorial");
const previewGo = projectPreview?.querySelector("[data-preview-go]");
const previewCount = projectPreview?.querySelector("[data-preview-count]");
const previewClose = projectPreview?.querySelector("[data-preview-close]");
const previewNavButtons = [...document.querySelectorAll("[data-preview-nav]")];
const catSpeech = document.querySelector("[data-cat-speech]");
const catSpeechText = catSpeech?.querySelector("[data-cat-speech-text]");

const catSpeechMessages = {
  default: "Pick a project below and take a look around, meow.",
  vitband:
    "This is VITBAND — a fitness-tech product where I designed the end-to-end mobile experience, from user flows and interaction design to high-fidelity UI.",
  heytea:
    "This is HEYTEA — a rebranding and visual design project where I explored a refreshed identity system, graphic language, and brand applications.",
  nomoo:
    "This is NOMOO — a publication and web design project combining editorial layout, typography, visual storytelling, and a digital experience.",
  floyce:
    "This is FLOYCE — a creative content and advertising project spanning campaign concepts, poster design, art direction, photography, and social media visuals.",
};

let catSpeechTimer = null;

function setCatSpeech(state = "default") {
  if (!catSpeech || !catSpeechText || !catSpeechMessages[state]) return;
  if (catSpeech.dataset.speechState === state && catSpeechText.textContent === catSpeechMessages[state]) return;

  window.clearTimeout(catSpeechTimer);
  catSpeech.dataset.speechState = state;
  catSpeech.classList.add("is-changing");
  catSpeechTimer = window.setTimeout(() => {
    catSpeechText.textContent = catSpeechMessages[state];
    catSpeech.classList.remove("is-changing");
  }, 70);
}

function resetCatSpeechWhenIdle() {
  window.requestAnimationFrame(() => {
    const hasActiveProject = heroButtons.some(
      (button) => button.matches(":hover") || button === document.activeElement,
    );
    if (!hasActiveProject) setCatSpeech("default");
  });
}

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

function alignPreviewEditorial() {
  if (!projectPreview || projectPreview.hidden || !previewTitle || !previewEditorial) return;

  const titleRect = previewTitle.getBoundingClientRect();
  const editorialRect = previewEditorial.getBoundingClientRect();
  projectPreview.style.setProperty(
    "--project-editorial-left",
    `${titleRect.right - editorialRect.width}px`,
  );
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

  projectPreview.dataset.project = heroButtons[selectedHeroIndex]?.dataset.projectKey || "vitband";
  previewImage.src = project.image;
  previewImage.alt = `${project.title} project preview`;
  previewTitle.textContent = project.title;
  previewTags.innerHTML = project.tags
    .split(" · ")
    .map((tag) => `<span>${tag}</span>`)
    .join("");
  previewOverview.textContent = project.overview;
  previewGo.href = project.page;
  if (previewCount) {
    previewCount.textContent = `${String(selectedHeroIndex + 1).padStart(2, "0")}/${String(heroButtons.length).padStart(2, "0")}`;
  }
  projectPreview.hidden = false;
  alignPreviewEditorial();
  projectPreview.classList.remove("is-leaving");
  projectPreview.classList.remove("is-animating");
  void projectPreview.offsetWidth;
  projectPreview.classList.add("is-animating");
  heroStage?.classList.add("is-previewing");
  document.body.classList.add("is-previewing-project");
  projectHint && (projectHint.hidden = true);
}

function closeProjectPreview() {
  if (!projectPreview) return;
  projectPreview.hidden = true;
  projectPreview.classList.remove("is-animating");
  heroStage?.classList.remove("is-previewing");
  document.body.classList.remove("is-previewing-project");
}

heroButtons.forEach((button, buttonIndex) => {
  const showHoverHint = () => {
    updateHeroSelection(buttonIndex);
    setCatSpeech(button.dataset.projectKey);
    if (projectHint) projectHint.hidden = true;
  };

  button.addEventListener("mouseenter", showHoverHint);
  button.addEventListener("focus", showHoverHint);
  button.addEventListener("mouseleave", resetCatSpeechWhenIdle);
  button.addEventListener("blur", resetCatSpeechWhenIdle);
  button.addEventListener("click", () => {
    updateHeroSelection(buttonIndex);
    renderProjectPreview();
  });
});

document.querySelector(".project-track")?.addEventListener("mouseleave", () => {
  resetCatSpeechWhenIdle();
  if (projectHint && !heroStage?.classList.contains("is-previewing")) projectHint.hidden = true;
});

carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateHeroSelection(selectedHeroIndex + (button.dataset.carouselSelect === "next" ? 1 : -1));
  });
});

previewNavButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.previewNav === "next" ? 1 : -1;
    if (!projectPreview || projectPreview.classList.contains("is-leaving")) return;

    projectPreview.dataset.transitionDirection = direction > 0 ? "next" : "previous";
    projectPreview.classList.remove("is-animating");
    projectPreview.classList.add("is-leaving");

    window.setTimeout(() => {
      updateHeroSelection(selectedHeroIndex + direction);
      renderProjectPreview();
    }, 220);
  });
});

previewClose?.addEventListener("click", closeProjectPreview);
window.addEventListener("resize", alignPreviewEditorial);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProjectPreview();
});

updateHeroSelection(selectedHeroIndex);

const heroHome = document.querySelector(".hero-home");
const catContainer = document.querySelector("[data-cat-container]");
const catImages = [...document.querySelectorAll("[data-cat-angle]")];
const catFrames = new Map(catImages.map((image) => [Number(image.dataset.catAngle), image]));
let activeCatAngle = 0;
let catPointerFrame = null;
let lastCatPointer = null;

catImages.forEach((image) => {
  const preload = new Image();
  preload.src = image.currentSrc || image.src;
});

function setCatAngle(angle) {
  if (!catFrames.has(angle) || angle === activeCatAngle) return;
  catFrames.get(activeCatAngle)?.classList.remove("is-active");
  catFrames.get(angle)?.classList.add("is-active");
  activeCatAngle = angle;
}

function updateCatDirection() {
  catPointerFrame = null;
  if (!catContainer || !lastCatPointer) return;

  const rect = catContainer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = lastCatPointer.x - centerX;
  const dy = lastCatPointer.y - centerY;
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  const nearestAngle = (Math.round(((angle + 360) % 360) / 45) * 45) % 360;

  setCatAngle(nearestAngle);
}

heroHome?.addEventListener("pointermove", (event) => {
  lastCatPointer = { x: event.clientX, y: event.clientY };
  if (catPointerFrame === null) {
    catPointerFrame = window.requestAnimationFrame(updateCatDirection);
  }
});

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
