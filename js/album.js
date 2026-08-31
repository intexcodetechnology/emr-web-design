(function () {
  const grid = document.querySelector(".album-grid");
  const filterBar = document.querySelector(".album-filter");
  if (!grid || !filterBar) return;

  const buttons = Array.from(filterBar.querySelectorAll(".filter-btn"));
  const indicator = filterBar.querySelector(".filter-indicator");
  const cards = Array.from(grid.querySelectorAll(".album-card"));
  const emptyMsg = document.querySelector(".album-empty");

  function updateCounts() {
    const counts = {
      all: cards.length,
      license: 0,
      certification: 0,
      award: 0,
    };
    cards.forEach((card) => {
      const cat = card.getAttribute("data-category");
      if (counts[cat] !== undefined) counts[cat]++;
    });
    filterBar.querySelectorAll("[data-count-for]").forEach((el) => {
      const key = el.getAttribute("data-count-for");
      el.textContent = counts[key] !== undefined ? counts[key] : "";
    });
  }

  function moveIndicator(btn) {
    if (!indicator || !btn) return;
    indicator.style.width = btn.offsetWidth + "px";
    indicator.style.transform = "translateX(" + btn.offsetLeft + "px)";
  }

  function applyFilter(filter) {
    const matching = cards.filter(
      (card) =>
        filter === "all" || card.getAttribute("data-category") === filter,
    );

    grid.classList.add("is-filtering");

    window.setTimeout(() => {
      cards.forEach((card) => {
        const show =
          filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("is-hidden", !show);
      });
      if (emptyMsg) emptyMsg.hidden = matching.length > 0;

      // force reflow so the fade-in transition plays
      void grid.offsetWidth;
      grid.classList.remove("is-filtering");
    }, 220);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      moveIndicator(btn);
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  function updateScrollHint() {
    const bar = filterBar.closest(".album-filterbar");
    if (!bar) return;
    const canScroll = filterBar.scrollWidth > filterBar.clientWidth + 2;
    bar.classList.toggle("can-scroll", canScroll);
  }

  updateCounts();

  const activeBtn =
    filterBar.querySelector(".filter-btn.is-active") || buttons[0];
  // wait a tick so layout/fonts are settled before measuring for the indicator
  window.requestAnimationFrame(() => {
    moveIndicator(activeBtn);
    updateScrollHint();
  });
  window.addEventListener("resize", () => {
    const current = filterBar.querySelector(".filter-btn.is-active");
    moveIndicator(current);
    updateScrollHint();
  });
  filterBar.addEventListener("scroll", () => {
    const bar = filterBar.closest(".album-filterbar");
    if (
      bar &&
      filterBar.scrollLeft + filterBar.clientWidth >= filterBar.scrollWidth - 4
    ) {
      bar.classList.remove("can-scroll");
    } else {
      updateScrollHint();
    }
  });
})();
