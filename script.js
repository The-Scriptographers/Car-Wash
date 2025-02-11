// Wait ffor the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function() {
    const p = document.querySelector('.hero-content p');

    // Logo
    const logo = document.getElementById('logo');
    const text = logo.textContent;
    logo.innerHTML = ''; // Clear the text

    text.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.animationDelay = `${index * 0.1}s`; // Staggered delay for each letter
        logo.appendChild(span);
    });

    const quotes = [
        "Skinnende bil, hver gang!",
        "Den ultimate bilpleieopplevelsen",
        "Bilen din fortjener det beste",
        "Gi bilen din den behandlingen den fortjener"
    ];
    let currentQuoteIndex = 0;

    // Function to update the quote with a fade in/out effect
    function updateQuote() {
        p.style.opacity = '0'; // Fade out the current quote
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            p.textContent = quotes[currentQuoteIndex];
            p.style.opacity = '1'; // Fade in the new quote
        }, 1000); // Delay for fade out animation
    }

    // Make the initial quote visible
    p.style.opacity = '1';
    // Set interval to change the quote every 5 seconds
    setInterval(updateQuote, 5000);
});

// Function to scroll smoothly to a section by its ID
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({behavior: 'smooth'});
    }
}

// Testimonial rotation setup
let currentTestimonial = 0;
const testimonials = document.querySelectorAll(".testimonial-card");
const totalTestimonials = testimonials.length;

// Show the testimonial at the given index
function showTestimonial(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.style.display = i === index ? "block" : "none";
    });
}

// Move to the next testimonial
function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    showTestimonial(currentTestimonial);
}

// If there are testimonials, start rotation
if (totalTestimonials > 0) {
    setInterval(nextTestimonial, 9000); // Rotate every 9 seconds
    showTestimonial(currentTestimonial); // Show initial testimonial
}

// Change navigation apperance on scroll 
window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 50) {
        nav.classList.add("scrolled");
    } else {
        nav.classList.remove("scrolled");
    }
});

// Control visibility of 'back to top' button based on scroll position
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
    if(window.scrollY > 200) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

// scroll to the top of the page when the 'back to top' button is clicked
backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth"});
});

// Animate sections when they come into view
const sections = document.querySelectorAll(".section, .section-about");

function animateOnScroll() {
    const triggerBottom = window.innerHeight * 0.8;
    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add("visible");
        } else {
            section.classList.remove("visible");
        }
    });
}

window.addEventListener("scroll", animateOnScroll);

// Initialize Google Map for business location
// Initialize Google Map for business location
function initMap() {
    const businessLocation = { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE }; // Replace with actual coordinates
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: businessLocation,
        styles: [{
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#ffffff"}]
        }]
    });
    
    new google.maps.Marker({
        position: businessLocation,
        map: map,
        title: "ULF's Bilpleie" 
    });
}
// Trigger map initialization when the window loads
window.initMap = initMap;

// Ensure initial animation on page Load
window.addEventListener("scroll", animateOnScroll);
animateOnScroll();

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector(".nav-links");

    document.addEventListener('click', function(event) {
        const isClickInside = navLinks.contains(event.target) || event.target === navToggle || event.target.parentNode === navToggle;
        if (!isClickInside && navToggle.checked) {
            navToggle.checked = false; // Close the menu if clicked outside or on toggle
        }
    });
});