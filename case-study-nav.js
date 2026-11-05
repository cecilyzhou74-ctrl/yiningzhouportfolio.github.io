(() => {
  const navs = [...document.querySelectorAll('[data-case-section-nav]')];
  if (!navs.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  navs.forEach((nav) => {
    const links = [...nav.querySelectorAll('[data-case-section-link]')];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    let frame = 0;

    const setActive = (section) => {
      if (!section) return;

      links.forEach((link) => {
        const active = link.getAttribute('href') === `#${section.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });

      if (window.innerWidth < 1100) {
        const activeLink = links.find((link) => link.classList.contains('is-active'));
        if (activeLink) {
          nav.scrollTo({
            left: Math.max(0, activeLink.offsetLeft - nav.clientWidth / 2 + activeLink.clientWidth / 2),
            behavior: reduceMotion.matches ? 'auto' : 'smooth',
          });
        }
      }
    };

    const updateActive = () => {
      frame = 0;
      const marker = window.innerHeight * 0.38;
      let current = sections[0];

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= marker) current = section;
      });

      setActive(current);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActive);
    };

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        const section = document.querySelector(link.getAttribute('href'));
        if (!section) return;

        event.preventDefault();
        section.scrollIntoView({
          behavior: reduceMotion.matches ? 'auto' : 'smooth',
          block: 'start',
        });
        window.history.replaceState(null, '', `#${section.id}`);
        setActive(section);
      });
    });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    updateActive();
  });
})();
