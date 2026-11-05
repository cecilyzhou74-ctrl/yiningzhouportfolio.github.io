(() => {
const workShowcaseRoot = document.querySelector("[data-work-showcase]");

if (workShowcaseRoot) {
  const workScroller = workShowcaseRoot.querySelector("[data-work-scroller]");
  const indexItems = [...workShowcaseRoot.querySelectorAll("[data-work-target]")];
  const cards = [...workShowcaseRoot.querySelectorAll("[data-work-card]")];
  const reduceWorkMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let scrollFrame = 0;
  let activeLockUntil = 0;

  function setActiveProject(key) {
    indexItems.forEach((item) => {
      const isActive = item.dataset.workTarget === key;
      item.classList.toggle("is-active", isActive);
      if (isActive) {
        item.setAttribute("aria-current", "true");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveFromScroll() {
    scrollFrame = 0;
    if (!workScroller || !cards.length) return;
    if (Date.now() < activeLockUntil) return;

    const scrollerTop = workScroller.getBoundingClientRect().top;
    const marker = scrollerTop + Math.min(92, workScroller.clientHeight * 0.22);
    let activeCard = cards[0];

    cards.forEach((card) => {
      if (card.getBoundingClientRect().top <= marker) activeCard = card;
    });

    setActiveProject(activeCard.dataset.workCard);
  }

  indexItems.forEach((item) => {
    item.addEventListener("click", () => {
      const key = item.dataset.workTarget;
      const card = cards.find((candidate) => candidate.dataset.workCard === key);
      if (!card || !workScroller) return;

      activeLockUntil = Date.now() + (reduceWorkMotion.matches ? 50 : 900);
      setActiveProject(key);
      workScroller.scrollTo({
        top: card.offsetTop - cards[0].offsetTop,
        behavior: reduceWorkMotion.matches ? "auto" : "smooth",
      });
    });
  });

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => setActiveProject(card.dataset.workCard));
    card.addEventListener("focus", () => setActiveProject(card.dataset.workCard));
  });

  workScroller?.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateActiveFromScroll);
  }, { passive: true });

  window.addEventListener("resize", updateActiveFromScroll, { passive: true });
  setActiveProject(cards[0]?.dataset.workCard || "flex");
}
})();
