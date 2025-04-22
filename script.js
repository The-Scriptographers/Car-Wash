// Global variables for slides and gallery
let slideIndex = 0;
let slides;
let slideInterval;
let currentImages = [];
let fullscreenIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
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

    // Firebase-dependent review system (only for index.html)
    initializeFirebaseAndReviews();
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

    window.changeSlide = function(n) {
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

// Firebase and Advanced Reviews (from first version)
function initializeFirebaseAndReviews() {
    // Only run if review-related elements exist (specific to index.html)
    if (!document.getElementById('sign-in-form') && !document.getElementById('reviews-data')) {
        console.log('No review elements found. Skipping Firebase.');
        return;
    }

    if (typeof firebase === 'undefined') {
        console.log('Firebase SDK not loaded. Skipping reviews.');
        return;
    }

    const firebaseConfig = {
        apiKey: "AIzaSyAC9egaN5uRkl64eftsMrcW8riKrpLVN5A",
        authDomain: "ulfsbilpleie-5b706.firebaseapp.com",
        databaseURL: "https://ulfsbilpleie-5b706-default-rtdb.firebaseio.com",
        projectId: "ulfsbilpleie-5b706",
        storageBucket: "ulfsbilpleie-5b706.firebasestorage.app",
        messagingSenderId: "175974074415",
        appId: "1:175974074415:web:b2da1ea0aecce48caa9eda"
    };

    try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized');
    } catch (error) {
        console.error('Firebase init error:', error);
        return;
    }

    const auth = firebase.auth();
    const db = firebase.database();

    const signInForm = document.getElementById('sign-in-form');
    if (signInForm) {
        const usernameInput = document.getElementById('username');
        const signedInDiv = document.getElementById('signed-in');
        const userEmailSpan = document.getElementById('user-email');
        const signInBtn = document.getElementById('sign-in-btn');
        const signUpBtn = document.getElementById('sign-up-btn');
        const signOutBtn = document.getElementById('sign-out-btn');
        const deleteAccountBtn = document.getElementById('delete-account-btn');
        const reviewFormContainer = document.getElementById('review-form-container');
        const submitReviewBtn = document.getElementById('submit-review-btn');
        const reviewsData = document.getElementById('reviews-data');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const reviewTitle = document.getElementById('review-title');
        const reviewRating = document.getElementById('review-rating');
        const reviewComment = document.getElementById('review-comment');

        // Fetch reviews immediately, even before login
        fetchReviews(null); // Start with no user logged in

        // Handle authentication state changes
        auth.onAuthStateChanged((user) => {
            if (user) {
                signInForm.style.display = 'none';
                signedInDiv.style.display = 'block';
                reviewFormContainer.style.display = 'block';
                userEmailSpan.textContent = user.email;

                db.ref('users/' + user.uid).once('value')
                    .then((snapshot) => {
                        const userUsernameSpan = document.getElementById('user-username');
                        userUsernameSpan.textContent = snapshot.exists() && snapshot.val().username ? snapshot.val().username : "Ukjent bruker";
                    })
                    .catch((error) => {
                        console.error('Error fetching username:', error);
                        document.getElementById('user-username').textContent = "Ukjent bruker";
                    });

                fetchReviews(user); // Refresh reviews with user logged in (to show delete buttons)
            } else {
                signInForm.style.display = 'block';
                signedInDiv.style.display = 'none';
                reviewFormContainer.style.display = 'none';
                // No need to clear reviewsData here; reviews stay visible
            }
        });

        signInBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const password = passwordInput.value;
            const username = usernameInput.value;
            if (email && password) {
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        if (username) {
                            db.ref('users/' + userCredential.user.uid).update({
                                username: username,
                                email: email
                            });
                        }
                    })
                    .catch((error) => alert('Feil ved innlogging: ' + error.message));
            } else {
                alert('Vennligst fyll ut både e-post og passord.');
            }
        });

        signUpBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const password = passwordInput.value;
            const username = usernameInput.value;
            if (email && password && username) {
                auth.createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        db.ref('users/' + userCredential.user.uid).set({
                            username: username,
                            email: email
                        });
                    })
                    .catch((error) => alert('Feil ved registrering: ' + error.message));
            } else {
                alert('Vennligst fyll ut både e-post, brukernavn og passord.');
            }
        });

        signOutBtn.addEventListener('click', () => {
            auth.signOut().catch((error) => alert('Feil ved utlogging: ' + error.message));
        });

        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('Er du sikker på at du vil slette kontoen din?')) {
                auth.currentUser.delete().catch((error) => alert('Feil ved sletting: ' + error.message));
            }
        });

        submitReviewBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            if (!user) {
                alert('Du må logge inn for å skrive en anmeldelse!');
                return;
            }

            const title = reviewTitle.value;
            const rating = reviewRating.value;
            const comment = reviewComment.value;

            if (title && rating && comment) {
                db.ref('users/' + user.uid).once('value')
                    .then((snapshot) => {
                        const username = snapshot.exists() && snapshot.val().username ? snapshot.val().username : "Ukjent bruker";
                        const reviewRef = db.ref('reviews').push();
                        return reviewRef.set({
                            title,
                            rating,
                            comment,
                            userId: user.uid,
                            userEmail: user.email,
                            username: username,
                            timestamp: Date.now()
                        });
                    })
                    .then(() => {
                        reviewTitle.value = '';
                        reviewRating.value = '';
                        reviewComment.value = '';
                    })
                    .catch((error) => alert('Feil ved innsending: ' + error.message));
            } else {
                alert('Fyll ut alle felt!');
            }
        });

        // Fetch and display reviews, with optional user for delete buttons
        function fetchReviews(user) {
            const reviewsRef = db.ref('reviews');
            reviewsRef.on('value', (snapshot) => {
                reviewsData.innerHTML = '';
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const review = childSnapshot.val();
                        const reviewKey = childSnapshot.key;
                        const reviewItem = document.createElement('div');
                        reviewItem.classList.add('review-item');
                        const displayName = review.username || "Ukjent bruker";
                        // Show delete button only if user is logged in and owns the review
                        const deleteButton = (user && review.userId === user.uid) 
                            ? `<button class="delete-review-btn" data-key="${reviewKey}">X</button>` 
                            : '';
                        reviewItem.innerHTML = `
                            <h4>${review.title} (${review.rating}★)</h4>
                            <p><strong>Av:</strong> ${displayName} <br> ${review.userEmail}</p>
                            <p>${review.comment}</p>
                            ${deleteButton}
                        `;
                        reviewsData.appendChild(reviewItem);
                    });

                    // Add delete button functionality only if user is logged in
                    if (user) {
                        document.querySelectorAll('.delete-review-btn').forEach((btn) => {
                            btn.addEventListener('click', () => {
                                const reviewKey = btn.getAttribute('data-key');
                                if (confirm('Er du sikker på at du vil slette denne anmeldelsen?')) {
                                    db.ref(`reviews/${reviewKey}`).remove();
                                }
                            });
                        });
                    }
                } else {
                    reviewsData.innerHTML = '<p>Ingen anmeldelser ennå.</p>';
                }
            }, (error) => console.error('Error fetching reviews:', error));
        }
    }
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
        button.addEventListener('click', function(e) {
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
    if(section) {
        section.scrollIntoView({ behavior: 'smooth'});
    }
}


// function for price calculator on tjenester page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the tjenester.html page
    if (window.location.pathname.includes('tjenester.html') || window.location.pathname.endsWith('/tjenester')) {
        // Insert the price list
        const navbar = document.querySelector('.navbar');
        
        // Create the price list container
        const priceListContainer = document.createElement('section');
        priceListContainer.id = 'price-list-container';
        priceListContainer.innerHTML = `
            <h3>Valgte Tjenester <small>(klikk for å fjerne)</small></h3>
            <ul id="selected-services-list"></ul>
            <div class="total-section">
                <strong>Veiledende Pris: <span id="total-price">0</span> NOK</strong>
            </div>
        `;
        
        // Insert after the navbar
        navbar.insertAdjacentElement('afterend', priceListContainer);
        
        // Select all service cards after the DOM is fully loaded. Did not work when selecting before CSS.
        const serviceCards = document.querySelectorAll('.service-card');
        const selectedServicesList = document.getElementById('selected-services-list');
        const totalPriceElement = document.getElementById('total-price');
        
        // Create a price tracking object and card map
        const selectedServices = {};
        const cardMap = new Map(); // map service name to card element
        
        // Add some styling to make list items look clickable
        const style = document.createElement('style');
        style.textContent = `
            #selected-services-list li {
                display: flex;
                justify-content: space-between;
                padding: 8px;
                margin: 5px 0;
                background-color: #f5f5f5;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            #selected-services-list li:hover {
                background-color: #f0f0f0;
            }
            #selected-services-list li > span:first-child::before {
                content: "⊖ ";
                color: #D81E05;
                font-size: 1.5em;
            }
        `;
        document.head.appendChild(style);
        
        // Extract price from text 
        function extractPrice(priceText) {
            // Look for numbers in the string
            const matches = priceText.match(/\d[\d\s]*(?=\s*NOK)/);
            if (matches) {
                // Remove all non-digit characters and convert to number
                return parseInt(matches[0].replace(/\D/g, ''), 10);
            }
            return 0;
        }
        
        // Update the total price
        function updateTotalPrice() {
            const totalPrice = Object.values(selectedServices).reduce((sum, price) => sum + price, 0);
            totalPriceElement.textContent = totalPrice;
        }
        
        // Function to toggle service selection
        function toggleService(serviceName) {
            const card = cardMap.get(serviceName);
            if (!card) return;
            
            // Toggle the card's selected state
            card.classList.toggle('selected');
            
            if (card.classList.contains('selected')) {
                // This should never happen when clicking a list item
                // (since the service is already selected), but keeping for completeness
                const priceElements = card.querySelectorAll('p');
                let price = 0;
                
                // Find the price text in the last paragraph
                for (let i = priceElements.length - 1; i >= 0; i--) {
                    const text = priceElements[i].textContent;
                    if (text.includes('NOK') || text.includes('Pris')) {
                        price = extractPrice(text);
                        break;
                    }
                }
                
                // Add to selected services
                selectedServices[serviceName] = price;
                
                // Create a list item for the selected service
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span>${serviceName}</span><span>${price} NOK</span>`;
                listItem.dataset.service = serviceName;
                selectedServicesList.appendChild(listItem);
            } else {
                // Remove from selected services
                delete selectedServices[serviceName];
                
                // Remove list item
                const listItem = selectedServicesList.querySelector(`li[data-service="${serviceName}"]`);
                if (listItem) {
                    listItem.remove();
                }
            }
            
            // Update total price
            updateTotalPrice();
        }
        
        // Add click event to each service card
        serviceCards.forEach(card => {
            const serviceName = card.querySelector('h3').textContent.trim();
            cardMap.set(serviceName, card); // Store reference to the card
            
            card.addEventListener('click', function(e) {
                // Prevent default behavior
                e.preventDefault();
                toggleService(serviceName);
            });
        });
        
        // Add click event to the selected services list (event delegation)
        selectedServicesList.addEventListener('click', function(e) {
            const listItem = e.target.closest('li[data-service]');
            if (listItem) {
                const serviceName = listItem.dataset.service;
                toggleService(serviceName);
            }
        });
    }
});


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