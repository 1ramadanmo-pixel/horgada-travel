(function () {
  "use strict";
  document.documentElement.classList.add("has-modern-ui");

  // A slim neon progress line gives a clear sense of movement on long trip pages.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);
  let progressQueued = false;
  const updateProgress = () => {
    const page = document.documentElement;
    const range = page.scrollHeight - window.innerHeight;
    const amount = range > 0 ? Math.min(100, Math.max(0, (window.scrollY / range) * 100)) : 0;
    progress.style.width = amount + "%";
    progressQueued = false;
  };
  const queueProgress = () => {
    if (!progressQueued) {
      progressQueued = true;
      window.requestAnimationFrame(updateProgress);
    }
  };
  window.addEventListener("scroll", queueProgress, { passive: true });
  window.addEventListener("resize", queueProgress, { passive: true });
  updateProgress();

  // Reveal content as it enters view, while keeping the page readable if JS is unavailable.
  const revealTargets = document.querySelectorAll(
    ".about-area .section-title, .about-area .about-content, .project-area .section-title, .project-area .project-item, .blog-area .section-title, .blog-area .blog-item, .breadcrumb-content, .about-area-two .about-img, .about-area-two .about-content, .team-area-two .team-item, .articles .box, .contact-info-item, .contact-form-wrap"
  );
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealTargets.forEach((element, index) => {
      element.classList.add("reveal-ready");
      element.style.transitionDelay = (Math.min(index % 4, 3) * 70) + "ms";
      observer.observe(element);
    });
  }

  // A restrained tilt makes the excursion tiles feel responsive on pointer devices.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (finePointer.matches) {
    document.querySelectorAll(".project-area .project-item").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--spot-x", ((x + 0.5) * 100).toFixed(1) + "%");
        card.style.setProperty("--spot-y", ((y + 0.5) * 100).toFixed(1) + "%");
        card.style.transform = "perspective(900px) rotateX(" + (-y * 2).toFixed(2) + "deg) rotateY(" + (x * 2).toFixed(2) + "deg) translateY(-2px)";
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
        card.style.removeProperty("--spot-x");
        card.style.removeProperty("--spot-y");
      });
    });
  }

  // Route the contact form to the business WhatsApp number already shown on the site.
  const contactForm = document.querySelector("#contact-whatsapp-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.querySelector("#contact-name").value.trim();
      const phone = document.querySelector("#contact-phone").value.trim();
      const message = document.querySelector("#contact-message").value.trim();
      const body = "Hello Hurghada Life Tours, my name is " + name + ".\nMy phone number is " + phone + ".\n\n" + message;
      window.location.href = "https://wa.me/32465006273?text=" + encodeURIComponent(body);
    });
  }

  // Close the mobile drawer after choosing a page or an in-page destination.
  document.querySelectorAll(".mobile-menu .navigation a").forEach((link) => {
    link.addEventListener("click", () => document.body.classList.remove("mobile-menu-visible"));
  });
})();
