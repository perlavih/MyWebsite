const lightboxGallery = document.querySelector(".gallery");
const lightbox = document.querySelector(".lightbox");
const galleryWindow = lightbox.closest('.window-gallery');
const lightboxImage = lightbox.querySelector("img");
const lightboxDescription = lightbox.querySelector('.lightbox-description');
const closeBtn = lightbox.querySelector(".close");
const prevBtn = lightbox.querySelector(".prev");
const nextBtn = lightbox.querySelector(".next");
const gallery = document.querySelector('.window-gallery .gallery');
const galleryFilters = document.querySelectorAll('.window-gallery [data-filter]');

let currentIndex = 0;
let images = Array.from(lightboxGallery.querySelectorAll(".arts img"));

// Open Lightbox
lightboxGallery.addEventListener("click", (e) => {
  if (e.target.matches('.arts img') && !e.target.hidden) {
    images = Array.from(lightboxGallery.querySelectorAll('.arts:not([hidden]) img:not([hidden])'));
    currentIndex = images.indexOf(e.target);
    updateLightbox();
    lightbox.classList.add("is-open");
    galleryWindow.classList.add('is-lightbox-open');
  }
});

// Close Lightbox
closeBtn.addEventListener("click", () => {
  closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('is-open');
  galleryWindow.classList.remove('is-lightbox-open');
}

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
  const description = images[currentIndex].dataset.description || '';
  lightboxDescription.textContent = description;
  lightboxDescription.hidden = !description.trim();
}

// Close Lightbox on Outside Click
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
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
      item.hidden = selectedFilter === 'all'
        ? categories.includes('fanarts')
        : !categories.includes(selectedFilter);
    });

    gallery.querySelectorAll('.arts').forEach((group) => {
      const hasResults = Array.from(group.querySelectorAll('img')).some((image) => !image.hidden);
      group.hidden = !hasResults;
      const yearHeader = group.previousElementSibling;
      if (yearHeader?.classList.contains('year')) yearHeader.hidden = !hasResults;
    });
  });
});

// Apply the initial filter too, so fanarts are hidden before the first click.
document.querySelector('.window-gallery [data-filter].is-selected')?.click();

const galleryBackTop = galleryWindow.querySelector('.gallery-back-top');
function updateBackTop() {
  const isVisible = gallery.scrollTop >= 150;
  galleryBackTop.setAttribute('aria-hidden', String(!isVisible));
  galleryBackTop.tabIndex = isVisible ? 0 : -1;

  if (isVisible) {
    galleryBackTop.hidden = false;
    requestAnimationFrame(() => {
      if (gallery.scrollTop >= 150) galleryBackTop.classList.add('is-visible');
    });
  } else {
    galleryBackTop.classList.remove('is-visible');
    window.setTimeout(() => {
      if (!galleryBackTop.classList.contains('is-visible')) galleryBackTop.hidden = true;
    }, 240);
  }
}
gallery.addEventListener('scroll', updateBackTop, { passive: true });
galleryBackTop.addEventListener('click', () => {
  gallery.scrollTo({
    top: 0,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
});
updateBackTop();
