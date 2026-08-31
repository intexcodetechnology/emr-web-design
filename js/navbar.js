(function () {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  fetch("navbar.html")
    .then((res) => res.text())
    .then((html) => {
      placeholder.outerHTML = html;
      initNavbar();
    });

  function initNavbar() {
    const nav = document.querySelector(".navbar"),
      menu = document.querySelector(".mobile-menu"),
      menuBtn = document.querySelector(".menu-btn");

    const scroll = () => nav?.classList.toggle("scrolled", scrollY > 50);
    addEventListener("scroll", scroll);
    scroll();

    menuBtn?.addEventListener("click", () => {
      menu.classList.toggle("active");
      document.body.classList.toggle("lock");
    });
    menu?.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        menu.classList.remove("active");
        document.body.classList.remove("lock");
      }),
    );

    const resourceGroups = document.querySelectorAll(".resource-group");
    resourceGroups.forEach((group) => {
      const toggle = group.querySelector(".resource-label");
      toggle?.addEventListener("click", (event) => {
        event.preventDefault();
        const isOpen = group.classList.contains("active");
        resourceGroups.forEach((item) => item.classList.remove("active"));
        if (!isOpen) group.classList.add("active");
      });
    });

    document.querySelectorAll(".resource-dropdown").forEach((dropdown) => {
      const trigger = dropdown.querySelector(".nav-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        const isOpen = dropdown.classList.contains("active");
        document
          .querySelectorAll(".resource-dropdown")
          .forEach((item) => item.classList.remove("active"));
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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        menu?.classList.remove("active");
        document.body.classList.remove("lock");
      }
    });
  }
})();
