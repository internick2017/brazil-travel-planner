/**
 * Enhanced Animation Controller - June 18, 2025 Update
 * Modern UI animations and interactions
 */

class EnhancedAnimationController {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupPageLoadAnimations();
        this.setupScrollAnimations();
        this.setupNavigationAnimations();
        this.setupInteractiveAnimations();
        this.setupFormAnimations();
        console.log('🎨 Enhanced Animation Controller initialized');
    }

    setupPageLoadAnimations() {
        // Add page loader class to body
        document.body.classList.add('page-loader');
        
        // Stagger animation for cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupScrollAnimations() {
        if (this.isReducedMotion) return;
        
        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        const animateOnScroll = document.querySelectorAll('.card, .alert, .btn-group');
        animateOnScroll.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            scrollObserver.observe(el);
        });
    }

    setupNavigationAnimations() {
        // Add hover effects to nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (!link.classList.contains('active')) {
                link.addEventListener('mouseenter', this.navLinkHover);
                link.addEventListener('mouseleave', this.navLinkLeave);
            }
        });

        // Mobile menu animations
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', this.toggleMobileMenu);
        }
    }

    setupInteractiveAnimations() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            if (!btn.classList.contains('no-ripple')) {
                btn.classList.add('ripple');
                btn.addEventListener('click', this.createRipple);
            }
        });

        // Add hover effects to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (!card.classList.contains('no-hover')) {
                card.classList.add('card-hover-effect');
            }
        });

        // Add loading states to forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', this.showFormLoading);
        });
    }

    setupFormAnimations() {
        // Enhanced form input animations
        const inputs = document.querySelectorAll('.form-control, .form-select');
        inputs.forEach(input => {
            input.addEventListener('focus', this.inputFocus);
            input.addEventListener('blur', this.inputBlur);
            input.addEventListener('invalid', this.inputError);
        });
    }

    // Event handlers
    navLinkHover(e) {
        e.target.style.transform = 'translateY(-2px)';
    }

    navLinkLeave(e) {
        e.target.style.transform = 'translateY(0)';
    }

    toggleMobileMenu(e) {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar) {
            navbar.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
    }

    createRipple(e) {
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
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    showFormLoading(e) {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading-spinner spinner-border spinner-border-sm me-2"></span>Loading...';
            submitBtn.disabled = true;

            // Re-enable after 3 seconds (adjust based on actual form processing time)
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    }

    inputFocus(e) {
        e.target.parentElement.style.transform = 'scale(1.02)';
    }

    inputBlur(e) {
        e.target.parentElement.style.transform = 'scale(1)';
    }

    inputError(e) {
        e.target.classList.add('shake');
        setTimeout(() => {
            e.target.classList.remove('shake');
        }, 600);
    }

    // Utility methods
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification-enter position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('notification-enter');
            notification.classList.add('notification-exit');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    animateCounter(element, start, end, duration = 1000) {
        if (this.isReducedMotion) {
            element.textContent = end;
            return;
        }

        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.floor(start + (end - start) * progress);
            element.textContent = value;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        
        if (this.isReducedMotion) {
            window.scrollTo(0, targetPosition);
            return;
        }

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize enhanced animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new EnhancedAnimationController();
});

// CSS for ripple animation
const rippleCSS = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Export for use in other modules
window.EnhancedAnimationController = EnhancedAnimationController;
