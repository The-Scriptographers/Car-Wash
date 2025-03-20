//Firebase Configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAC9egaN5uRkl64eftsMrcW8riKrpLVN5A",
    authDomain: "ulfsbilpleie-5b706.firebaseapp.com",
    databaseURL: "https://ulfsbilpleie-5b706-default-rtdb.firebaseio.com",
    projectId: "ulfsbilpleie-5b706",
    storageBucket: "ulfsbilpleie-5b706.firebasestorage.app",
    messagingSenderId: "175974074415",
    appId: "1:175974074415:web:b2da1ea0aecce48caa9eda",
    measurementId: "G-DBS86KKLVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Global variables for slides and gallery
let slideIndex = 0;
let slides;
let slideInterval;
let currentImages = [];
let fullscreenIndex = 0;

// Main function that drives when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Reviews functionality
    initializeReviews();

    // slides and gallery
    initializeSlideshow();
    initializeGallery();

    // general page-functionality
    initializeAnimations();
    initializeScrollEffects();
    initializeNavigation();
    initializeServiceCards();
    initializeBookingButtons();
    initializeQuoteRotation();
    initializeTestimonials();
});

// Slideshow-functionality
function initializeSlideshow() {
    let slides = document.querySelectorAll(".slide");
    if (slides.length === 0) return; // dont continue if there are no slides

    let slideIndex = 0;
    let slideInterval;

    // function for showing slides with fade-effect
    function showSlides() {
        slides.forEach((slide) => slide.classList.remove("active")); // Hide all slides
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("active"); // Show next slide
      }

    // function for manually changing slides
    function changeSlide(n) {
        clearInterval(slideInterval); // stop auto-slideshow with manual navigation
        slides.forEach((slide) => slide.classList.remove("active")); // hide all slides
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("active"); // show next slide
    }

    // function for manually changing slides
    function changeSlide(n) {
        clearInterval(slideInterval); // stop auto-slideshoww with manual navigation
        slides.forEach((slide) => slide.classList.remove("active")); // hide all slides
        slideIndex = (slideIndex + n + slides.length) % slides.length;
        slides[slideIndex].classList.add("active"); // show next slide
        slideInterval = setInterval(showSlides, 5000); // start auto-slideshow again
    }

    // make the function available gloval for buttons
    window.changeSlide = changeSlide;

    // start slideshow 
    slides[slideIndex].classList.add("active"); // show first slide
    slideInterval = setInterval(showSlides, 5000);
}

// Gallery functionality with fullscreen-view
function initializeGallery() {
    // check if neccessary elements exist
    const fullscreenOverlay = document.getElementById("fullscreenOverlay");
    if (!fullscreenOverlay) return; // terminate if overlay doesnt exist

    let slides = document.querySelectorAll(".slide img");
    let galleryImages = document.querySelectorAll(".gallery-img");
    let fullscreenImage = document.getElementById("fullscreenImage");
    let prevBtn = document.getElementById("prevFullscreen");
    let nextBtn = document.getElementById("nextFullscreen");
    let fullscreenIndex = 0;
    let currentImages = [];
    let body = document.body;

    // function for opening fullscreen with correct picture set
    function openFullscreen(imgSrc, images) {
        currentImages = [...images]; // store correct picture set
        fullscreenIndex = currentImages.findIndex(
            (img) => img.src === imgSrc
        );

        fullscreenImage.src = imgSrc;
        fullscreenOverlay.style.display = "flex";

        body.style.overflow = "hidden"; // deactivate scrolling
    }

    // change fullscreen-picture with navigation buttons
    function changeFullscreenImage(n) {
        fullscreenIndex = 
        (fullscreenIndex + n + currentImages.length) %
        currentImages.length;
        fullscreenImage.src = currentImages[fullscreenIndex].src;
    }

    // close fullscreen-overlay
    function closeFullscreen() {
        fullscreenOverlay.style.display = "none";
        body.style.overflow = "auto"; 
    }

    // make functions global for buttons
    window.openFullscreen = openFullscreen;
    window.changeFullscreenImage = changeFullscreenImage;
    window.closeFullscreen = closeFullscreen;

    // attach click-events til slideshow-images (separate selection)
    if (slides.length > 0) {
        slides.forEach((img) => {
            img.addEventListener("click", () => openFullscreen(img.src, slides));
        });
    }

    // attach click-events to gallery-pictures (separate selection)
    if (galleryImages.length > 0) {
        galleryImages.forEach((img) => {
            img.addEventListener("click", () =>
                openFullscreen(img.src, galleryImages)
        );
        });
    }

    // navigation buttons for fullscreen
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => changeFullscreenImage(-1));
        nextBtn.addEventListener("click", () => changeFullscreenImage(1));
    }

    // close fullscreen by clickung outside of the picture
    fullscreenOverlay.addEventListener("click", (e) => {
        if (e.target === fullscreenOverlay) closeFullscreen();
    });
}

// Firebase reviews functionality
function initializeReviews() {
    // Bring elements from HTML - with check if it i exists
    const titleInput = document.getElementById("title");
    const ratingInput = document.getElementById("rating");
    const reviewerInput = document.getElementById("reviewer");
    const commentInput = document.getElementById("comment");
    const addButton = document.getElementById("addButton");
    const dataList = document.getElementById("dataList");

    // If we are not on the review-page, exit function
    if (!titleInput || !ratingInput || !reviewerInput || !commentInput || !addButton || !dataList) {
        return;
    }

    
    // add the data in realtime database when the button gets pushed
    addButton.addEventListener("click", () => {
        const title = titleInput.value;
        const rating = ratingInput.value;
        const reviewer = reviewerInput.value;
        const comment = commentInput.value;

        if (title && rating && reviewer && comment ) {
            const newReviewKey = push(ref(db, 'reviews')).key; // generates a new unique key
            set(ref(db, 'reviews/' + newReviewKey), {
                title: title,
                rating: rating,
                reviewer: reviewer,
                comment: comment
            })
            .then(() => {
                console.log("Anmeldelse lagt til:", title);
                titleInput.value = "";
                ratingInput.value = "";
                reviewerInput.value = "";
                commentInput.value = "";
                fetchData(); // Updates list with reviews
            })
            .catch(error => console.error("Feil ved lagring:", error));
        } else {
            console.log("Alle felt må fylles ut!");
        }
    });

    // Load inn reviews by startup
    fetchData();
}

// retrieve data from Realtime Database and show in the list
function fetchData() {
    const dataList = document.getElementById("dataList");
    if(!dataList) return;

    const reviewsRef = ref(db, 'reviews');
    get(reviewsRef).then(snapshot => {
        if (snapshot.exists()) {
            dataList.innerHTML = ""; // clear list before update

            snapshot.forEach(childSnapshot => {
                const review = childSnapshot.val();

                // create HTML elements for a cleaner view
                const reviewItem = document.createElement("div");
                reviewItem.classList.add("review-item");

                reviewItem.innerHTML = `<h3>${review.title} (${review.rating}★)</h3>
                <p><strong>Forfatter:</strong> ${review.reviewer}</p>
                <p>${review.comment}</p>
                `;

                dataList.appendChild(reviewItem);
            });
        } else {
            console.log("Ingen anmeldelser funnet");
        }
    }).catch(error => console.error("Feil ved henting:", error));
}



// Initialize animations
function initializeAnimations() {
    const logo = document.getElementById('logo');
    if (logo) {
        const text = logo.textContent;
        logo.innerHTML = ''; 

        text.split('').forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.animationDelay = `${index * 0.1}s`;
            logo.appendChild(span);
        });
    }

        // animate sections when scrollng
        animateOnScroll();
}

// Booking-functionality
function initializeBookingButtons() {
    const BOOKING_CONFIG = {
        phoneNumber: '+4740498499',
        buttonSelector: '.book-appointment-btn'
    };

    // Find all elements with book-apointment-btn class
    const bookingButtons = document.querySelectorAll(BOOKING_CONFIG.buttonSelector);

    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default button behavior
            e.preventDefault();

            // Start phonecall
            window.location.href = `tel:${BOOKING_CONFIG.phoneNumber}`;
        }); 
    });
}

// quote rotation
function initializeQuoteRotation() {
    const p = document.querySelector('.hero-content p');
    if (!p) return;

    // Arrays with quotes that rotate
    const quotes = [
        "Skinnende bil, hver gang!",
        "Den ultimate bilpleieopplevelsen",
        "Bilen din fortjener det beste",
        "Gi bilen din den behandlingen den fortjener"
    ];
    let currentQuoteIndex = 0;

    // Function for updating the quote with a fade-effect
    function updateQuote() {
        p.style.opacity = '0'; // Fade out the current quote
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            p.textContent = quotes[currentQuoteIndex];
            p.style.opacity = '1'; // Fade in the new quote
        }, 1000) // delay with a fade-out-animation
    }

    // make the first quote visible
    p.style.opacity = '1';
    // set interval to change quote every 5.second
    setInterval(updateQuote, 5000);
}

// iniitalize testimonials
function initializeTestimonials() {
    // Testimonial rotation
    const testimonials = document.querySelectorAll(".testimonial-card");
    if (testimonials.length === 0) return;

    let currentTestimonial = 0;
    const totalTestimonials = testimonials.length;

    // show testimonial with given index
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? "block" : "none";
        });
    }

    // go to the next testimonial
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }

    // start rotation
    setInterval(nextTestimonial, 9000); // Rotate every 9.second
    showTestimonial(currentTestimonial); // show first testimonial
}

// scroll effects
function initializeScrollEffects() {
    // change navigation view when scrolling
    const nav = document.querySelector("nav");
    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        });
    }

    // Control visibility by the "back to top"-button based on scrollposition
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 200) {
                backToTop.style.display = "block";
            } else {
                backToTop.style.display = "none";
            }
        });

        // Scroll to top of the side when "back to top"-button clicks
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
    
    // Animate sections when they come into view
    window.addEventListener("scroll", animateOnScroll);

    // Animate contact info when scrolled in view
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        function checkAnimation() {
            const rect = contactInfo.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8) {
                contactInfo.classList.add('show');
            }
        }

        window.addEventListener('scroll', checkAnimation);
        window.addEventListener('load', checkAnimation);
    }
}

// animate when scrolling
function animateOnScroll() {
    const sections = document.querySelectorAll(".section, .section-about, .container, .slideshow-container, .gallery-container");
    const triggerBottom = window.innerHeight * 0.8;

    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add("visible");
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        } else {
            section.classList.remove("visible");
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'none';
        }
    });
}

// initialize navigation
function initializeNavigation() {
   // Mobile menu toggle functionality
   const navToggle = document.getElementById('nav-toggle');
   const navLinks = document.querySelector('.nav-links');
    
   if (navToggle && navLinks) {
    document.addEventListener('click', function(event) {
        const isClickInside = navLinks.contains(event.target) ||
                        event.target === navToggle ||
                        (event.target.parentNode && event.target.parentNode === navToggle);

        if (!isClickInside && navToggle.checked) {
            navToggle.checked = false; // Close the menu if clicked outside or on toggle
        }
    });
   }
   
   // remove .html from URL in browser's addressfield
   if (window.location.pathname.endsWith('.html')) {
    const cleanPath = window.location.pathname.replace('.html', '');
    window.history.replaceState({}, document.title, cleanPath);
   }
   
   // Handle navigation click to add .html
   document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        // Check if there is a link that should not have default behavior 
        if (link.getAttribute('data-no-navigate') === 'true') {
            return; // Skip default behaviour for special links
        }
        e.preventDefault();
        const href = link.getAttribute('href');
        // add only .html if there is not already there and not an external link
        const newHref = href.endsWith('.html') || href.startsWith('http') ? href : href + '.html';
        window.location.href = newHref;
         });
    });
}


// initialize servicecards
function initializeServiceCards() {
    var serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(function(card) {
        // Change mouse cursor to pointer on hover to indicate that the card is clickable
        card.style.cursor = 'pointer';

        card.addEventListener('click', function() {
            window.location.href = 'tjenester.html';
        });
    });
}

// function for scrolling evenly to a section after ID
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if(section) {
        section.scrollIntoView({ behavior: 'smooth'});
    }
}

