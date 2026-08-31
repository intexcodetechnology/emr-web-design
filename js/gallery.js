document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const carousel = gallery.querySelector(".gallery-carousel");
  const feature = gallery.querySelector(".gallery-feature");
  const image = gallery.querySelector("[data-feature-image]");
  const eyebrow = gallery.querySelector("[data-feature-eyebrow]");
  const title = gallery.querySelector("[data-feature-title]");
  const caption = gallery.querySelector("[data-feature-caption]");
  const progress = gallery.querySelector("[data-gallery-progress]");
  const toggle = gallery.querySelector("[data-gallery-toggle]");
  const prevBtn = gallery.querySelector("[data-gallery-prev]");
  const nextBtn = gallery.querySelector("[data-gallery-next]");
  const ctaButtons = gallery.querySelectorAll("[data-gallery-cta]");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".close") : null;

  const items = [...carousel.querySelectorAll("[data-gallery-item]")];
  if (!items.length) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let timer = null;
  let paused = reducedMotion;
  let swapToken = 0;

  const scrollItemIntoView = (item) => {
    try {
      const containerRect = carousel.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const delta =
        itemRect.left +
        itemRect.width / 2 -
        (containerRect.left + containerRect.width / 2);
      carousel.scrollTo({
        left: carousel.scrollLeft + delta,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    } catch (err) {
      /* non-fatal: scrolling is a nicety, not required for correctness */
    }
  };

  const applyFeatureContent = (item) => {
    image.src = item.dataset.image || "";
    const inner = item.querySelector("img");
    image.alt = inner ? inner.alt : "";
    if (eyebrow) eyebrow.textContent = item.dataset.eyebrow || "";
    if (title) title.textContent = item.dataset.title || "";
    if (caption) caption.textContent = item.dataset.caption || "";
    progress.style.width = `${((activeIndex + 1) / items.length) * 100}%`;
  };

  const render = (animate = true) => {
    const item = items[activeIndex];
    items.forEach((card, i) =>
      card.classList.toggle("is-active", i === activeIndex),
    );
    scrollItemIntoView(item);

    const token = ++swapToken;
    if (animate && !reducedMotion) {
      feature.classList.add("is-changing");
      window.setTimeout(() => {
        try {
          applyFeatureContent(item);
        } finally {
          if (token === swapToken) feature.classList.remove("is-changing");
        }
      }, 220);
    } else {
      applyFeatureContent(item);
      feature.classList.remove("is-changing");
    }
  };

  const goToIndex = (i) => {
    activeIndex = ((i % items.length) + items.length) % items.length;
    render(true);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
  };
  const start = () => {
    stop();
    if (!paused)
      timer = window.setInterval(() => goToIndex(activeIndex + 1), 3800);
  };

  items.forEach((item, i) =>
    item.addEventListener("click", () => {
      goToIndex(i);
      start();
    }),
  );
  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      goToIndex(activeIndex - 1);
      start();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      goToIndex(activeIndex + 1);
      start();
    });

  gallery.addEventListener("mouseenter", stop);
  gallery.addEventListener("mouseleave", start);
  gallery.addEventListener("focusin", stop);
  gallery.addEventListener("focusout", (event) => {
    if (!gallery.contains(event.relatedTarget)) start();
  });

  if (toggle) {
    toggle.addEventListener("click", () => {
      paused = !paused;
      toggle.textContent = paused ? "Play" : "Pause";
      toggle.setAttribute("aria-label", `${paused ? "Play" : "Pause"} gallery`);
      start();
    });
  }

  // Lightbox
  const openLightbox = (src) => {
    if (!lightbox || !lightboxImg || !src) return;
    lightboxImg.src = src;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  ctaButtons.forEach((btn) =>
    btn.addEventListener("click", () => openLightbox(image.src)),
  );
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  render(false);
  start();
});
