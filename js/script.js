document.addEventListener("DOMContentLoaded", () => {
  console.log("Kirito's Advanced Portfolio Loaded!");

  // --- Preloader ---
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        // Aggiungi un piccolo delay per un effetto più liscio
        preloader.classList.add("hidden");
      }, 300); // 300ms delay
    });
  }

  // --- Throttle Function (limita la frequenza di esecuzione di una funzione) ---
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // --- Animazioni On Scroll (Intersection Observer) ---
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const sectionTitles = document.querySelectorAll(".section-title");

  if ("IntersectionObserver" in window) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1, // Trigger un po' prima
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Applica delay stagger se presente
          if (el.dataset.staggerDelay) {
            // Imposta la variabile CSS per il delay dinamicamente
            el.style.setProperty("--stagger-index", el.dataset.staggerDelay);
          }
          el.classList.add("visible");
          observer.unobserve(el); // Anima solo una volta
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    animatedElements.forEach((el) => observer.observe(el));
    sectionTitles.forEach((title) => observer.observe(title)); // Osserva anche i titoli per la loro animazione
  } else {
    // Fallback per browser vecchi: mostra tutto subito
    console.warn(
      "IntersectionObserver non supportato, animazioni disabilitate."
    );
    animatedElements.forEach((el) => el.classList.add("visible"));
    sectionTitles.forEach((title) => title.classList.add("visible"));
  }

  // --- Anno Dinamico nel Footer ---
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Scrollspy per Sidebar Attiva ---
  const sidebarLinks = document.querySelectorAll(".sidebar-menu .nav-link");
  const sections = document.querySelectorAll(".content-section, .hero-section"); // Includi hero

  function changeActiveLink() {
    let index = sections.length;

    while (--index && window.scrollY + 100 < sections[index].offsetTop) {} // +100px offset

    sidebarLinks.forEach((link) => link.classList.remove("active"));

    // Assicurati che l'indice sia valido e che ci sia un link corrispondente
    if (index >= 0 && sidebarLinks[index]) {
      sidebarLinks[index].classList.add("active");
    }
    // Gestisci caso speciale per la prima sezione se non rilevata correttamente
    else if (window.scrollY < sections[1]?.offsetTop - 100) {
      sidebarLinks[0]?.classList.add("active");
    }
  }

  // Esegui all'inizio e poi throttled on scroll
  changeActiveLink();
  // Usa la funzione throttle per limitare chiamate a changeActiveLink
  window.addEventListener("scroll", throttle(changeActiveLink, 150)); // Controlla ogni 150ms
});
