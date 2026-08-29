
document.addEventListener("DOMContentLoaded", () => {
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

  document.querySelectorAll("[data-counter]").forEach(el => {
    const target = +el.dataset.counter; let done = false;
    const c = new IntersectionObserver(es => {
      if (!es[0].isIntersecting || done) return; done = true; let s = performance.now();
      const tick = n => { let p = Math.min((n - s) / 1200, 1), v = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(target * v).toLocaleString(); if (p < 1) requestAnimationFrame(tick) }; requestAnimationFrame(tick); c.disconnect();
    }); c.observe(el);
  });

  const modal = document.querySelector("#teamModal");
  if (modal) {
    const im = modal.querySelector("[data-modal-image]"), name = modal.querySelector("[data-modal-name]"), role = modal.querySelector("[data-modal-role]"), bio = modal.querySelector("[data-modal-bio]");
    document.querySelectorAll("[data-team]").forEach(card => card.addEventListener("click", () => { im.src = card.dataset.image; name.textContent = card.dataset.name; role.textContent = card.dataset.role; bio.textContent = card.dataset.bio; modal.classList.add("active"); document.body.classList.add("lock") }));
    const close = () => { modal.classList.remove("active"); document.body.classList.remove("lock") }; modal.querySelector(".close").addEventListener("click", close); modal.addEventListener("click", e => e.target === modal && close());
  }
  const lb = document.querySelector("#lightbox");
  if (lb) {
    const im = lb.querySelector("img"), close = () => { lb.classList.remove("active"); document.body.classList.remove("lock") };
    document.querySelectorAll("[data-lightbox]").forEach(x => x.addEventListener("click", () => { im.src = x.dataset.lightbox; lb.classList.add("active"); document.body.classList.add("lock") }));
    lb.querySelector(".close").addEventListener("click", close); lb.addEventListener("click", e => e.target === lb && close());
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") { document.querySelectorAll(".modal.active,.lightbox.active").forEach(x => x.classList.remove("active")); menu?.classList.remove("active"); document.body.classList.remove("lock") } })
});
