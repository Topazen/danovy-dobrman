document.addEventListener('DOMContentLoaded', function () {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.animate-on-scroll, section h2, .service-card-modern, .pricing-card, .step-box-1, .step-box-2, .step-box-3, .step-box-4, .review-box-1, .review-box-2, .review-box-3');

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
});
