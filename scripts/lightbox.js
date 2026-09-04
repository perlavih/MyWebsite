const lightboxGallery = document.querySelector(".gallery");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeBtn = lightbox.querySelector(".close");
const prevBtn = lightbox.querySelector(".prev");
const nextBtn = lightbox.querySelector(".next");
const gallery = document.querySelector('.window-gallery .gallery');
const galleryFilters = document.querySelectorAll('.window-gallery [data-filter]');

let currentIndex = 0;
const images = Array.from(lightboxGallery.querySelectorAll("img"));

// Open Lightbox
lightboxGallery.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    currentIndex = images.indexOf(e.target);
    updateLightbox();
    lightbox.classList.add("is-open");
  }
});

// Close Lightbox
closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("is-open");
});

// Navigate to Previous Image
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLightbox();
});

// Navigate to Next Image
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateLightbox();
});

// Update Lightbox Image
function updateLightbox() {
  const imgSrc = images[currentIndex].src;
  lightboxImage.src = imgSrc;
  lightboxImage.alt = images[currentIndex].alt;
}

// Close Lightbox on Outside Click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("is-open");
  }
});

galleryFilters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const selectedFilter = filterButton.dataset.filter;

    galleryFilters.forEach((button) => {
      const isSelected = button === filterButton;
      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });

    if (!gallery) return;

    gallery.querySelectorAll('[data-category]').forEach((item) => {
      const categories = item.dataset.category.split(/\s+/);
      item.hidden = selectedFilter !== 'all' && !categories.includes(selectedFilter);
    });
  });
});
