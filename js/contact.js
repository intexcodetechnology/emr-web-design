(() => {
  const items = document.querySelectorAll("[data-contact-reveal]");

  if (!items.length) return;

  // Respect accessibility preference.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const parentCards = entry.target.closest(".office-cards");
        if (parentCards) {
          const cards = [
            ...parentCards.querySelectorAll("[data-contact-reveal]"),
          ];
          const index = cards.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.max(index, 0) * 120}ms`;
        }

        entry.target.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -55px 0px",
    },
  );

  items.forEach((item) => observer.observe(item));
})();
