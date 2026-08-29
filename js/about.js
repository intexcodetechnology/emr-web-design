// Mission & Vision Tabs
document.addEventListener("DOMContentLoaded", () => {
  const mvTabs = document.querySelectorAll(".mv-tab");
  const mvPanels = document.querySelectorAll(".mv-panel");

  mvTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-mv-tab");
      
      // Remove active class from all tabs and panels
      mvTabs.forEach(t => t.classList.remove("active"));
      mvPanels.forEach(p => p.classList.remove("active"));
      
      // Add active class to clicked tab and corresponding panel
      tab.classList.add("active");
      document.querySelector(`[data-mv-panel="${tabName}"]`).classList.add("active");
    });
  });
});
