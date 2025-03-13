// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function() {
    const p = document.querySelector('.hero-content p');

    // Existing logo animation code
    const logo = document.getElementById('logo');
    const text = logo.textContent;
    logo.innerHTML = ''; 

    text.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.style.animationDelay = `${index * 0.1}s`;
        logo.appendChild(span);
    });

    // Centralized Booking Configuration
    const BOOKING_CONFIG = {
        phoneNumber: '+4740498499',
        defaultMessage: 'Hei, jeg vil gjerne bestille en time.',
        buttonSelector: '.book-appointment-btn'
    };
    // Create and append the mobile choice popup
     const mobilePopup = document.createElement('div');
     mobilePopup.className = 'mobile-choice-popup';
     mobilePopup.innerHTML = `
    <div class="mobile-popup-content">
        <span class="close-mobile-popup">×</span>
        <h3>Ring meg eller send en melding med ønsket tidspunkt – jeg svarer deg så snart jeg kan! 😊</h3>
        <button class="call-option">Ring nå</button>
        <button class="message-option">Send melding</button>
    </div>
`;
document.body.appendChild(mobilePopup);

    // Create and append the popup element to the body
    const popup = document.createElement('div');
    popup.className = 'phone-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">&times;</span>
            <h3>Ta kontakt</h3>
            <p>Ring oss på:</p>
            <p class="phone-number">${BOOKING_CONFIG.phoneNumber}</p>
        </div>
    `;
    document.body.appendChild(popup);

    // Function to check if the device is mobile
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Function to show the popup (desktop)
    function showPopup() {
        popup.style.display = 'flex';
        setTimeout(() => {
            popup.querySelector('.popup-content').style.transform = 'translateY(0)';
            popup.querySelector('.popup-content').style.opacity = '1';
        }, 10);
    }

    // Function to hide the popup (desktop)
    function hidePopup() {
        popup.querySelector('.popup-content').style.transform = 'translateY(-20px)';
        popup.querySelector('.popup-content').style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
    // Function to show mobile popup
function showMobilePopup() {
    mobilePopup.style.display = 'flex';
    setTimeout(() => {
        mobilePopup.querySelector('.mobile-popup-content').style.transform = 'translateY(0)';
        mobilePopup.querySelector('.mobile-popup-content').style.opacity = '1';
    }, 10);
}
// Function to hide mobile popup
function hideMobilePopup() {
    mobilePopup.querySelector('.mobile-popup-content').style.transform = 'translateY(-20px)';
    mobilePopup.querySelector('.mobile-popup-content').style.opacity = '0';
    setTimeout(() => {
        mobilePopup.style.display = 'none';
    }, 300);
}
// Add click events for mobile popup
mobilePopup.querySelector('.close-mobile-popup').addEventListener('click', hideMobilePopup);
mobilePopup.addEventListener('click', function(e) {
    if (e.target === mobilePopup) {
        hideMobilePopup();
    }
});
// Add functionality to mobile options
mobilePopup.querySelector('.call-option').addEventListener('click', () => {
    window.location.href = `tel:${BOOKING_CONFIG.phoneNumber}`;
    hideMobilePopup();
});

mobilePopup.querySelector('.message-option').addEventListener('click', () => {
    window.location.href = `sms:${BOOKING_CONFIG.phoneNumber}?body=${encodeURIComponent(BOOKING_CONFIG.defaultMessage)}`;
    hideMobilePopup();
});
    // Add click event to close button
    popup.querySelector('.close-popup').addEventListener('click', hidePopup);

    // Close popup when clicking outside the content
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            hidePopup();
        }
    });

    // Setup booking buttons
function setupBookingButtons() {
    const bookingButtons = document.querySelectorAll(BOOKING_CONFIG.buttonSelector);
    
    bookingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isMobileDevice()) {
                // Show mobile choice popup
                showMobilePopup();
            } else {
                // Show desktop popup
                showDesktopPopup();
            }
        });
    });
}

// Call the booking setup function
setupBookingButtons();

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

// Rest of your existing script.js code below this point
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
const sections = document.querySelectorAll(".section", ".section-about");

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

// Remove .html from URL in browser address bar
if (window.location.pathname.endsWith('.html')) {
    const cleanPath = window.location.pathname.replace('.html', '');
    window.history.replaceState({}, document.title, cleanPath);
  }
  
  // Handle navigation clicks to append .html
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      // Only append .html if it's not already there and not an external link
      const newHref = href.endsWith('.html') || href.startsWith('http') ? href : href + '.html';
      window.location.href = newHref;
    });
  });