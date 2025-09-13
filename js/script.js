// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle Functionality
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      // Toggle the 'active' class on both hamburger and nav menu
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Optional: Toggle body scroll when menu is open
      document.body.style.overflow =
        document.body.style.overflow === "hidden" ? "" : "hidden";
    });
  }

  // Mobile Dropdown Toggle Functionality
  const dropdownTriggers = document.querySelectorAll(".dropdown > a");

  dropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        // Only on mobile
        e.preventDefault(); // Prevent default link behavior
        const dropdownMenu = this.nextElementSibling;

        // Close any other open dropdowns
        document.querySelectorAll(".dropdown-menu.active").forEach((menu) => {
          if (menu !== dropdownMenu) {
            menu.classList.remove("active");
          }
        });

        // Toggle current dropdown
        dropdownMenu.classList.toggle("active");
      }
    });
  });

  // Close mobile menu when a link is clicked
  const navLinks = document.querySelectorAll(".nav-menu a:not(.dropdown > a)");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling

      // Close all dropdown menus
      document.querySelectorAll(".dropdown-menu.active").forEach((menu) => {
        menu.classList.remove("active");
      });
    });
  });

  // Close dropdowns when clicking outside (desktop)
  document.addEventListener("click", function (e) {
    if (window.innerWidth > 768) {
      if (
        !e.target.matches(".dropdown > a") &&
        !e.target.closest(".dropdown-menu")
      ) {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.style.display = "none";
        });
      }
    }
  });
});
