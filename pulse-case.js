(() => {
  const sectionLinks = Array.from(document.querySelectorAll("[data-pulse-section-link]"));
  const sectionTargets = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sectionLinks.length && sectionTargets.length) {
    let sectionFrame = null;

    const updateSectionNavigation = () => {
      const marker = window.innerHeight * 0.34;
      let activeSection = sectionTargets[0];

      sectionTargets.forEach((section) => {
        if (section.getBoundingClientRect().top <= marker) activeSection = section;
      });

      sectionLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeSection.id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });

      sectionFrame = null;
    };

    const requestSectionNavigationUpdate = () => {
      if (sectionFrame !== null) return;
      sectionFrame = window.requestAnimationFrame(updateSectionNavigation);
    };

    window.addEventListener("scroll", requestSectionNavigationUpdate, { passive: true });
    window.addEventListener("resize", requestSectionNavigationUpdate);
    sectionLinks.forEach((link) => link.addEventListener("click", () => {
      const targetLink = link;
      sectionLinks.forEach((item) => {
        const isActive = item === targetLink;
        item.classList.toggle("is-active", isActive);
        if (isActive) item.setAttribute("aria-current", "location");
        else item.removeAttribute("aria-current");
      });
    }));

    updateSectionNavigation();
  }

  document.querySelectorAll("[data-tonight-carousel]").forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll("[data-tonight-slide]"));
    const previous = carousel.querySelector("[data-tonight-prev]");
    const next = carousel.querySelector("[data-tonight-next]");
    const current = carousel.querySelector("[data-tonight-current]");
    const viewport = carousel.querySelector(".pulse-tonight__viewport");
    let activeIndex = 0;
    let pointerStartX = null;

    const showSlide = (nextIndex, direction) => {
      activeIndex = (nextIndex + slides.length) % slides.length;
      carousel.dataset.direction = direction;

      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      current.textContent = String(activeIndex + 1).padStart(2, "0");
    };

    previous?.addEventListener("click", () => showSlide(activeIndex - 1, "prev"));
    next?.addEventListener("click", () => showSlide(activeIndex + 1, "next"));

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(activeIndex - 1, "prev");
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(activeIndex + 1, "next");
      }
    });

    viewport?.addEventListener("pointerdown", (event) => {
      pointerStartX = event.clientX;
    });

    viewport?.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;

      if (Math.abs(distance) < 38) return;
      showSlide(activeIndex + (distance < 0 ? 1 : -1), distance < 0 ? "next" : "prev");
    });

    viewport?.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });
  });

  const flowScroll = document.querySelector(".pulse-flow-scroll");
  const flowScrollbarThumb = document.querySelector(".pulse-flow-scrollbar__thumb");

  if (flowScroll && flowScrollbarThumb) {
    const updateFlowScrollbar = () => {
      const viewportHeight = flowScroll.clientHeight;
      const scrollableHeight = flowScroll.scrollHeight;
      const thumbHeight = Math.max(32, viewportHeight * (viewportHeight / scrollableHeight));
      const availableTravel = Math.max(0, viewportHeight - thumbHeight);
      const availableScroll = Math.max(1, scrollableHeight - viewportHeight);
      const progress = flowScroll.scrollTop / availableScroll;

      flowScrollbarThumb.style.height = `${thumbHeight}px`;
      flowScrollbarThumb.style.transform = `translateY(${availableTravel * progress}px)`;
    };

    flowScroll.addEventListener("scroll", updateFlowScrollbar, { passive: true });
    window.addEventListener("resize", updateFlowScrollbar);
    flowScroll.querySelector("img")?.addEventListener("load", updateFlowScrollbar);
    window.requestAnimationFrame(updateFlowScrollbar);
  }

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
