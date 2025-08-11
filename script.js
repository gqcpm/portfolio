// DOM Elements
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const jobTabs = document.querySelectorAll('.job-tab');
const jobPanels = document.querySelectorAll('.job-panel');
const sections = document.querySelectorAll('.section');

// Mobile Navigation Toggle
function toggleMobileNav() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Animate hamburger lines
    const lines = navToggle.querySelectorAll('.nav-toggle-line');
    if (navToggle.classList.contains('active')) {
        lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        lines[0].style.transform = 'rotate(0) translate(0, 0)';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'rotate(0) translate(0, 0)';
    }
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// Close mobile nav when clicking on a link
function closeMobileNav() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
    
    const lines = navToggle.querySelectorAll('.nav-toggle-line');
    lines[0].style.transform = 'rotate(0) translate(0, 0)';
    lines[1].style.opacity = '1';
    lines[2].style.transform = 'rotate(0) translate(0, 0)';
}

// Smooth scrolling for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 100; // Account for fixed header
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navigation scroll effect
function handleNavScroll() {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

// Experience tabs functionality
function switchTab(targetTab) {
    // Remove active class from all tabs and panels
    jobTabs.forEach(tab => tab.classList.remove('active'));
    jobPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to clicked tab
    targetTab.classList.add('active');
    
    // Show corresponding panel
    const panelId = targetTab.dataset.tab;
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    
    // Update tab indicator position
    const tabIndex = Array.from(jobTabs).indexOf(targetTab);
    const tabsContainer = document.querySelector('.job-tabs');
    const indicator = tabsContainer.querySelector('::before') || 
                     window.getComputedStyle(tabsContainer, '::before');
    
    // Move the indicator
    if (window.innerWidth > 768) {
        tabsContainer.style.setProperty('--tab-index', tabIndex);
    }
}

// Scroll animations with Intersection Observer
function createScrollObserver() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections and major elements
    sections.forEach(section => observer.observe(section));
    
    // Observe other elements that should animate
    const animatedElements = document.querySelectorAll('.project, .project-card, .about-content, .jobs');
    animatedElements.forEach(el => observer.observe(el));
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// Parallax effect for hero section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Typing animation for hero text
function typeWriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid #64ffda';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 500);
        }
    }, 100);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Close mobile nav when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);
                closeMobileNav();
            } else {
                closeMobileNav();
            }
        });
    });
    
    // Experience tabs
    jobTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(tab);
        });
    });
    
    // Scroll effects
    window.addEventListener('scroll', () => {
        handleNavScroll();
        updateActiveNavLink();
        
        // Throttle parallax for performance
        if (window.innerWidth > 768) {
            requestAnimationFrame(handleParallax);
        }
    });
    
    // Initialize scroll observer for animations
    createScrollObserver();
    
    // Initialize typing effect (optional - uncomment if desired)
    // setTimeout(typeWriterEffect, 1000);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Close mobile nav on resize to desktop
        if (window.innerWidth > 768) {
            closeMobileNav();
        }
    });
    
    // Add smooth scroll behavior to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScroll('#projects');
        });
    }
    
    // Add smooth scroll to contact button
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('click', (e) => {
            // Let the default email behavior work
            return true;
        });
    }
});

// CSS for tab indicator animation
const style = document.createElement('style');
style.textContent = `
    .job-tabs {
        --tab-index: 0;
    }
    
    .job-tabs::before {
        transform: translateY(calc(var(--tab-index, 0) * 42px));
    }
    
    @media (max-width: 768px) {
        .job-tabs::before {
            transform: translateX(calc(var(--tab-index, 0) * 120px));
        }
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
    
    /* Initial state for animated elements */
    .section,
    .project,
    .project-card,
    .about-content,
    .jobs {
        opacity: 0;
        transform: translate3d(0, 30px, 0);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    /* Active navigation link styles */
    .nav-link.active {
        color: #64ffda;
    }
    
    /* Enhanced hover effects */
    .project-card {
        transform: translateY(0);
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    
    .project-card:hover {
        transform: translateY(-7px);
        box-shadow: 0 20px 30px -15px rgba(2, 12, 27, 0.7);
    }
    
    /* Mobile nav animation improvements */
    .nav-toggle.active .nav-toggle-line:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active .nav-toggle-line:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active .nav-toggle-line:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;

document.head.appendChild(style);

// Email link functionality (for the side email)
document.addEventListener('DOMContentLoaded', () => {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add a small animation on click
            link.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                link.style.transform = '';
            }, 150);
        });
    });
});

// Add loading animation
window.addEventListener('load', () => {
    // Fade in the page content
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});