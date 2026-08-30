document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const carousel = gallery.querySelector(".gallery-carousel");
  const items = [...carousel.querySelectorAll("[data-gallery-item]")];
  const feature = gallery.querySelector(".gallery-feature");
  const image = gallery.querySelector("[data-feature-image]");
  const index = gallery.querySelector("[data-feature-index]");
  const title = gallery.querySelector("[data-feature-title]");
  const caption = gallery.querySelector("[data-feature-caption]");
  const progress = gallery.querySelector("[data-gallery-progress]");
  const toggle = gallery.querySelector("[data-gallery-toggle]");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer;
  let paused = reducedMotion;

  const render = (item, animate = true) => {
    items.forEach(card => card.classList.toggle("is-active", card === item));
    if (animate) feature.classList.add("is-changing");
    window.setTimeout(() => {
      image.src = item.dataset.image;
      image.alt = item.querySelector("img").alt;
      index.textContent = `${item.querySelector("span").textContent} / ${String(items.length).padStart(2, "0")}`;
      title.textContent = item.dataset.title;
      caption.textContent = item.dataset.caption;
      progress.style.width = `${(Number(item.querySelector("span").textContent) / items.length) * 100}%`;
      feature.classList.remove("is-changing");
    }, animate && !reducedMotion ? 220 : 0);
  };

  const rotateQueue = () => {
    const beforePositions = new Map(items.map(item => [item, item.getBoundingClientRect()]));
    const first = items.shift();
    carousel.append(first);
    items.push(first);
    const visibleItems = [...carousel.querySelectorAll("[data-gallery-item]")];
    visibleItems.forEach(item => {
      const before = beforePositions.get(item);
      const after = item.getBoundingClientRect();
      if (!before) return;
      item.animate([
        { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)` },
        { transform: "translate(0, 0)" }
      ], { duration: reducedMotion ? 0 : 780, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
    render(visibleItems[0]);
  };

  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!paused) timer = window.setInterval(rotateQueue, 3800);
  };

  items.forEach(item => item.addEventListener("click", () => {
    while (carousel.firstElementChild !== item) carousel.append(carousel.firstElementChild);
    items.splice(0, items.length, ...carousel.querySelectorAll("[data-gallery-item]"));
    render(item);
    start();
  }));

  gallery.addEventListener("mouseenter", stop);
  gallery.addEventListener("mouseleave", start);
  gallery.addEventListener("focusin", stop);
  gallery.addEventListener("focusout", event => {
    if (!gallery.contains(event.relatedTarget)) start();
  });
  toggle.addEventListener("click", () => {
    paused = !paused;
    toggle.textContent = paused ? "Play" : "Pause";
    toggle.setAttribute("aria-label", `${paused ? "Play" : "Pause"} gallery`);
    start();
  });

  render(items[0], false);
  start();
});
