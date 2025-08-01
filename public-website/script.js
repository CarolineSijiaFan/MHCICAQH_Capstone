// CAQH MHCI Capstone Website JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Navigation functionality
  initNavigation();

  // Smooth scrolling for anchor links
  initSmoothScrolling();

  // Fade-in animations
  initFadeInAnimations();

  // Active navigation highlighting
  highlightActiveNavigation();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  const navbar = document.querySelector(".navbar");

  // Add scroll effect to navigation
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle (if needed in the future)
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  // Smooth scrolling for internal anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const offsetTop =
          targetElement.getBoundingClientRect().top + window.pageYOffset - 80;

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Initialize fade-in animations for elements
 */
function initFadeInAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add a small delay to prevent the flash
        setTimeout(() => {
          entry.target.classList.add("fade-in");
        }, 50);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements that should fade in
  const elementsToAnimate = document.querySelectorAll(
    ".card, .timeline-item, .stat-item, .team-member"
  );
  elementsToAnimate.forEach((element) => {
    // Ensure elements start with opacity 0
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    observer.observe(element);
  });
}

/**
 * Highlight active navigation based on current page
 */
function highlightActiveNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");

    // Remove active class from all links
    link.classList.remove("active");

    // Add active class to current page link
    if (
      linkHref === currentPage ||
      (currentPage === "" && linkHref === "index.html") ||
      (currentPage === "/" && linkHref === "index.html")
    ) {
      link.classList.add("active");
    }
  });
}

/**
 * Removed card hover effects for non-clickable elements
 * Only buttons and links should have hover animations
 */
function initCardHoverEffects() {
  // Card hover effects removed - only clickable elements should animate
  // Button and navigation hover effects are handled by CSS
}

/**
 * Initialize button click animations
 */
function initButtonAnimations() {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/**
 * Initialize stats counter animation
 */
function initStatsAnimation() {
  const statItems = document.querySelectorAll(".stat-item h3");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const text = target.textContent;
          const hasNumber = /\d/.test(text);

          if (hasNumber) {
            animateNumber(target);
          }
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statItems.forEach((item) => {
    observer.observe(item);
  });
}

/**
 * Animate number counting up
 */
function animateNumber(element) {
  const text = element.textContent;
  const originalText = text;
  
  // Parse the original number format
  let number, suffix, format;
  
  if (text.includes('M+')) {
    // Handle millions (e.g., "4.8M+")
    number = parseFloat(text.replace(/[^\d.]/g, '')) * 1000000;
    suffix = 'M+';
    format = 'millions';
  } else if (text.includes('K+')) {
    // Handle thousands (e.g., "1.0K+")
    number = parseFloat(text.replace(/[^\d.]/g, '')) * 1000;
    suffix = 'K+';
    format = 'thousands';
  } else if (text.includes(',')) {
    // Handle comma-separated numbers (e.g., "1,000+")
    number = parseInt(text.replace(/[^\d]/g, ''));
    suffix = text.replace(/[\d]/g, '');
    format = 'comma';
  } else if (text.includes('$')) {
    // Handle dollar amounts (e.g., "$100M+")
    number = parseFloat(text.replace(/[^\d.]/g, '')) * 1000000;
    suffix = text.replace(/[\d.]/g, '');
    format = 'dollars';
  } else {
    // Handle simple numbers
    number = parseInt(text.replace(/[^\d]/g, ''));
    suffix = text.replace(/[\d]/g, '');
    format = 'simple';
  }

  if (isNaN(number)) return;

  const duration = 1500;
  const step = number / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= number) {
      current = number;
      clearInterval(timer);
      element.textContent = originalText; // Restore original text
      return;
    }

    let formattedNumber;
    if (format === 'millions') {
      formattedNumber = (current / 1000000).toFixed(1) + "M+";
    } else if (format === 'thousands') {
      formattedNumber = (current / 1000).toFixed(1) + "K+";
    } else if (format === 'comma') {
      formattedNumber = Math.floor(current).toLocaleString() + suffix;
    } else if (format === 'dollars') {
      formattedNumber = "$" + (current / 1000000).toFixed(0) + "M+";
    } else {
      formattedNumber = Math.floor(current) + suffix;
    }

    element.textContent = formattedNumber;
  }, 16);
}

/**
 * Initialize form handling (if forms are added later)
 */
function initFormHandling() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Add form validation and submission logic here
      console.log("Form submitted");
    });
  });
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize additional features when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initCardHoverEffects();
  initButtonAnimations();
  initStatsAnimation();
  initFormHandling();
});

// Handle window resize events
window.addEventListener(
  "resize",
  debounce(function () {
    // Re-initialize any size-dependent features
    console.log("Window resized");
  }, 250)
);

// Add CSS for ripple effect
const style = document.createElement("style");
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .navbar.scrolled {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
`;
document.head.appendChild(style);
