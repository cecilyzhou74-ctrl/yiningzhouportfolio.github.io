(() => {
  const switchers = [...document.querySelectorAll("[data-project-switcher]")];
  if (!switchers.length) return;

  const closeSwitcher = (switcher) => {
    const toggle = switcher.querySelector("[data-project-switcher-toggle]");
    switcher.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  const closeAll = (except = null) => {
    switchers.forEach((switcher) => {
      if (switcher !== except) closeSwitcher(switcher);
    });
  };

  switchers.forEach((switcher) => {
    const toggle = switcher.querySelector("[data-project-switcher-toggle]");
    if (!toggle) return;

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldOpen = !switcher.classList.contains("is-open");
      closeAll(switcher);
      switcher.classList.toggle("is-open", shouldOpen);
      toggle.setAttribute("aria-expanded", String(shouldOpen));
    });

    switcher.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeSwitcher(switcher));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-project-switcher]")) closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openSwitcher = switchers.find((switcher) => switcher.classList.contains("is-open"));
    if (!openSwitcher) return;
    const toggle = openSwitcher.querySelector("[data-project-switcher-toggle]");
    closeSwitcher(openSwitcher);
    toggle?.focus();
  });
})();
