document.addEventListener("DOMContentLoaded", () => {
  const spotlight = document.querySelector("#teamSpotlight");
  const rail = document.querySelector("[data-team-rail]");
  if (!spotlight || !rail) return;

  const thumbs = Array.from(rail.querySelectorAll("[data-team-thumb]"));
  const panel = spotlight.querySelector(".spotlight-panel");
  const visual = spotlight.querySelector(".spotlight-visual");
  const img = spotlight.querySelector("[data-spot-image]");
  const nameEl = spotlight.querySelector("[data-spot-name]");
  const roleEl = spotlight.querySelector("[data-spot-role]");
  const deptEl = spotlight.querySelector("[data-spot-dept]");
  const bioEl = spotlight.querySelector("[data-spot-bio]");
  const indexEl = spotlight.querySelector("[data-spot-index]");
  const totalEl = spotlight.querySelector("[data-spot-total]");
  const progressEl = spotlight.querySelector("[data-spot-progress]");
  const prevBtn = spotlight.querySelector("[data-spot-prev]");
  const nextBtn = spotlight.querySelector("[data-spot-next]");

  if (totalEl) totalEl.textContent = String(thumbs.length).padStart(2, "0");

  let active = Math.max(0, thumbs.findIndex(t => t.classList.contains("active")));

  const apply = () => {
    const t = thumbs[active];
    thumbs.forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    t.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

    img.src = t.dataset.image;
    img.alt = t.dataset.name;
    img.style.setProperty("--portrait-scale", t.dataset.scale || 1);
    nameEl.textContent = t.dataset.name;
    roleEl.textContent = t.dataset.role;
    deptEl.textContent = t.dataset.dept;
    bioEl.textContent = t.dataset.bio;
    indexEl.textContent = String(active + 1).padStart(2, "0");
    if (progressEl) progressEl.style.width = `${((active + 1) / thumbs.length) * 100}%`;
  };

  const goTo = (i) => {
    if (i === active) return;
    active = i;
    panel.classList.add("is-fading");
    visual.classList.add("is-fading");
    setTimeout(() => {
      apply();
      panel.classList.remove("is-fading");
      visual.classList.remove("is-fading");
    }, 220);
  };

  thumbs.forEach((t, i) => t.addEventListener("click", () => goTo(i)));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo((active - 1 + thumbs.length) % thumbs.length));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo((active + 1) % thumbs.length));

  apply();
});
