
function typeWriter(el, { speed = 34, loop = false, holdTyped = 1600, holdErased = 500 } = {}) {
  const segments = [];
  (function walk(node) {
    node.childNodes.forEach(child => {
      if (child.nodeType === 3 && child.textContent.trim() !== "") segments.push(child);
      else if (child.nodeType === 1) walk(child);
    });
  })(el);
  if (!segments.length) return;
  const full = segments.map(n => n.textContent);
  segments.forEach(n => n.textContent = "");

  const caret = document.createElement("span");
  caret.className = "typewriter-caret";
  caret.setAttribute("aria-hidden", "true");
  const placeCaret = si => segments[si].parentNode.insertBefore(caret, segments[si].nextSibling);
  placeCaret(0);

  const finish = () => setTimeout(() => {
    caret.classList.add("typewriter-caret--done");
    setTimeout(() => { caret.classList.add("typewriter-caret--fade"); setTimeout(() => caret.remove(), 650) }, 700);
  }, 300);

  let si = 0, ci = 0;
  const typeTick = () => {
    const text = full[si];
    if (ci < text.length) {
      segments[si].textContent += text[ci]; ci++;
      setTimeout(typeTick, speed + Math.random() * 30);
    } else {
      si++; ci = 0;
      if (si < segments.length) { placeCaret(si); setTimeout(typeTick, 120) }
      else if (loop) setTimeout(startErase, holdTyped);
      else finish();
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
      if (dsi >= 0) { placeCaret(dsi); setTimeout(eraseTick, speed * 0.55) }
      else setTimeout(() => { si = 0; ci = 0; placeCaret(0); typeTick() }, holdErased);
    }
  };
  const startErase = () => { dsi = segments.length - 1; placeCaret(dsi); eraseTick() };

  typeTick();
}

document.addEventListener("DOMContentLoaded", () => {
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("[data-typewriter]").forEach(el => setTimeout(() => typeWriter(el, { loop: el.hasAttribute("data-typewriter-loop") }), 300));
  }

  const nav = document.querySelector(".navbar"), menu = document.querySelector(".mobile-menu"), menuBtn = document.querySelector(".menu-btn");
  const scroll = () => nav?.classList.toggle("scrolled", scrollY > 50); addEventListener("scroll", scroll); scroll();
  menuBtn?.addEventListener("click", () => { menu.classList.toggle("active"); document.body.classList.toggle("lock") });
  menu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("active"); document.body.classList.remove("lock") }));

    const nav = document.querySelector(".navbar");
    const menu = document.querySelector(".mobile-menu");
    const menuBtn = document.querySelector(".menu-btn");

    const scroll = () => {
        nav?.classList.toggle("scrolled", scrollY > 50);
    };

    addEventListener("scroll", scroll);
    scroll();


    /* =========================
       MOBILE MENU
    ========================= */

    menuBtn?.addEventListener("click", () => {
        menu.classList.toggle("active");
        document.body.classList.toggle("lock");
    });

    menu?.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
            menu.classList.remove("active");
            document.body.classList.remove("lock");
        });
    });

  const resourceGroups = document.querySelectorAll(".resource-group");
  resourceGroups.forEach(group => {
    const toggle = group.querySelector(".resource-label");
    toggle?.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = group.classList.contains("active");
      resourceGroups.forEach(item => item.classList.remove("active"));
      if (!isOpen) group.classList.add("active");
    });
  });


    /* =========================
       RESOURCE DROPDOWN
    ========================= */

    const resourceGroups = document.querySelectorAll(".resource-group");

    resourceGroups.forEach(group => {

        const toggle = group.querySelector(".resource-label");

        toggle?.addEventListener("click", (event) => {

            event.preventDefault();

            const isOpen = group.classList.contains("active");

            resourceGroups.forEach(item => {
                item.classList.remove("active");
            });

            if (!isOpen) {
                group.classList.add("active");
            }

        });

    });


    /* =========================
       REVEAL ANIMATION
    ========================= */

    const io = new IntersectionObserver(
        entries => entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                io.unobserve(entry.target);

            }

        }),
        {
            threshold: 0.12
        }
    );

    document.querySelectorAll(".reveal").forEach(element => {
        io.observe(element);
    });


    /* =========================
       COUNTER
    ========================= */

    document.querySelectorAll("[data-counter]").forEach(el => {

        const target = +el.dataset.counter;
        let done = false;

        const counterObserver = new IntersectionObserver(entries => {

            if (!entries[0].isIntersecting || done) return;

            done = true;

            let startTime = performance.now();

            const tick = now => {

                let progress = Math.min(
                    (now - startTime) / 1200,
                    1
                );

                let value =
                    1 - Math.pow(1 - progress, 3);

                el.textContent =
                    Math.floor(target * value).toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(tick);
                }

            };

            requestAnimationFrame(tick);

            counterObserver.disconnect();

        });

        counterObserver.observe(el);

    });


    /* =========================
       TEAM MODAL
    ========================= */

    const modal = document.querySelector("#teamModal");

    if (modal) {

        const im = modal.querySelector("[data-modal-image]");
        const name = modal.querySelector("[data-modal-name]");
        const role = modal.querySelector("[data-modal-role]");
        const bio = modal.querySelector("[data-modal-bio]");

        document.querySelectorAll("[data-team]").forEach(card => {

            card.addEventListener("click", () => {

                im.src = card.dataset.image;
                name.textContent = card.dataset.name;
                role.textContent = card.dataset.role;
                bio.textContent = card.dataset.bio;

                modal.classList.add("active");
                document.body.classList.add("lock");

            });

        });

        const close = () => {

            modal.classList.remove("active");
            document.body.classList.remove("lock");

        };

        modal.querySelector(".close")
            ?.addEventListener("click", close);

        modal.addEventListener("click", e => {

            if (e.target === modal) {
                close();
            }

        });

    }


    /* =========================
       GALLERY LIGHTBOX
    ========================= */

    const lb = document.querySelector("#lightbox");

    if (lb) {

        const im = lb.querySelector("img");

        const close = () => {

            lb.classList.remove("active");
            document.body.classList.remove("lock");

        };

        document.querySelectorAll("[data-lightbox]").forEach(item => {

            item.addEventListener("click", () => {

                im.src = item.dataset.lightbox;

                lb.classList.add("active");
                document.body.classList.add("lock");

            });

        });

        lb.querySelector(".close")
            ?.addEventListener("click", close);

        lb.addEventListener("click", e => {

            if (e.target === lb) {
                close();
            }

        });

    }


    /* =========================
       TYPEWRITER
    ========================= */

    function typeWriter(
        el,
        {
            speed = 34,
            loop = false,
            holdTyped = 1600,
            holdErased = 500
        } = {}
    ) {

        const segments = [];

        function walk(node) {

            node.childNodes.forEach(child => {

                if (
                    child.nodeType === 3 &&
                    child.textContent.trim() !== ""
                ) {

                    segments.push(child);

                } else if (child.nodeType === 1) {

                    walk(child);

                }

            });

        }

        walk(el);

        if (!segments.length) return;


        const full = segments.map(node => node.textContent);

        segments.forEach(node => {
            node.textContent = "";
        });


        const caret = document.createElement("span");

        caret.className = "typewriter-caret";
        caret.setAttribute("aria-hidden", "true");


        const placeCaret = index => {

            segments[index].parentNode.insertBefore(
                caret,
                segments[index].nextSibling
            );

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


        let segmentIndex = 0;
        let charIndex = 0;


        const typeTick = () => {

            const text = full[segmentIndex];


            if (charIndex < text.length) {

                segments[segmentIndex].textContent +=
                    text[charIndex];

                charIndex++;


                setTimeout(
                    typeTick,
                    speed + Math.random() * 30
                );


            } else {

                segmentIndex++;
                charIndex = 0;


                if (segmentIndex < segments.length) {

                    placeCaret(segmentIndex);

                    setTimeout(
                        typeTick,
                        120
                    );


                } else if (loop) {

                    setTimeout(
                        startErase,
                        holdTyped
                    );


                } else {

                    finish();

                }

            }

        };


        let deleteSegment =
            segments.length - 1;


        const eraseTick = () => {

            const current =
                segments[deleteSegment].textContent;


            if (current.length > 0) {

                segments[deleteSegment].textContent =
                    current.slice(0, -1);


                setTimeout(
                    eraseTick,
                    speed * 0.55
                );


            } else {

                deleteSegment--;


                if (deleteSegment >= 0) {

                    placeCaret(deleteSegment);

                    setTimeout(
                        eraseTick,
                        speed * 0.55
                    );


                } else {

                    setTimeout(() => {

                        segmentIndex = 0;
                        charIndex = 0;

                        placeCaret(0);

                        typeTick();

                    }, holdErased);

                }

            }

        };


        const startErase = () => {

            deleteSegment =
                segments.length - 1;

            placeCaret(deleteSegment);

            eraseTick();

        };


        typeTick();

    }


    /* START TYPEWRITER */

    document.querySelectorAll("[data-typewriter]").forEach(el => {

        typeWriter(el, {

            speed: 34,

            loop: el.hasAttribute("data-typewriter-loop"),

            holdTyped: 1600,

            holdErased: 500

        });

    });


    /* =========================
       ESCAPE KEY
    ========================= */

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            document
                .querySelectorAll(".modal.active, .lightbox.active")
                .forEach(element => {
                    element.classList.remove("active");
                });

            menu?.classList.remove("active");

            document.body.classList.remove("lock");

        }

    });

  const lb = document.querySelector("#lightbox");
  if (lb) {
    const im = lb.querySelector("img"), close = () => { lb.classList.remove("active"); document.body.classList.remove("lock") };
    document.querySelectorAll("[data-lightbox]").forEach(x => x.addEventListener("click", () => { im.src = x.dataset.lightbox; lb.classList.add("active"); document.body.classList.add("lock") }));
    lb.querySelector(".close").addEventListener("click", close); lb.addEventListener("click", e => e.target === lb && close());
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") { document.querySelectorAll(".modal.active,.lightbox.active").forEach(x => x.classList.remove("active")); menu?.classList.remove("active"); document.body.classList.remove("lock") } })
});