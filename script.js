// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function() {
    const p = document.querySelector('.hero-content p');


//logo
const logo = document.getElementById('logo');
const text = logo.textContent;
logo.innerHTML = ''; // Clear the text

text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.style.animationDelay = `${index * 0.1}s`; // Staggered delay for each letter
    logo.appendChild(span);
});

    // Array of quotes to cycle through
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
        section.scrollIntoView({ behavior: 'smooth' });
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

// Change navigation appearance on scroll
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
    if (window.scrollY > 200) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
});

// Scroll to the top of the page when the 'back to top' button is clicked
backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Animate sections when they come into view
const sections = document.querySelectorAll(".section");

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
//btn
document.addEventListener('DOMContentLoaded', function() {
    var bookAppointmentButton = document.getElementById('bookAppointment');
  
    // Function to show the popup
    function showPopup() {
      // Phone number for appointment booking
      var phoneNumber = '+47 404 98 499';
      
      // Create a simple alert with the phone number
      alert('Ring for å bestille en avtale: ' + phoneNumber);
    }
  
    // Add click event listener to the button
    bookAppointmentButton.addEventListener('click', function(e) {
      // Prevent the default action of the button if it's set to submit or similar
      e.preventDefault();
      showPopup();
    });
  });
// This script makes all elements with the class 'service-card' clickable, redirecting to 'tjenester.html' upon click, and changes the cursor to indicate interactivity.
document.addEventListener('DOMContentLoaded', function() {
    var serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(function(card) {
      // Change cursor to pointer on hover to indicate the card is clickable
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', function() {
        window.location.href = 'tjenester.html';
      });
    });
  });

window.addEventListener("scroll", animateOnScroll);

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

// Another animateOnScroll function (likely redundant with previous one)
function animateOnScroll() {
    const sections = document.querySelectorAll(".section");
    const triggerBottom = window.innerHeight * 0.8;
    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        } else {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'none';
        }
    });
}

// Animate contact info when scrolled into view
function checkAnimation() {
    const contactInfo = document.querySelector('.contact-info');
    const rect = contactInfo.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.8) {
        contactInfo.classList.add('show');
    }
}

// Trigger animations on scroll and load
window.addEventListener('scroll', checkAnimation);
window.addEventListener('load', checkAnimation);

// Ensure initial animation on page load
window.addEventListener("scroll", animateOnScroll);
animateOnScroll();

// Update countdown timer (assumed function)
const timer = setInterval(updateCountdown, 1000);
updateCountdown();

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
  
    document.addEventListener('click', function(event) {
      const isClickInside = navLinks.contains(event.target) || event.target === navToggle || event.target.parentNode === navToggle;
      if (!isClickInside && navToggle.checked) {
        navToggle.checked = false; // Close the menu if clicked outside or on toggle
      }
    });
});
