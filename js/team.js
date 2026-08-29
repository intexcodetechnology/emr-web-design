
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("#teamModal");
  if (modal) {
    const im = modal.querySelector("[data-modal-image]"), name = modal.querySelector("[data-modal-name]"), role = modal.querySelector("[data-modal-role]"), bio = modal.querySelector("[data-modal-bio]");
    document.querySelectorAll("[data-team]").forEach(card => card.addEventListener("click", () => { im.src = card.dataset.image; name.textContent = card.dataset.name; role.textContent = card.dataset.role; bio.textContent = card.dataset.bio; modal.classList.add("active"); document.body.classList.add("lock") }));
    const close = () => { modal.classList.remove("active"); document.body.classList.remove("lock") }; modal.querySelector(".close").addEventListener("click", close); modal.addEventListener("click", e => e.target === modal && close());
  }
});
