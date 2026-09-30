(function () {
  "use strict";

  const grid = document.querySelector("#photo-gallery-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".gallery-card"));
  const filters = Array.from(document.querySelectorAll(".gallery-filter"));
  const search = document.querySelector("#gallery-search");
  const count = document.querySelector("#gallery-count");
  const empty = document.querySelector("#gallery-empty");
  const lightbox = document.querySelector("#gallery-lightbox");
  const lightboxImage = document.querySelector("#gallery-lightbox-image");
  const lightboxCaption = document.querySelector("#gallery-lightbox-caption");
  const fullSizeLink = document.querySelector("#gallery-full-size");
  const whatsappLink = document.querySelector("#gallery-whatsapp-link");
  const closeButton = document.querySelector(".gallery-lightbox-close");
  const previousButton = document.querySelector(".gallery-lightbox-prev");
  const nextButton = document.querySelector(".gallery-lightbox-next");
  let activeFilter = "all";
  let visibleCards = cards.slice();
  let activeIndex = 0;
  let returnFocus = null;

  function updateGallery() {
    const term = (search.value || "").trim().toLowerCase();
    visibleCards = [];
    cards.forEach((card) => {
      const categoryMatches = activeFilter === "all" || card.dataset.category === activeFilter;
      const searchMatches = !term || (card.dataset.search || "").includes(term);
      const visible = categoryMatches && searchMatches;
      card.hidden = !visible;
      if (visible) visibleCards.push(card);
    });
    count.textContent = "Showing " + visibleCards.length + " of " + cards.length + " photos";
    empty.hidden = visibleCards.length !== 0;
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle("is-active", active);
        filter.setAttribute("aria-pressed", String(active));
      });
      updateGallery();
    });
  });
  search.addEventListener("input", updateGallery);

  function showPhoto(index) {
    if (!visibleCards.length) return;
    activeIndex = (index + visibleCards.length) % visibleCards.length;
    const card = visibleCards[activeIndex];
    const photoLink = card.querySelector("[data-gallery-photo]");
    const thumbnail = card.querySelector("img");
    const title = card.querySelector("figcaption h3").textContent.trim();
    const category = card.querySelector("figcaption span").textContent.trim();
    lightboxImage.src = photoLink.href;
    lightboxImage.alt = thumbnail.alt;
    lightboxCaption.textContent = title + " · " + category;
    fullSizeLink.href = photoLink.href;
    const message = "Hello Hurghada Life Tours, I saw the " + title + " photo and would like information about a related trip. Please share the trip details, price, available dates and pickup options.";
    whatsappLink.href = "https://wa.me/32465006273?text=" + encodeURIComponent(message);
    const singlePhoto = visibleCards.length < 2;
    previousButton.hidden = singlePhoto;
    nextButton.hidden = singlePhoto;
  }

  function openPhoto(card) {
    returnFocus = card.querySelector("[data-gallery-photo]");
    showPhoto(visibleCards.indexOf(card));
    lightbox.hidden = false;
    document.body.classList.add("gallery-lightbox-open");
    closeButton.focus();
  }

  function closePhoto() {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
    document.body.classList.remove("gallery-lightbox-open");
    if (returnFocus) returnFocus.focus();
  }

  cards.forEach((card) => {
    card.querySelector("[data-gallery-photo]").addEventListener("click", (event) => {
      event.preventDefault();
      openPhoto(card);
    });
  });
  closeButton.addEventListener("click", closePhoto);
  previousButton.addEventListener("click", () => showPhoto(activeIndex - 1));
  nextButton.addEventListener("click", () => showPhoto(activeIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closePhoto();
  });
  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });

  updateGallery();
})();
