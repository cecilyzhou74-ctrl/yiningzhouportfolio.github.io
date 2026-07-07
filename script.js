const contentPanel = document.querySelector(".content-panel");
const navButtons = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll(".section-block")];

function setActiveNav(targetId) {
  navButtons.forEach((button) => {
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
