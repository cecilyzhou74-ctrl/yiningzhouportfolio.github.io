const resumeRevealItems = [...document.querySelectorAll("[data-resume-reveal]")];
const resumeReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (resumeRevealItems.length && !resumeReducedMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("resume-motion-ready");

  const resumeRevealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  resumeRevealItems.forEach((item) => resumeRevealObserver.observe(item));
} else {
  resumeRevealItems.forEach((item) => item.classList.add("is-visible"));
}
