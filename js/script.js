document.addEventListener("DOMContentLoaded", () => {
  console.log("Kirito's Advanced Portfolio Loaded!");

  // --- Preloader ---
  const preloader = document.getElementById("preloader");
  if (preloader) {
    // Nascondi il preloader dopo il caricamento completo
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("hidden");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 500);
      }, 500);
    });
    
    // Fallback se l'evento load non si attiva per qualche motivo
    setTimeout(() => {
      if (!preloader.classList.contains("hidden")) {
        preloader.classList.add("hidden");
      }
    }, 2500);
  }

  // --- Typing Text Effect for Hero Subtitle ---
  const subtitleElement = document.querySelector('.hero-content .subtitle');
  if (subtitleElement) {
    const staticStart = "Studente IT | ";
    const staticEnd = " | Clan Leader";
    const roles = [
      "Sviluppatore Full-Stack",
      "Next.js Developer",
      "MQL5 Developer",
      "C++ Developer", 
      "Python Developer"
    ];
    
    let currentRoleIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let typingSpeed = 100;
    
    function typeEffect() {
      const currentRole = roles[currentRoleIndex];
      
      // If deleting, remove a character
      if (isDeleting) {
        currentText = currentRole.substring(0, currentText.length - 1);
        typingSpeed = 50; // Faster when deleting
      } else {
        // If typing, add a character
        currentText = currentRole.substring(0, currentText.length + 1);
        typingSpeed = 100; // Normal speed when typing
      }
      
      // Update the text with static parts and changing part
      subtitleElement.textContent = staticStart + currentText + staticEnd;
      
      // Logic for switching between typing and deleting
      if (!isDeleting && currentText === currentRole) {
        // If finished typing a full word, start deleting after delay
        typingSpeed = 1500; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        // If finished deleting, move to next word
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before starting next word
      }
      
      // Continue the animation
      setTimeout(typeEffect, typingSpeed);
    }
    
    // Start the typing effect
    typeEffect();
  }

  // --- Mobile Menu Toggle ---
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navbarLinks = document.querySelector(".navbar-links");
  
  if (mobileMenuToggle && navbarLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      navbarLinks.classList.toggle("open");
      // Change icon based on menu state
      const icon = mobileMenuToggle.querySelector("i");
      if (icon) {
        if (navbarLinks.classList.contains("open")) {
          icon.className = "fas fa-times";
        } else {
          icon.className = "fas fa-bars";
        }
      }
    });
    
    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll(".navbar-links a");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navbarLinks.classList.remove("open");
        // Reset icon
        const icon = mobileMenuToggle.querySelector("i");
        if (icon) {
          icon.className = "fas fa-bars";
        }
      });
    });
  }

  // --- Navbar scroll behavior ---
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // --- Active navigation state based on scroll ---
  const sections = document.querySelectorAll(".content-section");
  const navItems = document.querySelectorAll(".navbar-links a");
  
  window.addEventListener("scroll", () => {
    let current = "";
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });
    
    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href").includes(current)) {
        item.classList.add("active");
      }
    });
  });

  // --- Back to Top Button ---
  const backToTop = document.querySelector(".back-to-top");
  
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });
  }

  // --- Section title animations ---
  const sectionTitles = document.querySelectorAll(".section-title");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.1
  });
  
  sectionTitles.forEach(title => {
    observer.observe(title);
  });

  // --- Animazioni On Scroll (Intersection Observer) ---
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const progressBars = document.querySelectorAll(".progress-bar");

  if ("IntersectionObserver" in window) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2, // Trigger un po' prima
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Applica delay stagger se presente
          if (el.dataset.staggerDelay) {
            // Imposta la variabile CSS per il delay dinamicamente
            el.style.setProperty("--stagger-index", el.dataset.staggerDelay);
          }
          el.classList.add("visible");
          
          // Attiva le progress bar quando sono visibili
          if (el.classList.contains("progress-bar")) {
            el.classList.add("animate");
          }
          
          observer.unobserve(el); // Anima solo una volta
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    animatedElements.forEach((el) => observer.observe(el));
    progressBars.forEach((bar) => observer.observe(bar)); // Osserva le barre di progresso
  } else {
    // Fallback per browser vecchi: mostra tutto subito
    console.warn(
      "IntersectionObserver non supportato, animazioni disabilitate."
    );
    animatedElements.forEach((el) => el.classList.add("visible"));
    progressBars.forEach((bar) => bar.classList.add("animate"));
  }

  // --- Anno Dinamico nel Footer ---
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Smooth Scroll per link interni ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70, // Offset per la navbar
          behavior: 'smooth'
        });
      }
    });
  });
  
  // --- Glitch Effect Animation ---
  const glitchElements = document.querySelectorAll('.glitch');
  
  function triggerGlitch() {
    glitchElements.forEach(el => {
      // Add glitch animation
      el.classList.add('glitching');
      
      // Remove after animation completes
      setTimeout(() => {
        el.classList.remove('glitching');
      }, 1000);
    });
  }
  
  // Trigger glitch randomly
  setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance to glitch
      triggerGlitch();
    }
  }, 3000);
  
  // Add hover effect to profile pic
  const profilePic = document.querySelector('.profile-pic');
  if (profilePic) {
    profilePic.addEventListener('mouseover', () => {
      profilePic.style.transform = 'scale(1.05) rotate(5deg)';
    });
    
    profilePic.addEventListener('mouseout', () => {
      profilePic.style.transform = 'scale(1)';
    });
  }
  
  // Make skill-category progress bars animate when in view
  const skillCategories = document.querySelectorAll('.skill-category');
  skillCategories.forEach(category => {
    const progressBar = category.querySelector('.progress-bar');
    if (progressBar) {
      category.addEventListener('mouseenter', () => {
        progressBar.style.opacity = '1';
        progressBar.style.height = '8px';
      });
      
      category.addEventListener('mouseleave', () => {
        progressBar.style.opacity = '0.7';
        progressBar.style.height = '6px';
      });
    }
  });
});
