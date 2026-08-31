document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
       TYPEWRITER
    ========================================= */

  function typeWriter(
    el,
    { speed = 34, loop = false, holdTyped = 1600, holdErased = 500 } = {},
  ) {
    const segments = [];

    (function walk(node) {
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3 && child.textContent.trim() !== "") {
          segments.push(child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);

    if (!segments.length) return;

    const full = segments.map((n) => n.textContent);

    segments.forEach((n) => {
      n.textContent = "";
    });

    const caret = document.createElement("span");

    caret.className = "typewriter-caret";

    caret.setAttribute("aria-hidden", "true");

    const placeCaret = (si) => {
      segments[si].parentNode.insertBefore(caret, segments[si].nextSibling);
    };

    placeCaret(0);

    const finish = () => {
      setTimeout(() => {
        caret.classList.add("typewriter-caret--done");

        setTimeout(() => {
          caret.classList.add("typewriter-caret--fade");

          setTimeout(() => {
            caret.remove();
          }, 650);
        }, 700);
      }, 300);
    };

    let si = 0;
    let ci = 0;

    const typeTick = () => {
      const text = full[si];

      if (ci < text.length) {
        segments[si].textContent += text[ci];

        ci++;

        setTimeout(typeTick, speed + Math.random() * 30);
      } else {
        si++;
        ci = 0;

        if (si < segments.length) {
          placeCaret(si);

          setTimeout(typeTick, 120);
        } else if (loop) {
          setTimeout(startErase, holdTyped);
        } else {
          finish();
        }
      }
    };

    let dsi = segments.length - 1;

    const eraseTick = () => {
      const cur = segments[dsi].textContent;

      if (cur.length > 0) {
        segments[dsi].textContent = cur.slice(0, -1);

        setTimeout(eraseTick, speed * 0.55);
      } else {
        dsi--;

        if (dsi >= 0) {
          placeCaret(dsi);

          setTimeout(eraseTick, speed * 0.55);
        } else {
          setTimeout(() => {
            si = 0;
            ci = 0;

            placeCaret(0);

            typeTick();
          }, holdErased);
        }
      }
    };

    const startErase = () => {
      dsi = segments.length - 1;

      placeCaret(dsi);

      eraseTick();
    };

    typeTick();
  }

  /* =========================================
       START TYPEWRITER
    ========================================= */

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-typewriter]").forEach((el) => {
      setTimeout(() => {
        typeWriter(el, {
          speed: 34,

          loop: el.hasAttribute("data-typewriter-loop"),

          holdTyped: 1600,

          holdErased: 500,
        });
      }, 300);
    });
  }

  /* =========================================
       NAVBAR
    ========================================= */

  const nav = document.querySelector(".navbar");

  const menu = document.querySelector(".mobile-menu");

  const menuBtn = document.querySelector(".menu-btn");

  const scroll = () => {
    nav?.classList.toggle("scrolled", scrollY > 50);
  };

  addEventListener("scroll", scroll);

  scroll();

  /* =========================================
       MOBILE MENU
    ========================================= */

  menuBtn?.addEventListener("click", () => {
    menu.classList.toggle("active");

    document.body.classList.toggle("lock");
  });

  menu?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("active");

      document.body.classList.remove("lock");
    });
  });

  /* =========================================
       RESOURCE DROPDOWN
    ========================================= */

  const resourceGroups = document.querySelectorAll(".resource-group");

  resourceGroups.forEach((group) => {
    const toggle = group.querySelector(".resource-label");

    toggle?.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen = group.classList.contains("active");

      resourceGroups.forEach((item) => {
        item.classList.remove("active");
      });

      if (!isOpen) {
        group.classList.add("active");
      }
    });
  });

  /* =========================================
       REVEAL ANIMATION
    ========================================= */

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    io.observe(element);
  });

  /* =========================================
       COUNTER
    ========================================= */

  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = +el.dataset.counter;

    let done = false;

    const counterObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || done) {
        return;
      }

      done = true;

      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / 1200, 1);

        const value = 1 - Math.pow(1 - progress, 3);

        el.textContent = Math.floor(target * value).toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);

      counterObserver.disconnect();
    });

    counterObserver.observe(el);
  });

  /* =========================================
       GALLERY LIGHTBOX
    ========================================= */

  const lb = document.querySelector("#lightbox");

  if (lb) {
    const im = lb.querySelector("img");

    const close = () => {
      lb.classList.remove("active");

      document.body.classList.remove("lock");
    };

    document.querySelectorAll("[data-lightbox]").forEach((item) => {
      item.addEventListener("click", () => {
        im.src = item.dataset.lightbox;

        lb.classList.add("active");

        document.body.classList.add("lock");
      });
    });

    lb.querySelector(".close")?.addEventListener("click", close);

    lb.addEventListener("click", (event) => {
      if (event.target === lb) {
        close();
      }
    });
  }

  /* =========================================
       LIVE INTERACTIVE HERO
    ========================================= */

  const hero = document.querySelector(".hero");

  if (hero && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let mouseX = 0.5;
    let mouseY = 0.5;

    let currentX = 0.5;
    let currentY = 0.5;

    const bg = hero.querySelector(".hero-bg");

    const heroContent = hero.querySelector(".hero-content");

    const heroTitle = hero.querySelector("h1");

    const heroCard = hero.querySelector(".hero-side");

    const updateHero = () => {
      currentX += (mouseX - currentX) * 0.08;

      currentY += (mouseY - currentY) * 0.08;

      const offsetX = (currentX - 0.5) * 2;

      const offsetY = (currentY - 0.5) * 2;

      /* Cursor spotlight */

      hero.style.setProperty("--mouse-x", `${currentX * 100}%`);

      hero.style.setProperty("--mouse-y", `${currentY * 100}%`);

      /* Background parallax */

      if (bg) {
        bg.style.transform = `
                    translate3d(
                        ${offsetX * -14}px,
                        ${offsetY * -10}px,
                        0
                    )
                    scale(1.06)
                `;
      }

      /* Content movement */

      if (heroContent) {
        heroContent.style.transform = `
                    translate3d(
                        ${offsetX * 5}px,
                        ${offsetY * 4}px,
                        0
                    )
                `;
      }

      /* Headline movement */

      if (heroTitle) {
        heroTitle.style.transform = `
                    translate3d(
                        ${offsetX * 9}px,
                        ${offsetY * 7}px,
                        0
                    )
                `;
      }

      /* Established card */

      if (heroCard) {
        heroCard.style.transform = `
                    translate3d(
                        ${offsetX * -8}px,
                        ${offsetY * -6}px,
                        0
                    )
                    rotateX(${offsetY * -2}deg)
                    rotateY(${offsetX * 2}deg)
                `;
      }

      requestAnimationFrame(updateHero);
    };

    /* Mouse movement */

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();

      mouseX = (event.clientX - rect.left) / rect.width;

      mouseY = (event.clientY - rect.top) / rect.height;

      hero.classList.add("is-interacting");
    });

    /* Mouse leave */

    hero.addEventListener("pointerleave", () => {
      mouseX = 0.5;
      mouseY = 0.5;

      hero.classList.remove("is-interacting");
    });

    requestAnimationFrame(updateHero);
  }

  /* =========================================
       ESCAPE KEY
    ========================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document
        .querySelectorAll(".modal.active, .lightbox.active")
        .forEach((element) => {
          element.classList.remove("active");
        });

      menu?.classList.remove("active");

      document.body.classList.remove("lock");
    }
  });
});
