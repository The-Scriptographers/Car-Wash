// Global variables
let slideIndex = 0;
let slides;
let slideInterval;
let currentImages = [];
let fullscreenIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');

    // Initialize all features
    initializeSlideshow();
    initializeGallery();
    initializeAnimations();
    initializeScrollEffects();
    initializeNavigation();
    initializeServiceCards();
    initializeBookingButtons();
    initializeQuoteRotation();
    initializeTestimonials();
    initializeMobileScrollHints();
    initializeOpenStatus();
    initializeOmMegPage();
    initializePricePopup();
});

// Slideshow functionality
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

// Gallery functionality
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

// Animations
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

// Scroll effects
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
            if (window.scrollY > 300) backToTop.style.display = "block";
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
    const triggerBottom = window.innerHeight * 0.85;

    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add("visible");
        }
    });
}

// Service cards - NO navigation behavior on tjenester page
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    const isServicesPage = window.location.pathname.includes('tjenester') || 
                          window.location.pathname.endsWith('/tjenester.html');

    if (!isServicesPage) {
        serviceCards.forEach((card) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = 'tjenester.html';
            });
        });
    }
}

// Navigation
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Close mobile menu when clicking a link
    if (navToggle && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navbar = document.querySelector('.navbar');
        const navToggleLabel = document.querySelector('.nav-toggle-label');
        
        if (navToggle && navToggle.checked && 
            !navbar.contains(e.target) && 
            !navToggleLabel.contains(e.target)) {
            navToggle.checked = false;
        }
    });
}

// Booking buttons
function initializeBookingButtons() {
    const BOOKING_CONFIG = {
        phoneNumber: '+4740498499',
        defaultMessage: 'Hei! Jeg vil gjerne bestille en time for bilpleie.',
        buttonSelector: '.book-appointment-btn'
    };

    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    const popup = document.createElement('div');
    popup.className = 'phone-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">×</span>
            <h3>📞 Ring eller send SMS!</h3>
            <p>Ta kontakt med oss for å bestille time:</p>
            <p class="phone-number">${BOOKING_CONFIG.phoneNumber}</p>
            <p style="font-size: 0.9rem; color: #b8c4d4; margin-top: 1rem;">
                Vi svarer deg så snart vi kan! 😊
            </p>
        </div>`;
    document.body.appendChild(popup);

    const mobilePopup = document.createElement('div');
    mobilePopup.className = 'mobile-choice-popup';
    mobilePopup.innerHTML = `
        <div class="mobile-popup-content">
            <span class="close-mobile-popup">×</span>
            <h3>📞 Velg hvordan du vil kontakte oss:</h3>
            <button class="call-option">Ring nå</button>
            <button class="message-option">Send melding</button>
        </div>`;
    document.body.appendChild(mobilePopup);

    function showPopup() {
        popup.style.display = 'flex';
    }

    function hidePopup() {
        popup.style.display = 'none';
    }

    function showMobilePopup() {
        mobilePopup.style.display = 'flex';
    }

    function hideMobilePopup() {
        mobilePopup.style.display = 'none';
    }

    const bookingButtons = document.querySelectorAll(BOOKING_CONFIG.buttonSelector);
    bookingButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            if (isMobileDevice()) {
                showMobilePopup();
            } else {
                showPopup();
            }
        });
    });

    // Mobile popup handlers
    const closeMobile = mobilePopup.querySelector('.close-mobile-popup');
    if (closeMobile) {
        closeMobile.addEventListener('click', hideMobilePopup);
    }

    mobilePopup.addEventListener('click', (e) => {
        if (e.target === mobilePopup) hideMobilePopup();
    });

    const callOption = mobilePopup.querySelector('.call-option');
    if (callOption) {
        callOption.addEventListener('click', () => {
            window.location.href = `tel:${BOOKING_CONFIG.phoneNumber}`;
            hideMobilePopup();
        });
    }

    const messageOption = mobilePopup.querySelector('.message-option');
    if (messageOption) {
        messageOption.addEventListener('click', () => {
            window.location.href = `sms:${BOOKING_CONFIG.phoneNumber}?body=${encodeURIComponent(BOOKING_CONFIG.defaultMessage)}`;
            hideMobilePopup();
        });
    }

    // Desktop popup handlers
    const closePopup = popup.querySelector('.close-popup');
    if (closePopup) {
        closePopup.addEventListener('click', hidePopup);
    }

    popup.addEventListener('click', (e) => {
        if (e.target === popup) hidePopup();
    });
}

// Quote rotation
function initializeQuoteRotation() {
    const p = document.querySelector('.hero .hero-content p');
    if (!p) return;

    const quotes = [
        "Skinnende bil, hver gang!",
        "Den ultimate bilpleieopplevelsen",
        "Bilen din fortjener det beste",
        "Profesjonell bilpleie i Holmestrand"
    ];
    let currentQuoteIndex = 0;

    function updateQuote() {
        p.style.opacity = '0';
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            p.textContent = quotes[currentQuoteIndex];
            p.style.opacity = '1';
        }, 500);
    }

    p.textContent = quotes[currentQuoteIndex];
    p.style.opacity = '1';
    setInterval(updateQuote, 5000);
}

// Testimonials
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

// Mobile scroll hints for service cards
function initializeMobileScrollHints() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    // Add touch-friendly scrolling behavior
    let isDown = false;
    let startX;
    let scrollLeft;

    servicesGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        servicesGrid.style.cursor = 'grabbing';
        startX = e.pageX - servicesGrid.offsetLeft;
        scrollLeft = servicesGrid.scrollLeft;
    });

    servicesGrid.addEventListener('mouseleave', () => {
        isDown = false;
        servicesGrid.style.cursor = 'grab';
    });

    servicesGrid.addEventListener('mouseup', () => {
        isDown = false;
        servicesGrid.style.cursor = 'grab';
    });

    servicesGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - servicesGrid.offsetLeft;
        const walk = (x - startX) * 2;
        servicesGrid.scrollLeft = scrollLeft - walk;
    });

    // Smooth scroll snap on mobile
    if (window.innerWidth <= 768) {
        servicesGrid.style.cursor = 'default';
    }
}

// Open status indicator
function initializeOpenStatus() {
    const statusElement = document.getElementById('open-status');
    const weekendNote = document.getElementById('weekend-note');
    
    if (!statusElement) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 5 = Friday
    const hour = now.getHours();

    const isWeekend = (day === 0 || day === 6);
    const isWeekday = (day >= 1 && day <= 5);
    const isOpenNow = isWeekday && hour >= 8 && hour < 16;

    if (isOpenNow) {
        statusElement.textContent = '🟢 Åpent nå – vi har åpent til kl. 16:00';
        statusElement.style.color = '#28a745';
        statusElement.style.background = 'rgba(40, 167, 69, 0.1)';
    } else if (day === 5 && hour >= 16) {
        statusElement.textContent = '🔴 Stengt – vi åpner igjen mandag kl. 08:00';
        statusElement.style.color = '#dc3545';
        statusElement.style.background = 'rgba(220, 53, 69, 0.1)';
    } else if (isWeekend) {
        statusElement.textContent = '🔴 Stengt – vi åpner igjen mandag kl. 08:00';
        statusElement.style.color = '#dc3545';
        statusElement.style.background = 'rgba(220, 53, 69, 0.1)';
    } else {
        statusElement.textContent = '🔴 Stengt – vi åpner i morgen kl. 08:00';
        statusElement.style.color = '#dc3545';
        statusElement.style.background = 'rgba(220, 53, 69, 0.1)';
    }

    if (weekendNote) {
        weekendNote.textContent = '🚫 Vi har stengt på lørdager og søndager.';
        weekendNote.style.color = '#666';
    }
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Om Meg page animations
function initializeOmMegPage() {
    if (!document.querySelector('.om-page')) return;

    // Scroll-reveal observer for [data-animate] elements
    const animated = document.querySelectorAll('.om-page [data-animate]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => entry.target.classList.add('om-visible'), delay);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    animated.forEach(el => revealObserver.observe(el));

    // Profile card: animate in shortly after page load
    const profileCard = document.querySelector('.om-profile-card');
    if (profileCard) {
        setTimeout(() => profileCard.classList.add('om-visible'), 120);
    }

    // Animated counter for years badge
    const counter = document.querySelector('.om-count');
    if (counter) {
        const target = parseInt(counter.dataset.count);

        const startCount = () => {
            const duration = 1600;
            const stepTime = Math.floor(duration / target);
            let current = 0;
            const timer = setInterval(() => {
                current++;
                counter.textContent = current;
                if (current >= target) clearInterval(timer);
            }, stepTime);
        };

        const counterObserver = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            setTimeout(startCount, 600);
            counterObserver.unobserve(counter);
        }, { threshold: 0.3 });
        counterObserver.observe(counter);
    }
}

// Price info popup (tjenester page)
function initializePricePopup() {
    const overlay = document.getElementById('pricePopup');
    const closeBtn = document.getElementById('pricePopupClose');
    if (!overlay || !closeBtn) return;

    setTimeout(() => overlay.classList.add('visible'), 600);

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.style.display = 'none', 350);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.style.display = 'none', 350);
        }
    });
}

// Prevent horizontal scroll issues
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflowX = 'hidden';
});