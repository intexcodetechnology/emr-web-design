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

  document.querySelectorAll(".resource-dropdown").forEach(dropdown => {
    const trigger = dropdown.querySelector(".nav-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = dropdown.classList.contains("active");
      document.querySelectorAll(".resource-dropdown").forEach(item => item.classList.remove("active"));
      if (!isOpen) dropdown.classList.add("active");
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target) } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(x => io.observe(x));

  // Modal functionality for cards
  const initializeModals = () => {
    // Open modal when card is clicked
    document.querySelectorAll("[data-modal]").forEach(card => {
      card.addEventListener("click", () => {
        const modalId = card.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add("active");
          document.body.classList.add("lock");
        }
      });
    });

    // Close modal functionality
    const closeModal = (modal) => {
      modal.classList.remove("active");
      document.body.classList.remove("lock");
    };

    // Close button click
    document.querySelectorAll(".modal-close").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const modal = btn.closest(".modal");
        if (modal) closeModal(modal);
      });
    });

    // Close when clicking overlay
    document.querySelectorAll(".modal-overlay").forEach(overlay => {
      overlay.addEventListener("click", () => {
        const modal = overlay.closest(".modal");
        if (modal) closeModal(modal);
      });
    });
  };
  initializeModals();

  const lb = document.querySelector("#lightbox");
  if (lb) {
    const im = lb.querySelector("img"), close = () => { lb.classList.remove("active"); document.body.classList.remove("lock") };
    document.querySelectorAll("[data-lightbox]").forEach(x => x.addEventListener("click", () => { im.src = x.dataset.lightbox; lb.classList.add("active"); document.body.classList.add("lock") }));
    lb.querySelector(".close").addEventListener("click", close); lb.addEventListener("click", e => e.target === lb && close());
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") { document.querySelectorAll(".modal.active,.lightbox.active").forEach(x => x.classList.remove("active")); menu?.classList.remove("active"); document.body.classList.remove("lock") } })

  document.querySelectorAll("[data-service-accordion]").forEach(group => {
    const trigger = group.querySelector(".service-toggle");
    const panel = group.querySelector(".service-panel");
    if (!trigger || !panel) return;

    const setOpen = isOpen => {
      group.classList.toggle("active", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0px";
    };

    setOpen(group.classList.contains("active"));

    trigger.addEventListener("click", () => {
      const isOpen = group.classList.contains("active");
      document.querySelectorAll("[data-service-accordion]").forEach(item => {
        if (item === group) return;
        item.classList.remove("active");
        const otherPanel = item.querySelector(".service-panel");
        const otherTrigger = item.querySelector(".service-toggle");
        if (otherPanel) otherPanel.style.maxHeight = "0px";
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      });
      setOpen(!isOpen);
    });
  });
});