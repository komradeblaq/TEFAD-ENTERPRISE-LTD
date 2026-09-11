"use strict";

/* =========================================================
   TEFAD ENTERPRISE LTD
   Main Website JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");
  const preloader = document.getElementById("preloader");

  /* =======================================================
     PRELOADER
  ======================================================= */

  window.addEventListener("load", () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add("hidden");
      }
    }, 700);
  });

  // Prevent the page from remaining covered if loading fails.
  setTimeout(() => {
    if (preloader) {
      preloader.classList.add("hidden");
    }
  }, 3000);

  /* =======================================================
     STICKY HEADER
  ======================================================= */

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 80) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader);

  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  function openMenu() {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.add("active");
    navigation.classList.add("open");
    body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.remove("active");
    navigation.classList.remove("open");
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!navigation) return;

    if (navigation.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  if (navigation) {
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("click", (event) => {
    if (!navigation || !menuToggle) return;

    const clickedInsideMenu = navigation.contains(event.target);
    const clickedMenuButton = menuToggle.contains(event.target);

    if (
      navigation.classList.contains("open") &&
      !clickedInsideMenu &&
      !clickedMenuButton
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMenu();
    }
  });

  /* =======================================================
     SCROLL REVEAL ANIMATIONS
  ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px",
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${(index % 4) * 0.08}s`;
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =======================================================
     TESTIMONIAL SLIDER
  ======================================================= */

  const testimonials = Array.from(
    document.querySelectorAll(".testimonial")
  );

  const previousButton =
    document.getElementById("testimonialPrev");

  const nextButton =
    document.getElementById("testimonialNext");

  const dotsContainer =
    document.getElementById("testimonialDots");

  let currentTestimonial = 0;
  let testimonialTimer;

  function createTestimonialDots() {
    if (!dotsContainer || testimonials.length === 0) return;

    dotsContainer.innerHTML = "";

    testimonials.forEach((_, index) => {
      const dot = document.createElement("button");

      dot.className = "testimonial-dot";
      dot.type = "button";
      dot.setAttribute(
        "aria-label",
        `Show testimonial ${index + 1}`
      );

      if (index === currentTestimonial) {
        dot.classList.add("active");
      }

      dot.addEventListener("click", () => {
        showTestimonial(index);
        restartTestimonialTimer();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function showTestimonial(index) {
    if (testimonials.length === 0) return;

    if (index < 0) {
      currentTestimonial = testimonials.length - 1;
    } else if (index >= testimonials.length) {
      currentTestimonial = 0;
    } else {
      currentTestimonial = index;
    }

    testimonials.forEach((testimonial, testimonialIndex) => {
      testimonial.classList.toggle(
        "active",
        testimonialIndex === currentTestimonial
      );
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(
        ".testimonial-dot"
      );

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle(
          "active",
          dotIndex === currentTestimonial
        );
      });
    }
  }

  function nextTestimonial() {
    showTestimonial(currentTestimonial + 1);
  }

  function previousTestimonial() {
    showTestimonial(currentTestimonial - 1);
  }

  function startTestimonialTimer() {
    if (testimonials.length <= 1) return;

    testimonialTimer = setInterval(() => {
      nextTestimonial();
    }, 6500);
  }

  function stopTestimonialTimer() {
    clearInterval(testimonialTimer);
  }

  function restartTestimonialTimer() {
    stopTestimonialTimer();
    startTestimonialTimer();
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      previousTestimonial();
      restartTestimonialTimer();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextTestimonial();
      restartTestimonialTimer();
    });
  }

  const testimonialSlider =
    document.getElementById("testimonialSlider");

  if (testimonialSlider) {
    testimonialSlider.addEventListener(
      "mouseenter",
      stopTestimonialTimer
    );

    testimonialSlider.addEventListener(
      "mouseleave",
      startTestimonialTimer
    );
  }

  createTestimonialDots();
  showTestimonial(0);
  startTestimonialTimer();

  /* =======================================================
     SMOOTH SCROLL FOR PAGE SECTIONS
  ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        const headerHeight = header
          ? header.offsetHeight
          : 0;

        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        closeMenu();
      }
    });
  });

  /* =======================================================
     FLOATING WHATSAPP BUTTON
  ======================================================= */

  const whatsappButton = document.createElement("a");

  whatsappButton.href =
    "https://wa.me/2348154440684?text=" +
    encodeURIComponent(
      "Hello TEFAD Enterprise Ltd, I would like to make an enquiry about your services."
    );

  whatsappButton.className = "whatsapp-float";
  whatsappButton.target = "_blank";
  whatsappButton.rel = "noopener noreferrer";
  whatsappButton.setAttribute(
    "aria-label",
    "Chat with TEFAD Enterprise Ltd on WhatsApp"
  );

  whatsappButton.innerHTML = `
    <i class="fa-brands fa-whatsapp"></i>
    <span>Chat with us</span>
  `;

  body.appendChild(whatsappButton);

  /* =======================================================
     BACK-TO-TOP BUTTON
  ======================================================= */

  const backToTopButton = document.createElement("button");

  backToTopButton.className = "back-to-top";
  backToTopButton.type = "button";
  backToTopButton.setAttribute(
    "aria-label",
    "Return to the top of the page"
  );

  backToTopButton.innerHTML = `
    <i class="fa-solid fa-arrow-up"></i>
  `;

  body.appendChild(backToTopButton);

  function updateBackToTopButton() {
    if (window.scrollY > 600) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  }

  updateBackToTopButton();

  window.addEventListener(
    "scroll",
    updateBackToTopButton
  );

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /* =======================================================
     ACTIVE NAVIGATION LINK
  ======================================================= */

  const currentPage =
    window.location.pathname.split("/").pop() ||
    "index.html";

  document.querySelectorAll(".navigation a").forEach((link) => {
    const linkPage =
      link.getAttribute("href")?.split("?")[0];

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else if (!link.classList.contains("nav-cta")) {
      link.classList.remove("active");
    }
  });

  /* =======================================================
     FOOTER CONTACT SECTIONS
  ======================================================= */

  const footerGrid = document.querySelector(".footer-grid");

  if (
    footerGrid &&
    !footerGrid.querySelector(".footer-contact")
  ) {
    const servicesColumn = document.createElement("div");

    servicesColumn.className = "footer-column";
    servicesColumn.innerHTML = `
      <h3>Our Services</h3>
      <a href="services.html">Catering Services</a>
      <a href="services.html">Cakes & Pastries</a>
      <a href="services.html">Small Chops</a>
      <a href="services.html">Event Decoration</a>
      <a href="services.html">Event Planning</a>
    `;

    const contactColumn = document.createElement("div");

    contactColumn.className =
      "footer-column footer-contact";

    contactColumn.innerHTML = `
      <h3>Contact Us</h3>

      <a href="tel:+2348154440684">
        <i class="fa-solid fa-phone"></i>
        <span>+234 815 444 0684</span>
      </a>

      <a href="tel:+2348036211935">
        <i class="fa-solid fa-phone"></i>
        <span>+234 803 621 1935</span>
      </a>

      <a href="mailto:tosinfaith4real@gmail.com">
        <i class="fa-solid fa-envelope"></i>
        <span>tosinfaith4real@gmail.com</span>
      </a>

      <p>
        <i class="fa-solid fa-location-dot"></i>
        <span>Abuja Karu, Karu, Nigeria</span>
      </p>
    `;

    footerGrid.appendChild(servicesColumn);
    footerGrid.appendChild(contactColumn);
  }

  /* =======================================================
     FOOTER COPYRIGHT
  ======================================================= */

  const footer = document.querySelector(".footer");

  if (footer && !footer.querySelector(".footer-bottom")) {
    const footerBottom = document.createElement("div");

    footerBottom.className =
      "container footer-bottom";

    footerBottom.innerHTML = `
      <p>
        &copy; ${new Date().getFullYear()}
        TEFAD Enterprise Ltd. All rights reserved.
      </p>

      <p>
        Exceptional taste. Unforgettable moments.
      </p>
    `;

    footer.appendChild(footerBottom);
  }

  /* =======================================================
     EXTERNAL LINKS SECURITY
  ======================================================= */

  document
    .querySelectorAll('a[target="_blank"]')
    .forEach((link) => {
      link.setAttribute(
        "rel",
        "noopener noreferrer"
      );
    });

  /* =======================================================
     IMAGE ERROR HANDLING
  ======================================================= */

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");

      if (
        image.getAttribute("src") !==
        "images/logo.png"
      ) {
        image.style.display = "none";
      }
    });
  });
});
