(() => {
  const revealItems = document.querySelectorAll(".flex-reveal, .flex-reveal-title, .flex-sequence");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  revealItems.forEach((item) => observer.observe(item));

  const flow = document.querySelector("[data-flex-flow]");
  if (flow) {
    const groups = {
      webinar: [
        {
          name: "Registration",
          image: "assets/flex/webinar-registration.png",
          alt: "Webinar registration form",
          description: "A short inline form keeps the first commitment straightforward.",
        },
        {
          name: "Webinar confirmation",
          image: "assets/flex/webinar-confirmation.png",
          alt: "Webinar registration confirmation",
          description: "The confirmation explains the next step and provides an add-to-calendar action.",
        },
      ],
      strategy: [
        {
          name: "Business details",
          image: "assets/flex/strategy-call-details.png",
          alt: "Strategy call business details",
          description: "A few qualification questions help the team understand the operator’s current business and growth goals.",
        },
        {
          name: "Choose a time",
          image: "assets/flex/choose-call-time.png",
          alt: "Strategy call calendar",
          description: "A separate calendar step makes availability and timezone information easier to understand.",
        },
        {
          name: "Call confirmation",
          image: "assets/flex/call-confirmation.png",
          alt: "Strategy call booking confirmation",
          description: "The final state summarises the booking and offers calendar and change-time actions.",
        },
      ],
    };

    const stage = flow.querySelector("[data-flow-stage]");
    const image = flow.querySelector("[data-flow-image]");
    const name = flow.querySelector("[data-flow-name]");
    const count = flow.querySelector("[data-flow-count]");
    const description = flow.querySelector("[data-flow-description]");
    const tabs = [...flow.querySelectorAll("[data-flow-group]")];
    const navButtons = [...flow.querySelectorAll("[data-flow-nav]")];
    let group = "webinar";
    let index = 0;
    let startX = null;

    const render = (direction = 1) => {
      const items = groups[group];
      const item = items[index];
      stage.style.setProperty("--flow-shift", `${direction * 18}px`);
      stage.classList.add("is-changing");
      window.setTimeout(() => {
        image.src = item.image;
        image.alt = item.alt;
        name.textContent = item.name;
        count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
        description.textContent = item.description;
        window.requestAnimationFrame(() => stage.classList.remove("is-changing"));
      }, 150);
    };

    const move = (delta) => {
      const length = groups[group].length;
      index = (index + delta + length) % length;
      render(delta);
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        group = tab.dataset.flowGroup;
        index = 0;
        tabs.forEach((candidate) => candidate.setAttribute("aria-selected", String(candidate === tab)));
        render(1);
      });
    });

    navButtons.forEach((button) => button.addEventListener("click", () => move(button.dataset.flowNav === "next" ? 1 : -1)));
    flow.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    });
    stage.addEventListener("pointerdown", (event) => { startX = event.clientX; });
    stage.addEventListener("pointerup", (event) => {
      if (startX === null) return;
      const distance = event.clientX - startX;
      startX = null;
      if (Math.abs(distance) > 44) move(distance < 0 ? 1 : -1);
    });
  }

  const waitlistToggle = document.querySelector("[data-waitlist-toggle]");
  const waitlistDetail = document.querySelector("[data-waitlist-detail]");
  waitlistToggle?.addEventListener("click", () => {
    const shouldOpen = waitlistDetail.hidden;
    waitlistDetail.hidden = !shouldOpen;
    waitlistToggle.setAttribute("aria-expanded", String(shouldOpen));
    waitlistToggle.textContent = shouldOpen ? "Hide signup ↑" : "View signup ↓";
    if (shouldOpen) {
      waitlistDetail.classList.remove("is-opening");
      window.requestAnimationFrame(() => waitlistDetail.classList.add("is-opening"));
    }
  });
})();
