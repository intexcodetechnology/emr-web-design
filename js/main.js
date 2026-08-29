
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

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target) } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(x => io.observe(x));

  const lb = document.querySelector("#lightbox");
  if (lb) {
    const im = lb.querySelector("img"), close = () => { lb.classList.remove("active"); document.body.classList.remove("lock") };
    document.querySelectorAll("[data-lightbox]").forEach(x => x.addEventListener("click", () => { im.src = x.dataset.lightbox; lb.classList.add("active"); document.body.classList.add("lock") }));
    lb.querySelector(".close").addEventListener("click", close); lb.addEventListener("click", e => e.target === lb && close());
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape") { document.querySelectorAll(".modal.active,.lightbox.active").forEach(x => x.classList.remove("active")); menu?.classList.remove("active"); document.body.classList.remove("lock") } })
});
