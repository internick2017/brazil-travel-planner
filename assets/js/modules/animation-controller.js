/**
 * UI Animation Controller - JavaScript Enhancement
 * Created: June 16, 2025
 * Purpose: Add dynamic animation triggers and enhanced interactivity
 */

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupFormAnimations();
        this.setupButtonEnhancements();
        this.setupLoadingAnimations();
        this.setupSearchAnimations();
        this.setupCardAnimations();
        this.addAnimationClasses();
    }

    /**
     * Setup Intersection Observer for scroll-triggered animations
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.card, .feature-section, .weather-card, .holiday-card').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Add animation classes to existing elements
     */
    addAnimationClasses() {
        // Add sequential animation to navigation
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });

        // Add animation classes to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.add('card-animate-in');
        });

        // Add weather icon animations
        const weatherIcons = document.querySelectorAll('.weather-icon');
        weatherIcons.forEach(icon => {
            icon.classList.add('weather-icon');
        });
    }

    /**
     * Enhanced form animations and feedback
     */
    setupFormAnimations() {
        // Form input focus animations
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.classList.add('animate-scaleIn');
                this.createFocusRipple(e.target);
            });

            input.addEventListener('blur', (e) => {
                e.target.classList.remove('animate-scaleIn');
            });

            // Validation feedback animations
            input.addEventListener('invalid', (e) => {
                e.target.classList.add('animate-shake');
                setTimeout(() => {
                    e.target.classList.remove('animate-shake');
                }, 500);
            });
        });

        // Form submission success animation
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.showSubmissionAnimation(form);
            });
        });
    }

    /**
     * Create focus ripple effect for form inputs
     */
    createFocusRipple(element) {
        const ripple = document.createElement('div');
        ripple.classList.add('focus-ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = rect.width / 2 - size / 2;
        const y = rect.height / 2 - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(0, 123, 255, 0.3);
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Enhanced button interactions
     */
    setupButtonEnhancements() {
        document.querySelectorAll('.btn').forEach(button => {
            // Add ripple effect on click
            button.addEventListener('click', (e) => {
                this.createButtonRipple(e);
            });

            // Add loading state for async operations
            if (button.classList.contains('btn-primary') || button.classList.contains('btn-success')) {
                button.addEventListener('click', (e) => {
                    if (!button.disabled) {
                        this.showButtonLoading(button);
                    }
                });
            }
        });
    }

    /**
     * Create button ripple effect
     */
    createButtonRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Show button loading state
     */
    showButtonLoading(button) {
        const originalText = button.innerHTML;
        const originalWidth = button.offsetWidth;
        
        button.style.width = originalWidth + 'px';
        button.innerHTML = `
            <span class="loading-spinner"></span>
            Loading...
        `;
        button.disabled = true;
        
        // Simulate async operation
        setTimeout(() => {
            button.innerHTML = `
                <i class="fas fa-check success-checkmark"></i>
                Success!
            `;
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.width = '';
            }, 1500);
        }, 2000);
    }

    /**
     * Loading animations for dynamic content
     */
    setupLoadingAnimations() {
        // Replace static loading indicators with animated ones
        document.querySelectorAll('.spinner-border').forEach(spinner => {
            spinner.classList.add('loading-pulse');
        });

        // Add skeleton loading for cards
        this.addSkeletonLoading();
    }

    /**
     * Add skeleton loading animations
     */
    addSkeletonLoading() {
        const weatherPreview = document.getElementById('weatherPreview');
        const holidaysWidget = document.getElementById('holidaysWidget');
        
        [weatherPreview, holidaysWidget].forEach(element => {
            if (element && element.querySelector('.spinner-border')) {
                this.showSkeletonLoading(element);
            }
        });
    }

    /**
     * Show skeleton loading animation
     */
    showSkeletonLoading(container) {
        const skeletonHTML = `
            <div class="skeleton-loading">
                <div class="skeleton" style="height: 60px; width: 100%; margin-bottom: 15px;"></div>
                <div class="skeleton" style="height: 40px; width: 80%; margin-bottom: 10px;"></div>
                <div class="skeleton" style="height: 30px; width: 60%;"></div>
            </div>
        `;
        
        // Show skeleton briefly before content loads
        setTimeout(() => {
            if (container.querySelector('.spinner-border')) {
                container.innerHTML = skeletonHTML;
            }
        }, 500);
    }

    /**
     * Enhanced search animations
     */
    setupSearchAnimations() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('search-focused');
            });
            
            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('search-focused');
            });
            
            // Typing animation
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.length > 0) {
                    searchBtn.classList.add('btn-pulse');
                } else {
                    searchBtn.classList.remove('btn-pulse');
                }
            });
        }
    }

    /**
     * Card interaction animations
     */
    setupCardAnimations() {
        document.querySelectorAll('.card').forEach(card => {
            // Hover animations
            card.addEventListener('mouseenter', () => {
                card.classList.add('hover-lift');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hover-lift');
            });
            
            // Click feedback for mobile
            card.addEventListener('touchstart', () => {
                card.classList.add('card-pressed');
            });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.classList.remove('card-pressed');
                }, 150);
            });
        });
    }

    /**
     * Show form submission animation
     */
    showSubmissionAnimation(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (submitButton) {
            submitButton.classList.add('btn-success');
            submitButton.innerHTML = '<i class="fas fa-check"></i> Submitted!';
            
            setTimeout(() => {
                submitButton.classList.remove('btn-success');
                submitButton.innerHTML = 'Submit';
            }, 2000);
        }
    }

    /**
     * Page transition animations
     */
    initPageTransitions() {
        // Add fade-out animation before page navigation
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.href.includes(window.location.origin)) {
                    e.preventDefault();
                    document.body.classList.add('page-fade-out');
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 300);
                }
            });
        });
    }

    /**
     * Weather widget specific animations
     */
    animateWeatherData() {
        const weatherCards = document.querySelectorAll('.weather-card');
        weatherCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate-slideInLeft');
        });
        
        const weatherIcons = document.querySelectorAll('.weather-icon');
        weatherIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.animation = 'float 1s ease-in-out';
            });
        });
    }

    /**
     * Holiday calendar animations
     */
    animateHolidayCalendar() {
        const holidayCards = document.querySelectorAll('.holiday-card');
        holidayCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            card.classList.add('animate-slideInRight');
        });
        
        // Add special animation for current holidays
        const currentHolidays = document.querySelectorAll('.holiday-current');
        currentHolidays.forEach(holiday => {
            holiday.classList.add('holiday-highlight');
        });
    }

    /**
     * Mobile-specific touch animations
     */
    setupMobileAnimations() {
        if ('ontouchstart' in window) {
            // Add touch feedback for mobile
            document.querySelectorAll('.btn, .card, .nav-link').forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.classList.add('touch-feedback');
                });
                
                element.addEventListener('touchend', () => {
                    setTimeout(() => {
                        element.classList.remove('touch-feedback');
                    }, 150);
                });
            });
        }
    }

    /**
     * Performance optimization for animations
     */
    optimizeAnimations() {
        // Reduce animations on low-performance devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--animation-speed-normal', '0.1s');
            document.documentElement.style.setProperty('--animation-speed-slow', '0.2s');
        }
        
        // Pause animations when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.documentElement.style.setProperty('--animation-speed-normal', '0.01s');
            } else {
                document.documentElement.style.setProperty('--animation-speed-normal', '0.3s');
            }
        });
    }
}

// Add CSS for additional animations
const additionalAnimationCSS = `
/* Additional Animation Styles */
@keyframes rippleAnimation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.search-focused {
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(0, 123, 255, 0.3);
}

.btn-pulse {
    animation: pulse 1s infinite;
}

.card-pressed {
    transform: scale(0.98);
    transition: transform 0.1s ease;
}

.touch-feedback {
    background-color: rgba(0, 0, 0, 0.1);
    transition: background-color 0.1s ease;
}

.page-fade-out {
    opacity: 0;
    transition: opacity 0.3s ease;
}

/* Enhanced loading animations */
.skeleton-loading {
    animation: fadeIn 0.3s ease;
}

.btn-loading {
    pointer-events: none;
    opacity: 0.7;
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
    .search-focused,
    .card-pressed,
    .touch-feedback {
        transition: none;
        transform: none;
        animation: none;
    }
}
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalAnimationCSS;
document.head.appendChild(styleSheet);

// Initialize animation controller when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.animationController = new AnimationController();
    });
} else {
    window.animationController = new AnimationController();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}
