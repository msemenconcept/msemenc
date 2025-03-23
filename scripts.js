// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('fade');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });
    
    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('open');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('open');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Scroll to top button functionality
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to navigation based on scroll position
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const currentLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                if (currentLink) {
                    currentLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink(); // Set initial active link
    
    // Create nav indicator (for desktop)
    const nav = document.querySelector('.nav-menu');
    
    if (window.innerWidth >= 992) {
        const indicator = document.createElement('div');
        indicator.className = 'nav-indicator';
        nav.appendChild(indicator);
        
        function positionIndicator(el) {
            if (!el) return;
            
            const indicatorWidth = el.offsetWidth;
            const offsetLeft = el.offsetLeft;
            
            indicator.style.width = `${indicatorWidth}px`;
            indicator.style.left = `${offsetLeft}px`;
        }
        
        // Position indicator on hover
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                positionIndicator(this);
            });
        });
        
        // Return indicator to active link when mouse leaves nav
        nav.addEventListener('mouseleave', function() {
            const activeLink = nav.querySelector('a.active') || navLinks[0];
            positionIndicator(activeLink);
        });
        
        // Set initial position
        const activeLink = nav.querySelector('a.active') || navLinks[0];
        positionIndicator(activeLink);
        
        // Update on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 992) {
                const activeLink = nav.querySelector('a.active') || navLinks[0];
                positionIndicator(activeLink);
            }
        });
    }
    
    // Animated counter function for statistics
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16); // 16ms is approx one frame at 60fps
        
        const updateCounter = () => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                return;
            }
            
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    }
    
    // Initialize counters
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        
        ScrollTrigger.create({
            trigger: counter,
            start: "top 80%",
            once: true,
            onEnter: () => animateCounter(counter, target, 2000)
        });
    });
    
    // GSAP Animations
    
    // Hero section elements animation
    const heroTimeline = gsap.timeline();
    
    heroTimeline
        .from('.hero-logo-circle', { 
            opacity: 0, 
            y: -50, 
            duration: 1,
            ease: "back.out(1.7)"
        })
        .from('.hero h1', { 
            opacity: 0, 
            y: 50, 
            duration: 1,
            ease: "power3.out"
        }, "-=0.5")
        .from('.hero p', { 
            opacity: 0, 
            y: 30, 
            duration: 1,
            ease: "power2.out"
        }, "-=0.7")
        .from('.hero-buttons .btn', { 
            opacity: 0, 
            y: 20, 
            stagger: 0.2,
            duration: 0.8,
            ease: "power1.out"
        }, "-=0.5");
    
    // Animate section headers on scroll
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            scrollTrigger: {
                trigger: header,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        });
    });
    
    // About section animations
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-container',
            start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
    
    gsap.from('.about-img', {
        scrollTrigger: {
            trigger: '.about-container',
            start: "top 70%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power2.out"
    });
    
    // Feature items staggered animation
    gsap.from('.feature', {
        scrollTrigger: {
            trigger: '.about-features',
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power1.out"
    });
    
    // Specialty items staggered animation
    gsap.from('.specialty-item', {
        scrollTrigger: {
            trigger: '.specialties-grid',
            start: "top 70%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.2)"
    });
    
    // Process steps animation
    gsap.from('.process-step', {
        scrollTrigger: {
            trigger: '.process-steps',
            start: "top 70%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.2)"
    });
    
    // Statistics items animation
    gsap.from('.statistic-item', {
        scrollTrigger: {
            trigger: '.statistics-grid',
            start: "top 70%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.2)"
    });
    
    // CTA section animation
    gsap.from('.cta-container > *', {
        scrollTrigger: {
            trigger: '.cta',
            start: "top 70%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
    });
    
    // Contact items animation
    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-details',
            start: "top 80%",
        },
        x: -30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power1.out"
    });
    
    // Social links animation
    gsap.from('.social-link', {
        scrollTrigger: {
            trigger: '.social-links',
            start: "top 90%",
        },
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "back.out(1.7)"
    });
    
    // Footer animation
    gsap.from('.footer-container > div', {
        scrollTrigger: {
            trigger: 'footer',
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
    });
    
    // Add hover effects for specialty items
    const specialtyItems = document.querySelectorAll('.specialty-item');
    
    specialtyItems.forEach(item => {
        // Create hover effect
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -15,
                boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(item.querySelector('.specialty-img'), {
                scale: 1.1,
                duration: 0.5,
                ease: "power1.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                duration: 0.3,
                ease: "power2.out"
            });
            
            gsap.to(item.querySelector('.specialty-img'), {
                scale: 1,
                duration: 0.5,
                ease: "power1.out"
            });
        });
    });
    
    // Parallax effect for hero section
    gsap.to('.hero', {
        backgroundPositionY: '20%',
        ease: "none",
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
    
    // Subtle movement to hero elements on mouse move
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        document.addEventListener('mousemove', function(e) {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            gsap.to(heroContent, {
                x: moveX,
                y: moveY,
                duration: 1,
                ease: "power2.out"
            });
        });
    }
    
    // ANIMATION FIX: Ensure all elements become visible after a delay
    function ensureVisibility() {
        // Select all elements that should be animated
        const animatedElements = document.querySelectorAll('.about-features, .specialty-item, .process-step, .contact-item, .statistic-item');
        
        // Make them visible if they're still hidden after 2 seconds
        setTimeout(() => {
            animatedElements.forEach(element => {
                if (window.getComputedStyle(element).opacity === '0' || window.getComputedStyle(element).opacity < 0.1) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        }, 2000);
    }
    
    // Run the failsafe
    ensureVisibility();
});