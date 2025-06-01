// Global variables for slides and gallery
let slideIndex = 0;
let slides;
let slideInterval;
let currentImages = [];
let fullscreenIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    // Non-Firebase features (run on all pages)
    initializeSlideshow();
    initializeGallery();
    initializeAnimations();
    initializeScrollEffects();
    initializeNavigation();
    initializeServiceCards();
    initializeBookingButtons();
    initializeQuoteRotation();
    initializeTestimonials();
   

});



// Slideshow functionality (from main branch, with fixes)
function initializeSlideshow() {
    slides = document.querySelectorAll(".slide");
    if (!slides || slides.length === 0) {
        console.log("No slides found");
        return;
    }

    slideIndex = 0;
    slides[slideIndex].classList.add("active");
    slideInterval = setInterval(showSlides, 5000);

    function showSlides() {
        slides.forEach((slide) => slide.classList.remove("active"));
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add("active");
    }

    window.changeSlide = function (n) {
        clearInterval(slideInterval);
        slides.forEach((slide) => slide.classList.remove("active"));
        slideIndex = (slideIndex + n + slides.length) % slides.length;
        slides[slideIndex].classList.add("active");
        slideInterval = setInterval(showSlides, 5000);
    };
}

// Gallery functionality (from main branch)
function initializeGallery() {
    const fullscreenOverlay = document.getElementById("fullscreenOverlay");
    if (!fullscreenOverlay) {
        console.log("Fullscreen overlay not found");
        return;
    }

    let slides = document.querySelectorAll(".slide img");
    let galleryImages = document.querySelectorAll(".gallery-img");
    let fullscreenImage = document.getElementById("fullscreenImage");
    let prevBtn = document.getElementById("prevFullscreen");
    let nextBtn = document.getElementById("nextFullscreen");
    let body = document.body;

    function openFullscreen(imgSrc, images) {
        currentImages = [...images];
        fullscreenIndex = currentImages.findIndex((img) => img.src === imgSrc);
        fullscreenImage.src = imgSrc;
        fullscreenOverlay.style.display = "flex";
        body.style.overflow = "hidden";
    }

    function changeFullscreenImage(n) {
        fullscreenIndex = (fullscreenIndex + n + currentImages.length) % currentImages.length;
        fullscreenImage.src = currentImages[fullscreenIndex].src;
    }

    function closeFullscreen() {
        fullscreenOverlay.style.display = "none";
        body.style.overflow = "auto";
    }

    window.openFullscreen = openFullscreen;
    window.changeFullscreenImage = changeFullscreenImage;
    window.closeFullscreen = closeFullscreen;

    if (slides.length > 0) {
        slides.forEach((img) => {
            img.addEventListener("click", () => openFullscreen(img.src, slides));
        });
    }

    if (galleryImages.length > 0) {
        galleryImages.forEach((img) => {
            img.addEventListener("click", () => openFullscreen(img.src, galleryImages));
        });
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener("click", () => changeFullscreenImage(-1));
        nextBtn.addEventListener("click", () => changeFullscreenImage(1));
    }

    fullscreenOverlay.addEventListener("click", (e) => {
        if (e.target === fullscreenOverlay) closeFullscreen();
    });
}


// Other functions (from main branch, unchanged)
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
    animateOnScroll();
}

function initializeScrollEffects() {
    const nav = document.querySelector("nav");
    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) nav.classList.add("scrolled");
            else nav.classList.remove("scrolled");
        });
    }

    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 200) backToTop.style.display = "block";
            else backToTop.style.display = "none";
        });
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    window.addEventListener("scroll", animateOnScroll);

    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        function checkAnimation() {
            const rect = contactInfo.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.8) contactInfo.classList.add('show');
        }
        window.addEventListener('scroll', checkAnimation);
        window.addEventListener('load', checkAnimation);
    }
}

function animateOnScroll() {
    const sections = document.querySelectorAll(".section, .section-about, .container, .slideshow-container, .gallery-container");
    if (!sections.length) return;
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

// MODIFIED: Only add navigation to service cards if we're not on the services page
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    // Only add navigation behavior if we're NOT on the services page
    if (!window.location.pathname.includes('tjenester.html') && !window.location.pathname.endsWith('/tjenester')) {
        serviceCards.forEach((card) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => window.location.href = 'tjenester.html');
        });
    }
}

function initializeNavigation() {
    // Add navigation-specific logic if needed
}

function initializeBookingButtons() {
    const BOOKING_CONFIG = {
        phoneNumber: '+4740498499',
        defaultMessage: 'Hei Jeg vil gjerne bestille en time for .. (ex: utvendig og innvendig vask).',
        buttonSelector: '.book-appointment-btn'
    };

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent);
    }

    const popup = document.createElement('div');
    popup.className = 'phone-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">×</span>
            <h3>En ren bil er bare ett telefonsamtale unna!</h3>
            <p>Ring oss eller send en SMS, så finner vi et tidspunkt som passer deg:📞</p>
            <p class="phone-number">${BOOKING_CONFIG.phoneNumber}</p>
        </div>`;
    document.body.appendChild(popup);

    const mobilePopup = document.createElement('div');
    mobilePopup.className = 'mobile-choice-popup';
    mobilePopup.innerHTML = `
        <div class="mobile-popup-content">
            <span class="close-mobile-popup">x</span>
            <h3>Ring meg eller send en melding med ønsket tidspunkt - jeg svarer deg så snart jeg kan! 😊</h3>
            <button class="call-option">Ring nå</button>
            <button class="message-option">Send melding</button>
        </div>`;
    document.body.appendChild(mobilePopup);

    function showPopup() {
        popup.style.display = 'flex';
        setTimeout(() => {
            popup.querySelector('.popup-content').style.transform = 'translateY(0)';
            popup.querySelector('.popup-content').style.opacity = '1';
        }, 10);
    }

    function hidePopup() {
        popup.querySelector('.popup-content').style.transform = 'translateY(-20px)';
        popup.querySelector('.popup-content').style.opacity = '0';
        setTimeout(() => popup.style.display = 'none', 300);
    }

    function showMobilePopup() {
        mobilePopup.style.display = 'flex';
        setTimeout(() => {
            mobilePopup.querySelector('.mobile-popup-content').style.transform = 'translateY(0)';
            mobilePopup.querySelector('.mobile-popup-content').style.opacity = '1';
        }, 10);
    }

    function hideMobilePopup() {
        mobilePopup.querySelector('.mobile-popup-content').style.transform = 'translateY(-20px)';
        mobilePopup.querySelector('.mobile-popup-content').style.opacity = '0';
        setTimeout(() => mobilePopup.style.display = 'none', 300);
    }

    const bookingButtons = document.querySelectorAll(BOOKING_CONFIG.buttonSelector);
    bookingButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (isMobileDevice()) showMobilePopup();
            else showPopup();
        });
    });

    mobilePopup.querySelector('.close-mobile-popup').addEventListener('click', hideMobilePopup);
    mobilePopup.addEventListener('click', (e) => {
        if (e.target === mobilePopup) hideMobilePopup();
    });
    mobilePopup.querySelector('.call-option').addEventListener('click', () => {
        window.location.href = `tel:${BOOKING_CONFIG.phoneNumber}`;
        hideMobilePopup();
    });
    mobilePopup.querySelector('.message-option').addEventListener('click', () => {
        window.location.href = `sms:${BOOKING_CONFIG.phoneNumber}?body=${encodeURIComponent(BOOKING_CONFIG.defaultMessage)}`;
        hideMobilePopup();
    });
    popup.querySelector('.close-popup').addEventListener('click', hidePopup);
    popup.addEventListener('click', (e) => {
        if (e.target === popup) hidePopup();
    });
}

function initializeQuoteRotation() {
    const p = document.querySelector('.hero .hero-content p');
    if (!p) return;

    const quotes = [
        "Skinnende bil, hver gang!",
        "Den ultimate bilpleieopplevelsen",
        "Bilen din fortjener det beste",
        "Gi bilen din den behandlingen den fortjener"
    ];
    let currentQuoteIndex = 0;

    function updateQuote() {
        p.style.opacity = '0';
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            p.textContent = quotes[currentQuoteIndex];
            p.style.opacity = '1';
        }, 1000);
    }

    p.textContent = quotes[currentQuoteIndex];
    p.style.opacity = '1';
    setInterval(updateQuote, 5000);
}

function initializeTestimonials() {
    const testimonials = document.querySelectorAll(".testimonial-card");
    if (testimonials.length === 0) return;

    let currentTestimonial = 0;
    const totalTestimonials = testimonials.length;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? "block" : "none";
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }

    setInterval(nextTestimonial, 9000);
    showTestimonial(currentTestimonial);
}

// function for scrolling evenly to a section after ID
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
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
    } else if (day === 5 && hour >= 17) {
        statusElement.textContent = '🔴 Stengt – vi åpner igjen fra mandag kl. 08:00'
        statusElement.style.color = 'red';
    }
    else if (isWeekend) {
        statusElement.textContent = '🔴 Stengt – vi åpner igjen fra mandag kl. 08:00';
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