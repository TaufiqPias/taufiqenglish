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

// Sample site content - you would replace this with your actual content structure
const siteContent = [
  {
    title: "Grammar Lessons",
    content: "Learn English grammar with comprehensive lessons and examples.",
    category: "Grammar",
    url: "../grammar_resources/grammarhome.html",
  },
  {
    title: "Online Exams",
    content: "Test your knowledge with our timed online examinations.",
    category: "Exams",
    url: "../online_exam/onlinehome.html",
  },
  {
    title: "Writing Resources",
    content: "Improve your writing skills with our guides and exercises.",
    category: "Writing",
    url: "../writing_resources/writinghome.html",
  },
  {
    title: "Question Banks",
    content: "Access our extensive database of practice questions.",
    category: "Resources",
    url: "../question_bank_resources/questionbankhome.html",
  },
  {
    title: "Model Tests",
    content: "Practice with our model tests designed to simulate real exams.",
    category: "Exams",
    url: "../model_test_resources/modeltesthome.html",
  },
  {
    title: "About Me",
    content: "Learn more about the instructor and teaching methodology.",
    category: "Information",
    url: "../about-me.html",
  },
  {
    title: "Verb Tenses",
    content: "Master all English verb tenses with our detailed lessons.",
    category: "Grammar",
    url: "../grammar_resources/tenses.html",
  },
  {
    title: "Essay Writing",
    content: "Learn how to write effective essays in English.",
    category: "Writing",
    url: "../writing_resources/essays.html",
  },
];

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Function to filter content based on search query
function filterContent(query) {
  if (!query) {
    return [];
  }

  const lowerCaseQuery = query.toLowerCase();
  return siteContent.filter((item) => {
    return (
      item.title.toLowerCase().includes(lowerCaseQuery) ||
      item.content.toLowerCase().includes(lowerCaseQuery) ||
      item.category.toLowerCase().includes(lowerCaseQuery)
    );
  });
}

// Function to display search results
function displayResults(results) {
  searchResults.innerHTML = "";

  if (results.length === 0) {
    searchResults.innerHTML =
      '<div class="no-results">No results found. Try a different search term.</div>';
    searchResults.classList.add("active");
    return;
  }

  results.forEach((result) => {
    const resultElement = document.createElement("div");
    resultElement.classList.add("result-item");
    resultElement.innerHTML = `
                    <div class="result-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="result-content">
                        <h3>${result.title}</h3>
                        <p>${result.content}</p>
                        <span class="result-category">${result.category}</span>
                    </div>
                `;

    // Add click event to navigate to the page
    resultElement.addEventListener("click", () => {
      window.location.href = result.url;
    });

    searchResults.appendChild(resultElement);
  });

  searchResults.classList.add("active");
}

// Event listener for search input
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  if (query.length < 2) {
    searchResults.classList.remove("active");
    return;
  }

  const results = filterContent(query);
  displayResults(results);
});

// Close search results when clicking outside
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.classList.remove("active");
  }
});

// Allow pressing Enter to go to the first result
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query.length < 2) return;

    const results = filterContent(query);
    if (results.length > 0) {
      window.location.href = results[0].url;
    }
  }
});
