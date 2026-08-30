/**
 * RecruitFlow AI™ - Main Application Controller (Executive White & Brown Theme)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Storage Service
  StorageService.init();

  // Initialize Chatbot instance
  const embeddedChatbot = new Chatbot("embedded-chatbot-container");
  window.embeddedChatbot = embeddedChatbot;

  // Initialize Dashboard instance
  const dashboardApp = new Dashboard("dashboard-container");
  window.dashboardApp = dashboardApp;

  // Tab switching controller
  const tabs = document.querySelectorAll(".nav-tab-btn");
  const views = document.querySelectorAll(".app-view-section");

  function switchTab(targetViewId) {
    views.forEach(view => {
      if (view.id === targetViewId) {
        view.classList.remove("hidden");
      } else {
        view.classList.add("hidden");
      }
    });

    tabs.forEach(tab => {
      const tabTarget = tab.getAttribute("data-target");
      if (tabTarget === targetViewId) {
        tab.className = "nav-tab-btn px-4 py-2 rounded-xl text-xs font-semibold bg-[#5C4033] text-white shadow-sm transition-all flex items-center gap-2";
      } else {
        tab.className = "nav-tab-btn px-4 py-2 rounded-xl text-xs font-medium text-[#6B5E55] hover:text-[#2C221E] hover:bg-white transition-all flex items-center gap-2";
      }
    });

    if (targetViewId === "dashboard-view" && window.dashboardApp) {
      window.dashboardApp.refresh();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-target");
      switchTab(target);
    });
  });

  const startScreeningBtns = document.querySelectorAll(".trigger-screening-btn");
  startScreeningBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab("landing-view");
      const chatSection = document.getElementById("chat-section");
      if (chatSection) {
        chatSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const openDashboardBtns = document.querySelectorAll(".trigger-dashboard-btn");
  openDashboardBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab("dashboard-view");
    });
  });

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
});
