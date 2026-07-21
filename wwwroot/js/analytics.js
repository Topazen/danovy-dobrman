// ============================================
// Enhanced Analytics & Tracking
// ============================================

// Track form submissions
function trackFormSubmit(formName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'engagement',
            'event_label': formName,
            'value': 1
        });
    }
}

// Track button clicks
function trackButtonClick(buttonName, buttonLocation) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'button_click', {
            'event_category': 'engagement',
            'event_label': buttonName,
            'button_location': buttonLocation
        });
    }
}

// Track phone clicks
document.addEventListener('DOMContentLoaded', function() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    'event_category': 'conversion',
                    'event_label': this.getAttribute('href'),
                    'value': 10
                });
            }
        });
    });
    
    // Track email clicks
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    'event_category': 'conversion',
                    'event_label': this.getAttribute('href'),
                    'value': 5
                });
            }
        });
    });
    
    // Track scroll depth
    let scrollTracked = {
        '25': false,
        '50': false,
        '75': false,
        '100': false
    };
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        
        for (let depth in scrollTracked) {
            if (!scrollTracked[depth] && scrollPercent >= parseInt(depth)) {
                scrollTracked[depth] = true;
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': depth + '%',
                        'value': parseInt(depth)
                    });
                }
            }
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds
        if (typeof gtag !== 'undefined' && timeSpent > 5) {
            gtag('event', 'time_on_page', {
                'event_category': 'engagement',
                'event_label': 'seconds',
                'value': timeSpent
            });
        }
    });
    
    // Track expandable section clicks
    const toggleButtons = document.querySelectorAll('[id^="toggle-all-"]');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.id.replace('toggle-all-', '');
            if (typeof gtag !== 'undefined') {
                gtag('event', 'section_expand', {
                    'event_category': 'engagement',
                    'event_label': section,
                    'value': 1
                });
            }
        });
    });
});

// Performance monitoring
if ('performance' in window && 'PerformanceObserver' in window) {
    // Track page load time
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'event_category': 'performance',
                    'event_label': 'milliseconds',
                    'value': pageLoadTime
                });
            }
            
            console.log('Page load time:', pageLoadTime + 'ms');
        }, 0);
    });
    
    // Track Core Web Vitals
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.renderTime || entry.loadTime);
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vitals', {
                            'event_category': 'performance',
                            'event_label': 'LCP',
                            'value': Math.round(entry.renderTime || entry.loadTime)
                        });
                    }
                }
            }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
        console.log('Performance Observer not supported');
    }
}

// Export tracking functions for use in other scripts
window.trackFormSubmit = trackFormSubmit;
window.trackButtonClick = trackButtonClick;

console.log('✅ Analytics tracking initialized');
