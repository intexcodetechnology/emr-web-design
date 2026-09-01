document.addEventListener("DOMContentLoaded", () => {
  console.log("Gallery JS v4 loaded");

  // =========================================================
  // MAIN GALLERY
  // =========================================================
  const gallery = document.querySelector("[data-gallery]");

  if (!gallery) {
    console.error("Gallery container not found");
    return;
  }

  const carousel = gallery.querySelector(".gallery-carousel");

  if (!carousel) {
    console.error("Gallery carousel not found");
    return;
  }

  const feature = gallery.querySelector(".gallery-feature");

  const featureImage = gallery.querySelector("[data-feature-image]");

  const featureEyebrow = gallery.querySelector("[data-feature-eyebrow]");

  const featureTitle = gallery.querySelector("[data-feature-title]");

  const featureCaption = gallery.querySelector("[data-feature-caption]");

  const progress = gallery.querySelector("[data-gallery-progress]");

  const pauseButton = gallery.querySelector("[data-gallery-toggle]");

  const galleryPrev = gallery.querySelector("[data-gallery-prev]");

  const galleryNext = gallery.querySelector("[data-gallery-next]");

  const galleryCTA = gallery.querySelectorAll("[data-gallery-cta]");

  const galleryItems = Array.from(
    gallery.querySelectorAll("[data-gallery-item]"),
  );

  if (!galleryItems.length) {
    console.error("No Gallery items found");
    return;
  }

  // =========================================================
  // LIGHTBOX ELEMENTS
  // =========================================================
  const lightbox = document.getElementById("lightbox");

  const lightboxImage = document.getElementById("lightboxImage");

  const lightboxClose = document.getElementById("lightboxClose");

  const lightboxPrev = document.getElementById("lightboxPrev");

  const lightboxNext = document.getElementById("lightboxNext");

  const lightboxEyebrow = document.getElementById("lightboxEyebrow");

  const lightboxTitle = document.getElementById("lightboxTitle");

  const lightboxCaption = document.getElementById("lightboxCaption");

  const lightboxCounter = document.getElementById("lightboxCounter");

  // =========================================================
  // DATA
  // =========================================================
  const slides = galleryItems.map((item) => {
    const img = item.querySelector("img");

    return {
      src: item.dataset.image || img?.getAttribute("src") || "",

      fullSrc:
        item.dataset.lightbox ||
        item.dataset.image ||
        img?.getAttribute("src") ||
        "",

      alt: img?.getAttribute("alt") || "Gallery image",

      eyebrow: item.dataset.eyebrow || "",

      title: item.dataset.title || "",

      caption: item.dataset.caption || "",
    };
  });

  // =========================================================
  // STATE
  // =========================================================
  let activeIndex = 0;
  let lightboxIndex = 0;

  let autoTimer = null;
  let paused = false;

  const AUTO_TIME = 3800;

  const activeItemIndex = galleryItems.findIndex((item) =>
    item.classList.contains("is-active"),
  );

  if (activeItemIndex !== -1) {
    activeIndex = activeItemIndex;
  }

  // =========================================================
  // INDEX LOOPING
  // =========================================================
  function normalizeIndex(index) {
    return ((index % slides.length) + slides.length) % slides.length;
  }

  // =========================================================
  // RENDER MAIN GALLERY
  // =========================================================
  function renderGallery(index) {
    activeIndex = normalizeIndex(index);

    const slide = slides[activeIndex];

    if (!slide) return;

    galleryItems.forEach((item, i) => {
      item.classList.toggle("is-active", i === activeIndex);
    });

    if (featureImage) {
      featureImage.src = slide.src;
      featureImage.alt = slide.alt;
    }

    if (featureEyebrow) {
      featureEyebrow.textContent = slide.eyebrow;
    }

    if (featureTitle) {
      featureTitle.textContent = slide.title;
    }

    if (featureCaption) {
      featureCaption.textContent = slide.caption;
    }

    if (progress) {
      progress.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
    }

    try {
      galleryItems[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    } catch (error) {
      // Ignore unsupported browser behaviour
    }
  }

  // =========================================================
  // AUTOPLAY
  // =========================================================
  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();

    if (paused) return;

    if (lightbox && lightbox.classList.contains("is-open")) {
      return;
    }

    autoTimer = setInterval(() => {
      renderGallery(activeIndex + 1);
    }, AUTO_TIME);
  }

  // =========================================================
  // RENDER LIGHTBOX
  // =========================================================
  function renderLightbox(index) {
    if (!lightboxImage) {
      console.error("#lightboxImage does not exist in HTML");
      return;
    }

    lightboxIndex = normalizeIndex(index);

    const slide = slides[lightboxIndex];

    if (!slide) return;

    console.log("Loading lightbox image:", slide.fullSrc);

    // Synchronize main gallery
    activeIndex = lightboxIndex;

    renderGallery(activeIndex);

    // Information
    if (lightboxEyebrow) {
      lightboxEyebrow.textContent = slide.eyebrow;
    }

    if (lightboxTitle) {
      lightboxTitle.textContent = slide.title;
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = slide.caption;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${slides.length}`;
    }

    // =====================================================
    // IMAGE
    // =====================================================

    lightboxImage.classList.add("is-changing");

    // Remove previous handlers first
    lightboxImage.onload = null;
    lightboxImage.onerror = null;

    lightboxImage.onload = () => {
      console.log("Lightbox image loaded:", slide.fullSrc);

      requestAnimationFrame(() => {
        lightboxImage.classList.remove("is-changing");
      });
    };

    lightboxImage.onerror = () => {
      console.error("Could not load:", slide.fullSrc);

      // Try normal Gallery source
      if (slide.src && lightboxImage.getAttribute("src") !== slide.src) {
        console.log("Trying fallback:", slide.src);

        lightboxImage.src = slide.src;

        return;
      }

      lightboxImage.classList.remove("is-changing");
    };

    // VERY IMPORTANT:
    // setAttribute avoids some src comparison issues.
    lightboxImage.setAttribute("src", slide.fullSrc);

    lightboxImage.setAttribute("alt", slide.alt);
  }

  // =========================================================
  // OPEN LIGHTBOX
  // =========================================================
  function openLightbox(index) {
    if (!lightbox) {
      console.error("#lightbox not found");
      return;
    }

    stopAutoPlay();

    lightbox.classList.add("is-open");

    lightbox.setAttribute("aria-hidden", "false");

    document.documentElement.style.overflow = "hidden";

    document.body.style.overflow = "hidden";

    renderLightbox(index);

    console.log("Lightbox opened:", index);
  }

  // =========================================================
  // CLOSE LIGHTBOX
  // =========================================================
  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("is-open", "active");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lock");

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    startAutoPlay();

    console.log("Lightbox closed");
  }

  // =========================================================
  // PREVIOUS LIGHTBOX
  // =========================================================
  function previousLightbox() {
    console.log("Previous clicked");

    renderLightbox(lightboxIndex - 1);
  }

  // =========================================================
  // NEXT LIGHTBOX
  // =========================================================
  function nextLightboxImage() {
    console.log("Next clicked");

    renderLightbox(lightboxIndex + 1);
  }

  // =========================================================
  // THUMBNAIL EVENTS
  // =========================================================
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      openLightbox(index);
    });
  });

  // =========================================================
  // MAIN GALLERY PREVIOUS
  // =========================================================
  if (galleryPrev) {
    galleryPrev.addEventListener("click", (event) => {
      event.preventDefault();

      renderGallery(activeIndex - 1);

      startAutoPlay();
    });
  }

  // =========================================================
  // MAIN GALLERY NEXT
  // =========================================================
  if (galleryNext) {
    galleryNext.addEventListener("click", (event) => {
      event.preventDefault();

      renderGallery(activeIndex + 1);

      startAutoPlay();
    });
  }

  // =========================================================
  // CTA BUTTONS
  // =========================================================
  galleryCTA.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openLightbox(activeIndex);
    });
  });

  // =========================================================
  // FEATURED IMAGE CLICK
  // =========================================================
  if (featureImage) {
    featureImage.style.cursor = "zoom-in";

    featureImage.addEventListener("click", () => {
      openLightbox(activeIndex);
    });
  }

  // =========================================================
  // CLOSE BUTTON
  // =========================================================
  if (lightboxClose) {
    lightboxClose.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();

      closeLightbox();
    };
  } else {
    console.error("#lightboxClose not found!");
  }

  // =========================================================
  // PREVIOUS BUTTON
  // =========================================================
  if (lightboxPrev) {
    lightboxPrev.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();

      previousLightbox();
    };
  } else {
    console.error("#lightboxPrev not found!");
  }

  // =========================================================
  // NEXT BUTTON
  // =========================================================
  if (lightboxNext) {
    lightboxNext.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();

      nextLightboxImage();
    };
  } else {
    console.error("#lightboxNext not found!");
  }

  // =========================================================
  // CLICK BACKGROUND TO CLOSE
  // =========================================================
  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // =========================================================
  // KEYBOARD
  // =========================================================
  document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      previousLightbox();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();

      nextLightboxImage();
    }
  });

  // =========================================================
  // PAUSE / PLAY
  // =========================================================
  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      paused = !paused;

      pauseButton.textContent = paused ? "Play" : "Pause";

      startAutoPlay();
    });
  }

  // =========================================================
  // MOBILE SWIPE
  // =========================================================
  let startX = 0;

  if (lightbox) {
    lightbox.addEventListener(
      "touchstart",
      (event) => {
        startX = event.changedTouches[0].clientX;
      },
      {
        passive: true,
      },
    );

    lightbox.addEventListener(
      "touchend",
      (event) => {
        const endX = event.changedTouches[0].clientX;

        const distance = endX - startX;

        if (Math.abs(distance) < 50) {
          return;
        }

        if (distance > 0) {
          previousLightbox();
        } else {
          nextLightboxImage();
        }
      },
      {
        passive: true,
      },
    );
  }

  // =========================================================
  // START
  // =========================================================
  renderGallery(activeIndex);

  startAutoPlay();

  console.log(`Gallery ready. ${slides.length} images found.`);
});
