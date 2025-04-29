// Global variables for slides and gallery
let slideIndex = 0;
let slides;
let slideInterval;
let currentImages = [];
let fullscreenIndex = 0;

// Main function that drives when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addScrollArrowStyles(); // Add the scroll arrow styles
    initializeServiceCardScrolling();

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
    initializeOpeningHours();
});

function addScrollArrowStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
    .scroll-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 10;
    font-size: 20px;
    font-weight: bold;
    transition: opacity 0.3s ease;
    }
    
    .scroll-left {
    left: 10px;
    }
    
    .scroll-right {
    right: 10px;
    }

    .services-grid {
    position: relative;
    scroll-behavior: smooth;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    overflow-x: auto;
    }

    .services-grid::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
    }
    `;
    document.head.appendChild(styleSheet);
}

// Slideshow-functionality
function initializeSlideshow() { // starts a slide show with fade effects
    slides = document.querySelectorAll(".slide");
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
        clearInterval(slideInterval); // stop auto-slideshoww with manual navigation
        slides.forEach((slide) => slide.classList.remove("active")); // hide all slides
        slideIndex = (slideIndex + n + slides.length) % slides.length;
        slides[slideIndex].classList.add("active"); // show next slide
        slideInterval = setInterv>al(showSlides, 5000); // start auto-slideshow again
    }

    // make the function available gloval for buttons
    window.changeSlide = changeSlide;

    // start slideshow 
    slides[slideIndex].classList.add("active"); // show first slide
    slideInterval = setInterval(showSlides, 5000); // picture changes every 5 seconds
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

    // function that lets the user change fullscreen-pictures with buttons
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

    // attach click-events to slideshow-images (separate selection)
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

    // close fullscreen by clicking outside of the picture
    fullscreenOverlay.addEventListener("click", (e) => {
        if (e.target === fullscreenOverlay) closeFullscreen();
    });
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

document.addEventListener('DOMContentLoaded', function() {
    // centralized BOOKING configuration
    const BOOKING_CONFIG = {
        phoneNumber: '+4740498499',
        defaultMessage: 'Hei Jeg vil gjerne bestille en time for .. (ex: utvendig og innvendig vask).',
        buttonSelector: '.book-appointment-btn'
    };

    // Function to check if the device is mobile
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent);
    }

    // create desktop popup
    const popup = document.createElement('div');
    popup.className = 'phone-popup';
    popup.innerHTML = `
    <div class ="popup-content">
        <span class="close-popup">&times;</span>
        <h3>En ren bil er bare ett telefonsamtale unna!</h3>
        <p>Ring oss eller send en SMS, så finner vi et tidspunkt som passer deg:📞</p>
        <p class="phone-number">${BOOKING_CONFIG.phoneNumber}</p>
    </div>
    `;
    document.body.appendChild(popup);

    // create mobile popup
    const mobilePopup = document.createElement('div');
    mobilePopup.className = 'mobile-choice-popup';
    mobilePopup.innerHTML = `
    <div class="mobile-popup-content">
    <span class="close-mobile-popup">x</span>
    <h3>Ring meg eller send en melding med ønsket tidspunkt - jeg svarer deg så snart jeg kan! 😊</h3>
    <button class="call-option">Ring nå</button>
    <button class="message-option">Send melding</button>
    </div>
    `;
    document.body.appendChild(mobilePopup);

    // show desktop popup
    function showPopup() {
        popup.style.display = 'flex';
        setTimeout(() => {
            popup.querySelector('.popup-content').style.transform = 'translateY(0)';
            popup.querySelector('.popup-content').style.opacity = '1';
        }, 10);
    }

    // Hide desktop popup
    function hidePopup() {
        popup.querySelector('.popup-content').style.transform = 'translateY(-20px)';
        popup.querySelector('.popup-content').style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }

    // show mobile popup
    function showMobilePopup() {
        mobilePopup.style.display = 'flex';
        setTimeout(() => {
            mobilePopup.querySelector('.mobile-popup-content').style.transform = 'translateY(0)';
            mobilePopup.querySelector('.mobile-popup-content').style.opacity = '1';
        }, 10);
    }

    // hide mobile popup
    function hideMobilePopup() {
        mobilePopup.querySelector('.mobile-popup-content').style.transform = 'translateY(-20px)';
        mobilePopup.querySelector('.mobile-popup-content').style.opacity = '0';
        setTimeout(() => {
           mobilePopup.style.display = 'none'; 
        }, 300);
    }

    // setup booking buttons for all buttons with the specified class
    function setupBookingButtons() {
        const bookingButtons = document.querySelectorAll(BOOKING_CONFIG.buttonSelector);

        bookingButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                if (isMobileDevice()) {
                    showMobilePopup();
                } else {
                    showPopup();
                }
            });
        });
    }

    // mobile popup event listeners
    mobilePopup.querySelector('.close-mobile-popup').addEventListener('click', hideMobilePopup);
    mobilePopup.addEventListener('click', function(e) {
        if (e.target === mobilePopup) {
            hideMobilePopup();
        }
    });

    // Mobilr option button events
    mobilePopup.querySelector('.call-option').addEventListener('click', () => {
        window.location.href =`tel:${BOOKING_CONFIG.phoneNumber}`;
        hideMobilePopup();
    });

    mobilePopup.querySelector('.message-option').addEventListener('click', () => {
        window.location.href = `sms:${BOOKING_CONFIG.phoneNumber}?body=${encodeURIComponent(BOOKING_CONFIG.defaultMessage)}`;
        hideMobilePopup()
    });

    // Desktop popup event listeners
    popup.querySelector('.close-popup').addEventListener('click', hidePopup);
    popup.addEventListener('click', function(e) {
        if(e.target === popup) {
            hidePopup();
        }
    });
    
    // call setup function
    setupBookingButtons();

});


function initializeQuoteRotation() {
    // find the paragrap more carefully
    const p = document.querySelector('.hero .hero-content p');

    // if no paragraph is found, exit the function
    if(!p) {
        console.log('Quote rotation paragraph not found');
        return;
    }

    // Define quotes
    const quotes = [
        "Skinnende bil, hver gang!",
        "Den ultimate bilpleieopplevelsen",
        "Bilen din fortjener det beste",
        "Gi bilen din den behandlingen den fortjener"
    ];
    let currentQuoteIndex = 0;

    // Rotation function
    function updateQuote() {
        p.style.opacity = '0';
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            p.textContent = quotes[currentQuoteIndex];
            p.style.opacity = '1';
        }, 1000);
    }

    // set iniital quote
    p.textContent = quotes[currentQuoteIndex];
    p.style.opacity = '1';

    // start rotation
    setInterval(updateQuote, 5000);
}

// handles scroll effects
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

// function for sections on the website to be animated when they come into view (screen)
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

// initialize servicecards
function initializeServiceCards() {
    var serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(function(card) {
        // Change mouse cursor to pointer on hover to indicate that the card is clickable
        card.style.cursor = 'pointer';

        // User gets sent to a new web-page when the user clicks
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


function initializeNavigation() {
    
}

function initializeServiceCardScrolling() {
    const serviceGrids = document.querySelectorAll('.services-grid');

    serviceGrids.forEach(grid => {
        if(!grid) return; // skip if no grid found

        // create navigation arrows for this specifically
        const leftArrow = document.createElement('div');
        leftArrow.className = 'scroll-arrow scroll-left';
        leftArrow.innerHTML = '&lt;';

        const rightArrow = document.createElement('div');
        rightArrow.className = 'scroll-arrow scroll-right';
        rightArrow.innerHTML = '&gt;';

        // add arrows to the parent section (not the grid itself)
        const parentSection = grid.closest('.section');
        if(parentSection) {
            parentSection.style.position = 'relative'; // make sure parent is positioned
            parentSection.appendChild(leftArrow);
            parentSection.appendChild(rightArrow);
        }

        // function to determine card width for scrolling amount
        function getCardWidth() {
            const firstCard = grid.querySelector('.service-card');
            if(!firstCard) return 300; // default witdh if no card found

            const cardStyle = window.getComputedStyle(firstCard);
            return firstCard.offsetWidth + parseInt(cardStyle.marginRight, 10);
        }

        // update arrow visibility based on scroll position
        function updateArrowVisibility() {
            // only show left arrow if we're not at the start
            leftArrow.style.opacity = grid.scrollLeft > 10 ? '0.8' : '0.3';

            // only show right arrow if we're not at the end
            const isAtEnd = Math.abs(grid.scrollLeft + grid.clientWidth - grid.scrollWidth) < 10;
            rightArrow.style.opacity = isAtEnd ? '0.3' : '0.8';
        }

        // scroll handlers for arrows
        leftArrow.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            grid.scrollBy({ left: -cardWidth, behavior: 'smooth'});
        });

        rightArrow.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            grid.scrollBy({ left: cardWidth, behavior: 'smooth'});
        });

        // initialize arrow visibility and listen for changes
        grid.addEventListener('scroll', updateArrowVisibility);
        window.addEventListener('resize', updateArrowVisibility);

        // initial check
        setTimeout(updateArrowVisibility, 100);
    });
}

  document.addEventListener('DOMContentLoaded', function () {
    const statusElement = document.getElementById('open-status');
    if (!statusElement) return; // If the element doesn't exist, do nothing
  
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
  
    const isWeekend = (day === 0 || day === 6); // Sunday or Saturday
    const isWeekday = (day >= 1 && day <= 5);
    const isOpenNow = isWeekday && hour >= 8 && hour < 16;
  
    if (isOpenNow) {
        statusElement.textContent = '🟢 Åpent nå – vi har åpent til kl. 16:00';
        statusElement.style.color = 'green';
    } else if (isWeekend) {
        statusElement.textContent = '🔴 Stengt – vi åpner igjen mandag kl. 08:00';
        statusElement.style.color = 'red';
    } else {
        statusElement.textContent = '🔴 Stengt – vi åpner i morgen kl. 08:00';
        statusElement.style.color = 'red';
    }
    // Always show weekend closure notice
  const weekendNote = document.getElementById('weekend-note');
  if (weekendNote) {
      weekendNote.textContent = '🚫 Vi har stengt på lørdager og søndager.';
  }
});