
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-counter]").forEach(el => {
    const target = +el.dataset.counter; let done = false;
    const c = new IntersectionObserver(es => {
      if (!es[0].isIntersecting || done) return; done = true; let s = performance.now();
      const tick = n => { let p = Math.min((n - s) / 1200, 1), v = 1 - Math.pow(1 - p, 3); el.textContent = Math.floor(target * v).toLocaleString(); if (p < 1) requestAnimationFrame(tick) }; requestAnimationFrame(tick); c.disconnect();
    }); c.observe(el);
  });
});
