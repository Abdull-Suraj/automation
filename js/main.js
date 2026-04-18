/* ============================================
   Zynapse AI — Main JavaScript
   Navbar, animations, and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // === Island Navbar Scroll Effect ===
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // === Mobile Menu Toggle ===
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // === Scroll Animations (Intersection Observer) ===
    const animatedElements = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, parseInt(delay, 10));
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all elements immediately
        animatedElements.forEach(el => el.classList.add('animate-in'));
    }

    // === Smooth Scroll for Anchor Links ===
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
            }
        });
    });

    // === Form Submission Handler ===
    const ctaForm = document.getElementById('ctaForm');
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = ctaForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="spin">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-dashoffset="10" stroke-linecap="round"/>
                </svg>
                Sending...
            `;
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '✓ Message Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    ctaForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // === Animated Counter for Stats ===
    const statNumbers = document.querySelectorAll('.stat-number');

    if ('IntersectionObserver' in window && statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(element) {
        const text = element.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[1], 10);
        const suffix = text.replace(/\d+/, '');
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // === Add spin animation for loading state ===
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
});
