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

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target) } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(x => io.observe(x));

  const lb = document.querySelector("#lightbox");
  if (lb) {
    const im = lb.querySelector("img"), close = () => { lb.classList.remove("active"); document.body.classList.remove("lock") };
    document.querySelectorAll("[data-lightbox]").forEach(x => x.addEventListener("click", () => { im.src = x.dataset.lightbox; lb.classList.add("active"); document.body.classList.add("lock") }));
    lb.querySelector(".close").addEventListener("click", close); lb.addEventListener("click", e => e.target === lb && close());
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") { document.querySelectorAll(".modal.active,.lightbox.active").forEach(x => x.classList.remove("active")); document.body.classList.remove("lock") } })

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