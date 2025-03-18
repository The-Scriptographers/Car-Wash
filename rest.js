let slideIndex = 0;
let slides = document.querySelectorAll(".slide");
let slideInterval;

// Function to show slides with fade effect
function showSlides() {
  slides.forEach((slide) => slide.classList.remove("active")); // Hide all slides
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active"); // Show next slide
}

// Function to manually change slides

function changeSlide(n) {
    clearInterval(slideInterval); // stop auto-slideshow with manual navigation
    slides.forEach((slide) => slide.classList.remove("active")); // hide all slides
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active"); // show next slide
}

function changeSlide(n) {
  clearInterval(slideInterval); // Stop auto slideshow when manually navigating
  slides.forEach((slide) => slide.classList.remove("active")); // Hide all slides
  slideIndex = (slideIndex + n + slides.length) % slides.length;
  slides[slideIndex].classList.add("active"); // Show new slide
  slideInterval = setInterval(showSlides, 5000); // Restart auto slideshow
}

// Start slideshow on page load
document.addEventListener("DOMContentLoaded", () => {
  slides[slideIndex].classList.add("active"); // Show the first slide
  slideInterval = setInterval(showSlides, 5000);
});

document.addEventListener("DOMContentLoaded", () => {
  let slides = document.querySelectorAll(".slide img");
  let galleryImages = document.querySelectorAll(".gallery-img");
  let fullscreenOverlay = document.getElementById("fullscreenOverlay");
  let fullscreenImage = document.getElementById("fullscreenImage");
  let prevBtn = document.getElementById("prevFullscreen");
  let nextBtn = document.getElementById("nextFullscreen");
  let fullscreenIndex = 0;
  let currentImages = [];
  let body = document.body;
  let slideInterval = null;

  // Function to open fullscreen with correct pool
  function openFullscreen(imgSrc, images) {
    currentImages = [...images]; // Store the correct image set
    fullscreenIndex = currentImages.findIndex(
      (img) => img.src === imgSrc
    );

    fullscreenImage.src = imgSrc;
    fullscreenOverlay.style.display = "flex";

    body.style.overflow = "hidden"; // Disable scrolling
  }

  // Change fullscreen image with navigation buttons
  function changeFullscreenImage(n) {
    fullscreenIndex =
      (fullscreenIndex + n + currentImages.length) %
      currentImages.length;
    fullscreenImage.src = currentImages[fullscreenIndex].src;
  }

  // Close fullscreen overlay
  function closeFullscreen() {
    fullscreenOverlay.style.display = "none";

    body.style.overflow = "auto"; // Re-enable scrolling
  }

  // Attach click events to slideshow images (Separate Pool)
  slides.forEach((img) => {
    img.addEventListener("click", () => openFullscreen(img.src, slides));
  });

  // Attach click events to gallery images (Separate Pool)
  galleryImages.forEach((img) => {
    img.addEventListener("click", () =>
      openFullscreen(img.src, galleryImages)
    );
  });

  // Navigation buttons for fullscreen
  prevBtn.addEventListener("click", () => changeFullscreenImage(-1));
  nextBtn.addEventListener("click", () => changeFullscreenImage(1));

  // Close fullscreen when clicking outside the image
  fullscreenOverlay.addEventListener("click", (e) => {
    if (e.target === fullscreenOverlay) closeFullscreen();
  });

  // Attach navigation functions to window (so buttons work)
  window.changeFullscreenImage = changeFullscreenImage;

  // Start slideshow when page loads
  startSlideshow();
});

document.addEventListener("DOMContentLoaded", () => {
  // alows for the image gallery to use the fullscreen-overlay function
  let galleryImages = document.querySelectorAll(".gallery-img");

  // Add click event to open fullscreen from gallery images
  galleryImages.forEach((img) => {
    img.addEventListener("click", () => openFullscreen(img.src));
  });
});