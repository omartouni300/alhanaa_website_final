/**
 * AL HANAA Website - Enhanced JavaScript
 * Optimized for performance, accessibility, and cross-browser compatibility
 */

(function() {
    'use strict';

    // Feature detection and polyfills
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const supportsPassiveEvents = checkPassiveEventSupport();
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // DOM elements cache
    const elements = {
        navbar: null,
        btnTop: null,
        counters: [],
        animatedElements: [],
        carousel: null
    };

    // Performance optimizations
    let ticking = false;
    let lastScrollY = 0;

    /**
     * Check if passive event listeners are supported
     */
    function checkPassiveEventSupport() {
        let passiveSupported = false;
        try {
            const options = {
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch (err) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    /**
     * Debounce function for performance
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Initialize DOM elements cache
     */
    function cacheElements() {
        elements.navbar = document.getElementById('navbar');
        elements.btnTop = document.getElementById('btn-top');
        elements.counters = document.querySelectorAll('[data-target]');
        elements.animatedElements = document.querySelectorAll('.text-fade-in, .image-fade-in');
        elements.carousel = document.getElementById('carouselExampleIndicators');
    }

    /**
     * Navbar scroll behavior
     */
    function handleNavbarScroll() {
        if (!elements.navbar) return;

        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY > 50) {
            elements.navbar.classList.remove('transparent-navbar');
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.add('transparent-navbar');
            elements.navbar.classList.remove('scrolled');
        }

        // Show/hide back to top button
        if (elements.btnTop) {
            if (currentScrollY > 300) {
                elements.btnTop.classList.add('show');
                elements.btnTop.style.opacity = '1';
                elements.btnTop.style.right = '20px';
            } else {
                elements.btnTop.classList.remove('show');
                elements.btnTop.style.opacity = '0';
                elements.btnTop.style.right = '-50px';
            }
        }

        lastScrollY = currentScrollY;
    }

    /**
     * Smooth scroll to target
     */
    function smoothScrollTo(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80; // Account for fixed navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    /**
     * Counter animation
     */
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        function updateCounter() {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        updateCounter();
    }

    /**
     * Intersection Observer for animations
     */
    function initIntersectionObserver() {
        if (!supportsIntersectionObserver) {
            // Fallback for browsers without Intersection Observer
            elements.animatedElements.forEach(el => {
                el.classList.add('visible');
            });
            elements.counters.forEach(counter => {
                animateCounter(counter);
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    if (element.classList.contains('text-fade-in') || element.classList.contains('image-fade-in')) {
                        if (!isReducedMotion) {
                            element.classList.add('visible');
                        } else {
                            element.style.opacity = '1';
                            element.style.transform = 'none';
                        }
                    }
                    
                    if (element.hasAttribute('data-target') && !element.classList.contains('counted')) {
                        element.classList.add('counted');
                        if (!isReducedMotion) {
                            setTimeout(() => animateCounter(element), 200);
                        } else {
                            element.textContent = element.getAttribute('data-target');
                        }
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe animated elements
        elements.animatedElements.forEach(el => observer.observe(el));
        elements.counters.forEach(counter => observer.observe(counter));
    }

    /**
     * Handle keyboard navigation
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Skip to main content with Tab
            if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
                const skipLink = document.querySelector('.sr-only-focusable');
                if (skipLink) {
                    skipLink.focus();
                }
            }

            // Close mobile menu with Escape
            if (e.key === 'Escape') {
                const navbarCollapse = document.querySelector('.navbar-collapse.show');
                if (navbarCollapse) {
                    const toggleButton = document.querySelector('.navbar-toggler');
                    if (toggleButton) {
                        toggleButton.click();
                    }
                }
            }
        });
    }

    /**
     * Handle touch events for mobile
     */
    function initTouchEvents() {
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', function(e) {
            touchStartY = e.changedTouches[0].screenY;
        }, supportsPassiveEvents ? { passive: true } : false);

        document.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, supportsPassiveEvents ? { passive: true } : false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe up - could trigger some action
                } else {
                    // Swipe down - could trigger some action
                }
            }
        }
    }

    /**
     * Optimize images loading
     */
    function initImageOptimization() {
        // Add loading="lazy" to images that don't have it
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (img.getBoundingClientRect().top > window.innerHeight) {
                img.setAttribute('loading', 'lazy');
            }
        });

        // Handle image load errors
        document.addEventListener('error', function(e) {
            if (e.target.tagName === 'IMG') {
                e.target.style.display = 'none';
                console.warn('Image failed to load:', e.target.src);
            }
        }, true);
    }

    /**
     * Handle form submissions
     */
    function initFormHandling() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Sending...';
                    
                    // Re-enable after 3 seconds (adjust based on your needs)
                    setTimeout(() => {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                    }, 3000);
                }
            });
        });
    }

    /**
     * Handle carousel accessibility
     */
    function initCarouselAccessibility() {
        if (!elements.carousel) return;

        // Pause carousel on focus/hover for accessibility
        elements.carousel.addEventListener('mouseenter', function() {
            if (window.bootstrap && window.bootstrap.Carousel) {
                const carousel = window.bootstrap.Carousel.getInstance(elements.carousel);
                if (carousel) carousel.pause();
            }
        });

        elements.carousel.addEventListener('mouseleave', function() {
            if (window.bootstrap && window.bootstrap.Carousel) {
                const carousel = window.bootstrap.Carousel.getInstance(elements.carousel);
                if (carousel) carousel.cycle();
            }
        });

        // Pause on focus for keyboard users
        const carouselItems = elements.carousel.querySelectorAll('.carousel-item');
        carouselItems.forEach(item => {
            item.addEventListener('focusin', function() {
                if (window.bootstrap && window.bootstrap.Carousel) {
                    const carousel = window.bootstrap.Carousel.getInstance(elements.carousel);
                    if (carousel) carousel.pause();
                }
            });
        });
    }

    /**
     * Handle product slider
     */
    function initProductSlider() {
        const slider = document.getElementById('slider');
        if (!slider) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        let touchStartX = 0;
        let touchScrollLeft = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].pageX - slider.offsetLeft;
            touchScrollLeft = slider.scrollLeft;
        }, supportsPassiveEvents ? { passive: true } : false);

        slider.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - slider.offsetLeft;
            const walk = (x - touchStartX) * 2;
            slider.scrollLeft = touchScrollLeft - walk;
        }, supportsPassiveEvents ? { passive: true } : false);
    }

    /**
     * Handle external links
     */
    function initExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
        externalLinks.forEach(link => {
            if (!link.hasAttribute('target')) {
                link.setAttribute('target', '_blank');
            }
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    /**
     * Performance monitoring
     */
    function initPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                        console.log('DOM content loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
                    }
                }, 0);
            });
        }
    }

    /**
     * Initialize all functionality
     */
    function init() {
        // Cache DOM elements
        cacheElements();

        // Initialize features
        initIntersectionObserver();
        initKeyboardNavigation();
        initTouchEvents();
        initImageOptimization();
        initFormHandling();
        initCarouselAccessibility();
        initProductSlider();
        initExternalLinks();
        initPerformanceMonitoring();

        // Event listeners
        const throttledScrollHandler = throttle(handleNavbarScroll, 16);
        window.addEventListener('scroll', throttledScrollHandler, supportsPassiveEvents ? { passive: true } : false);

        // Handle smooth scrolling for anchor links
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a[href^="#"]');
            if (target && target.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = target.getAttribute('href');
                smoothScrollTo(targetId);
            }
        });

        // Handle window resize
        const debouncedResizeHandler = debounce(function() {
            // Recalculate any size-dependent features
            if (elements.navbar) {
                handleNavbarScroll();
            }
        }, 250);
        
        window.addEventListener('resize', debouncedResizeHandler);

        // Handle visibility change (for performance)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Pause any animations or timers when page is hidden
            } else {
                // Resume when page becomes visible
            }
        });

        console.log('AL HANAA Website initialized successfully');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose some functions globally for debugging
    window.ALHanaa = {
        smoothScrollTo: smoothScrollTo,
        animateCounter: animateCounter,
        version: '2.0.0'
    };

})();

