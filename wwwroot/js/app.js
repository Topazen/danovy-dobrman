document.addEventListener('DOMContentLoaded', function () {
    initNavigationMenu();
    initSmoothScroll();
    initServiceCards();
    initParallaxEffect();
    initSlideshow();
    // Pricing period selector is handled by pricing-services.js (initServiceSelector)

    // Single buttons for testimonials, pricing, steps, and services
    initAllReviewsToggle();
    initAllPlansToggle();
    initAllStepsToggle();
    
    // Individual toggles only for FAQ
    initIndividualQuestions();
});

// Navigation Menu functionality
function initNavigationMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu-link');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    
    if (!menuToggle || !navMenu || !menuOverlay) {
        console.debug('Navigation menu elements not found');
        return;
    }
    menuOverlay.addEventListener('click', closeMenu);
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }
    
    
    // Toggle menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking a nav link and scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const targetId = this.getAttribute('href');
            
            // Close menu first
            closeMenu();
            
            // Then scroll to target after a small delay
            setTimeout(() => {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 100; // Account for fixed header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 300);
        });
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    function openMenu() {
        navMenu.classList.add('active');
        menuToggle.classList.add('active');
        menuOverlay.classList.add('active');
        const focusTarget = closeMenuBtn ?? navMenu;
        if (focusTarget && typeof focusTarget.focus === 'function') {
            focusTarget.focus();
        }
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
}

// Slideshow functionality
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dogSlides = document.querySelectorAll('.dog-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0 || dots.length === 0) {
        console.debug('Slideshow: No slides or dots found');
        return;
    }
    
    let currentSlide = 0;
    let isTransitioning = false;
    let autoPlayInterval = null;
    
    function startAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        autoPlayInterval = setInterval(nextSlide, 3000);
    }
    
    function showSlide(n, immediate = false) {
        if (isTransitioning && !immediate) return;
        
        const nextSlide = n;
        
        if (immediate) {
            // Immediate switch (for initialization)
            slides.forEach(slide => slide.classList.remove('active'));
            dogSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => {
                dot.classList.remove('active');
                dot.classList.remove('stretching');
            });
            slides[nextSlide].classList.add('active');
            if (dogSlides.length > nextSlide) {
                dogSlides[nextSlide].classList.add('active');
            }
            dots[nextSlide].classList.add('active');
            return;
        }
        
        if (currentSlide === nextSlide) return;
        
        isTransitioning = true;
        const currentDot = dots[currentSlide];
        
        // Add stretching effect to current dot
        currentDot.classList.add('stretching');
        
        // After stretch animation, switch slides
        setTimeout(() => {
            // Remove active and stretching from all
            slides.forEach(slide => slide.classList.remove('active'));
            dogSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => {
                dot.classList.remove('active');
                dot.classList.remove('stretching');
            });
            
            // Add active to new slide and dot
            slides[nextSlide].classList.add('active');
            if (dogSlides.length > nextSlide) {
                dogSlides[nextSlide].classList.add('active');
            }
            dots[nextSlide].classList.add('active');
            
            // Update current slide
            currentSlide = nextSlide;
            
            setTimeout(() => {
                isTransitioning = false;
            }, 100);
        }, 300);
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Initialize first slide
    showSlide(0, true);
    
    // Start auto advance every 10 seconds
    startAutoPlay();
    
    // Manual navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isTransitioning && currentSlide !== index) {
                showSlide(index);
                // Restart autoplay timer after manual click
                startAutoPlay();
            }
        });
    });
    
    console.debug('Slideshow initialized with', slides.length, 'slides');
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            // Only handle same-page anchors
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            
            e.preventDefault();
            console.debug('Smooth scroll to:', href);
            
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                console.debug('Scrolling to position:', top);
                window.scrollTo({ top, behavior: 'smooth' });
            } else {
                console.warn('Target not found:', href);
            }
        });
    });
    console.debug('initSmoothScroll: initialized for', document.querySelectorAll('a[href^="#"]').length, 'links');
}

// TESTIMONIALS - Single toggle for all reviews
function initAllReviewsToggle() {
    const toggleBtn = document.getElementById('toggle-all-reviews');
    if (!toggleBtn) return;
    
    const reviewBoxes = [
        document.getElementById('review-1'),
        document.getElementById('review-2'),
        document.getElementById('review-3')
    ];
    
    const showText = toggleBtn.querySelector('.toggle-text-show');
    const hideText = toggleBtn.querySelector('.toggle-text-hide');
    const chevron = toggleBtn.querySelector('.toggle-chevron');
    
    let isExpanded = false;
    
    toggleBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        
        reviewBoxes.forEach(box => {
            if (box) {
                if (isExpanded) {
                    box.classList.add('active');
                } else {
                    box.classList.remove('active');
                }
            }
        });
        
        if (isExpanded) {
            showText.style.display = 'none';
            hideText.style.display = 'inline';
            chevron.style.transform = 'rotate(180deg)';
        } else {
            showText.style.display = 'inline';
            hideText.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
        }
    });
    
    console.debug('initAllReviewsToggle: initialized');
}

// PRICING PLANS - Single toggle for all plans
function initAllPlansToggle() {
    const toggleBtn = document.getElementById('toggle-all-plans');
    if (!toggleBtn) return;
    
    const planBoxes = [
        document.getElementById('plan-1'),
        document.getElementById('plan-2'),
        document.getElementById('plan-3')
    ];
    
    const showText = toggleBtn.querySelector('.toggle-text-show');
    const hideText = toggleBtn.querySelector('.toggle-text-hide');
    const chevron = toggleBtn.querySelector('.toggle-chevron');
    
    let isExpanded = false;
    
    toggleBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        
        planBoxes.forEach(box => {
            if (box) {
                if (isExpanded) {
                    box.classList.add('active');
                } else {
                    box.classList.remove('active');
                }
            }
        });
        
        if (isExpanded) {
            showText.style.display = 'none';
            hideText.style.display = 'inline';
            chevron.style.transform = 'rotate(180deg)';
        } else {
            showText.style.display = 'inline';
            hideText.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
        }
    });
    
    console.debug('initAllPlansToggle: initialized');
}

// FAQ - Individual toggles for each question
function initIndividualQuestions() {
    const questions = [
        { box: document.getElementById('question-1'), btn: document.querySelector('[data-toggle="question-1"]') },
        { box: document.getElementById('question-2'), btn: document.querySelector('[data-toggle="question-2"]') },
        { box: document.getElementById('question-3'), btn: document.querySelector('[data-toggle="question-3"]') },
        { box: document.getElementById('question-4'), btn: document.querySelector('[data-toggle="question-4"]') },
        { box: document.getElementById('question-5'), btn: document.querySelector('[data-toggle="question-5"]') }
    ];
    
    questions.forEach(({ box, btn }) => {
        if (box && btn) {
            btn.addEventListener('click', () => {
                box.classList.toggle('active');
                // Rotate the plus icon
                const svg = btn.querySelector('svg');
                if (svg) {
                    svg.style.transform = box.classList.contains('active') ? 'rotate(45deg)' : 'rotate(0deg)';
                }
            });
        }
    });
    
    console.debug('initIndividualQuestions: initialized');
}

// INDIVIDUAL REVIEWS - Toggle for each review separately
function initIndividualReviews() {
    const reviewButtons = document.querySelectorAll('.review-expand-btn');
    
    reviewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const reviewId = this.getAttribute('data-review');
            const reviewBox = document.getElementById(reviewId);
            
            if (reviewBox) {
                reviewBox.classList.toggle('active');
            }
        });
    });
    
    console.debug('initIndividualReviews: initialized for', reviewButtons.length, 'buttons');
}

// INDIVIDUAL PLANS - Toggle for each plan separately
function initIndividualPlans() {
    const planButtons = document.querySelectorAll('.plan-expand-btn');
    
    planButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const planId = this.getAttribute('data-plan');
            const planBox = document.getElementById(planId);
            
            if (planBox) {
                planBox.classList.toggle('active');
            }
        });
    });
    
    console.debug('initIndividualPlans: initialized for', planButtons.length, 'buttons');
}

// TIMELINE STEPS - Single toggle for all steps
function initAllStepsToggle() {
    const toggleBtn = document.getElementById('toggle-all-steps');
    if (!toggleBtn) return;
    
    const stepBoxes = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3'),
        document.getElementById('step-4')
    ];
    
    const showText = toggleBtn.querySelector('.toggle-text-show');
    const hideText = toggleBtn.querySelector('.toggle-text-hide');
    const chevron = toggleBtn.querySelector('.toggle-chevron');
    
    let isExpanded = false;
    
    toggleBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        
        stepBoxes.forEach(box => {
            if (box) {
                if (isExpanded) {
                    box.classList.add('active');
                } else {
                    box.classList.remove('active');
                }
            }
        });
        
        if (isExpanded) {
            showText.style.display = 'none';
            hideText.style.display = 'inline';
            chevron.style.transform = 'rotate(180deg)';
        } else {
            showText.style.display = 'inline';
            hideText.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
        }
    });
    
    console.debug('initAllStepsToggle: initialized');
}

// SERVICES - Single toggle for all services (old version, kept for compatibility)
function initAllServicesToggle() {
    const toggleBtn = document.getElementById('toggle-all-services');
    if (!toggleBtn) return;
    
    const serviceCards = document.querySelectorAll('.service-card');
    
    const showText = toggleBtn.querySelector('.toggle-text-show');
    const hideText = toggleBtn.querySelector('.toggle-text-hide');
    const chevron = toggleBtn.querySelector('.toggle-chevron');
    
    let isExpanded = false;
    
    toggleBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        
        serviceCards.forEach(card => {
            if (card) {
                if (isExpanded) {
                    card.classList.add('expanded');
                } else {
                    card.classList.remove('expanded');
                }
            }
        });
        
        if (isExpanded) {
            showText.style.display = 'none';
            hideText.style.display = 'inline';
            chevron.style.transform = 'rotate(180deg)';
        } else {
            showText.style.display = 'inline';
            hideText.style.display = 'none';
            chevron.style.transform = 'rotate(0deg)';
        }
    });
    
    console.debug('initAllServicesToggle: initialized');
}

// INDIVIDUAL STEPS - Removed (now using toggle all only)
function initIndividualSteps() {
    // Deprecated - now using single toggle button for all steps
    console.debug('initIndividualSteps: deprecated, using single toggle button');
}


function initServiceCards() {
    // Service cards are now controlled by the toggle-all-services button
    // No individual expand buttons needed
    console.debug('initServiceCards: service cards use toggle-all button');
}

// ============================================
// Parallax Effect (only on hero section)
// ============================================
function initParallaxEffect() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Parallax for hero section
                const parallaxElements = document.querySelectorAll('.hero');
                parallaxElements.forEach(el => {
                    const speed = 0.5;
                    el.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                // Parallax for background layers
                const beforeLayer = document.body;
                if (beforeLayer) {
                    // Move the background layers at different speeds for depth
                    const beforeSpeed = scrolled * 0.15;
                    const afterSpeed = scrolled * 0.25;
                    
                    beforeLayer.style.setProperty('--parallax-before', `translateY(${beforeSpeed}px)`);
                    beforeLayer.style.setProperty('--parallax-after', `translateY(${afterSpeed}px)`);
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    console.debug('Parallax effect initialized');
}

// Pricing Period Selector
function initPricingPeriodSelector() {
    const periodButtons = document.querySelectorAll('.period-btn');
    
    if (periodButtons.length === 0) {
        console.debug('No pricing period buttons found');
        return;
    }
    
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            periodButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            console.debug('Selected pricing period:', period);
            
            // Here you can add logic to update pricing based on selected period
            // For example, multiply prices or show different price sets
            updatePricingDisplay(period);
        });
    });
    
    console.debug('Pricing period selector initialized with', periodButtons.length, 'buttons');
}

function updatePricingDisplay(period) {
    // Get all pricing cards with base prices
    const pricingPlans = document.querySelectorAll('[data-base-price]');
    
    pricingPlans.forEach(plan => {
        const basePrice = parseInt(plan.getAttribute('data-base-price'));
        const priceDisplay = plan.querySelector('[data-price-display]');
        
        if (!priceDisplay) return;
        
        // For Enterprise plan (base price 0), always show "individuální cena"
        if (basePrice === 0) {
            priceDisplay.textContent = 'individuální cena';
            return;
        }
        
        let displayPrice;
        let periodText;
        
        switch(period) {
            case 'month':
                displayPrice = basePrice;
                periodText = 'měsíc';
                break;
            case 'quarter':
                // 3 months with 5% discount
                displayPrice = Math.round(basePrice * 3 * 0.95);
                periodText = '3 měsíce';
                break;
            case 'year':
                // 12 months with 10% discount
                displayPrice = Math.round(basePrice * 12 * 0.90);
                periodText = 'rok';
                break;
            default:
                displayPrice = basePrice;
                periodText = 'měsíc';
        }
        
        // Format the price with thousand separator
        const formattedPrice = displayPrice.toLocaleString('cs-CZ');
        priceDisplay.textContent = `od ${formattedPrice} Kč/${periodText}`;
    });
    
    console.debug('Updated pricing display for period:', period);
}
// Pricing Scroll Function
function scrollPricing(direction) {
    const container = document.getElementById('pricingGrid');
    if (!container) return;
    
    const scrollAmount = 320; // Approx card width + gap
    const currentScroll = container.scrollLeft;
    
    if (direction === 'left') {
        container.scrollTo({
            left: currentScroll - scrollAmount,
            behavior: 'smooth'
        });
    } else {
        container.scrollTo({
            left: currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    }
}
window.scrollPricing = scrollPricing;

