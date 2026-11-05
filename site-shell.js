const siteLinks = [...document.querySelectorAll("[data-site-link]")];
const siteSlider = document.querySelector("[data-site-slider]");
const siteTrack = document.querySelector("[data-site-track]");
const resumePanel = document.querySelector("#resume");
const workShowcase = document.querySelector("[data-work-showcase]");
const homeTypewriterParts = [...document.querySelectorAll("[data-home-typewriter]")];
const siteRoutes = new Set(["home", "work", "resume"]);
const reduceSiteMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let homeTypewriterTimer = 0;
let homeTypewriterRun = 0;

// Resume used to animate as an unrelated fixed layer. Place it on the same
// horizontal track as Home and Work so all three routes share one motion model.
if (siteTrack && resumePanel && !resumePanel.closest("[data-site-view-panel='resume']")) {
  const resumeView = document.createElement("section");
  resumeView.className = "site-view site-view--resume";
  resumeView.dataset.siteViewPanel = "resume";
  resumeView.setAttribute("aria-label", "Resume");
  resumeView.setAttribute("aria-hidden", "true");
  resumeView.inert = true;
  resumeView.append(resumePanel);
  siteTrack.append(resumeView);
}

const sitePanels = [...document.querySelectorAll("[data-site-view-panel]")];

function cancelHomeTypewriter() {
  homeTypewriterRun += 1;
  window.clearTimeout(homeTypewriterTimer);
  homeTypewriterTimer = 0;
  homeTypewriterParts.forEach((part) => {
    part.classList.remove("is-typewriter-active", "is-typewriter-resting");
  });
}

function showCompleteHomeTypewriter() {
  homeTypewriterParts.forEach((part) => {
    part.textContent = part.dataset.homeTypewriter || "";
  });
  homeTypewriterParts.at(-1)?.classList.add("is-typewriter-resting");
}

function startHomeTypewriter() {
  cancelHomeTypewriter();

  if (!homeTypewriterParts.length) return;
  if (reduceSiteMotion.matches) {
    showCompleteHomeTypewriter();
    return;
  }

  const run = homeTypewriterRun;
  const characterDelay = 38;
  homeTypewriterParts.forEach((part) => {
    part.textContent = "";
  });

  function typePart(partIndex, characterIndex = 0) {
    if (run !== homeTypewriterRun || document.body.dataset.siteView !== "home") return;

    const part = homeTypewriterParts[partIndex];
    const characters = Array.from(part.dataset.homeTypewriter || "");
    homeTypewriterParts.forEach((item) => item.classList.remove("is-typewriter-active"));
    part.classList.add("is-typewriter-active");

    if (characterIndex < characters.length) {
      part.textContent += characters[characterIndex];
      const character = characters[characterIndex];
      const pause = /[,.!?]/.test(character) ? 105 : characterDelay;
      homeTypewriterTimer = window.setTimeout(
        () => typePart(partIndex, characterIndex + 1),
        pause,
      );
      return;
    }

    part.classList.remove("is-typewriter-active");
    if (partIndex < homeTypewriterParts.length - 1) {
      const linePause = part.closest(".home-intro__hello") ? 220 : 70;
      homeTypewriterTimer = window.setTimeout(() => typePart(partIndex + 1), linePause);
      return;
    }

    part.classList.add("is-typewriter-resting");
  }

  homeTypewriterTimer = window.setTimeout(() => typePart(0), 220);
}

function getSiteRoute() {
  const route = window.location.hash.slice(1).toLowerCase();
  return siteRoutes.has(route) ? route : "home";
}

function updateSiteNavigation(route) {
  siteLinks.forEach((link) => {
    const isActive = link.dataset.siteLink === route;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updatePanelAccess(route) {
  sitePanels.forEach((panel) => {
    const isActive = panel.dataset.siteViewPanel === route;
    panel.classList.toggle("is-active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
    panel.inert = !isActive;
  });

  if (workShowcase) {
    const workIsActive = route === "work";
    workShowcase.setAttribute("aria-hidden", String(!workIsActive));
    workShowcase.inert = !workIsActive;
  }
}

function applySiteView(route, { initial = false } = {}) {
  if (initial && siteTrack) {
    siteTrack.style.transition = "none";
  }

  if (route !== "work" && document.body.classList.contains("is-previewing-project")) {
    document.querySelector("[data-preview-close]")?.click();
  }

  document.body.dataset.siteView = route;
  updateSiteNavigation(route);
  updatePanelAccess(route);

  if (route === "home") {
    startHomeTypewriter();
  } else {
    cancelHomeTypewriter();
  }

  const activePanel = sitePanels.find((panel) => panel.dataset.siteViewPanel === route);
  activePanel?.scrollTo({ top: 0, behavior: "auto" });

  if (initial && siteTrack) {
    siteTrack.getBoundingClientRect();
    window.requestAnimationFrame(() => {
      siteTrack.style.removeProperty("transition");
    });
  }
}

function showSiteView(route, options = {}) {
  if (document.body.dataset.siteView === route && !options.initial) return;
  applySiteView(route, options);
}

siteLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const route = link.dataset.siteLink;
    if (!route) return;

    event.preventDefault();
    window.history.pushState(null, "", `#${route}`);
    showSiteView(route);
  });
});

window.addEventListener("hashchange", () => showSiteView(getSiteRoute()));
window.addEventListener("popstate", () => showSiteView(getSiteRoute()));

reduceSiteMotion.addEventListener?.("change", () => {
  if (siteTrack) {
    siteTrack.style.transitionDuration = reduceSiteMotion.matches ? "1ms" : "";
  }
  if (document.body.dataset.siteView === "home") {
    startHomeTypewriter();
  }
});

if (!window.location.hash) {
  window.history.replaceState(null, "", "#home");
}

showSiteView(getSiteRoute(), { initial: true });
