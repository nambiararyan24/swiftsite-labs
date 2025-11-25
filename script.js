// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isActive = navLinks.classList.contains('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = !isActive ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside (with delay to avoid immediate close)
        let clickOutsideTimeout;
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                clearTimeout(clickOutsideTimeout);
                clickOutsideTimeout = setTimeout(() => {
                    if (navLinks.classList.contains('active') && 
                        !navLinks.contains(e.target) && 
                        !mobileMenuToggle.contains(e.target)) {
                        navLinks.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }, 10);
            }
        });
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Success Modal Functions
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const modalClose = document.querySelector('.modal-close');
    
    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', hideSuccessModal);
    }
    
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                hideSuccessModal();
            }
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Simple validation
            if (name && email && message) {
                const submitButton = contactForm.querySelector('button[type="submit"]');
                
                if (!submitButton) {
                    alert('Error: Submit button not found. Please refresh the page.');
                    return;
                }
                
                const originalButtonText = submitButton.textContent;
                
                // Disable button and show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                try {
                    // Use Vercel serverless function as proxy
                    const apiURL = '/api/submit-form';
                    
                    const response = await fetch(apiURL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            message: message,
                            timestamp: new Date().toISOString()
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok && result.success) {
                        contactForm.reset();
                        showSuccessModal();
                    } else {
                        throw new Error(result.error || 'Form submission failed');
                    }
                    
                } catch (error) {
                    console.error('Form submission error:', error);
                    alert('Sorry, there was an error sending your message. Please try again later or contact us directly at contact@swiftsitelabs.com');
                } finally {
                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
});

// Observe service cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .about-content, .project-card, .contact-content, .process-step, .faq-item, .review-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Staggered animations for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.08}s`;
    });
    
    // Staggered animations for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Staggered animations for review cards
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Staggered animations for FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.05}s`;
    });
    
    // Staggered animations for process steps
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Cookie Consent Banner
document.addEventListener('DOMContentLoaded', () => {
    const cookieConsent = document.getElementById('cookieConsent');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieReject = document.getElementById('cookieReject');
    const cookieCustomize = document.getElementById('cookieCustomize');

    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice) {
        // Show banner after a short delay for better UX
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 1000);
    }

    // Accept All - Store analytics and marketing cookies
    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookiePreferences', JSON.stringify({
                necessary: true,
                analytics: true,
                marketing: true
            }));
            hideCookieBanner();
        });
    }

    // Reject All - Only necessary cookies
    if (cookieReject) {
        cookieReject.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected');
            localStorage.setItem('cookiePreferences', JSON.stringify({
                necessary: true,
                analytics: false,
                marketing: false
            }));
            hideCookieBanner();
        });
    }

    // Customize - For future implementation, you can add a modal with cookie categories
    if (cookieCustomize) {
        cookieCustomize.addEventListener('click', () => {
            // For now, treat customize as accept all
            // You can implement a detailed cookie preferences modal here
            localStorage.setItem('cookieConsent', 'customized');
            localStorage.setItem('cookiePreferences', JSON.stringify({
                necessary: true,
                analytics: true,
                marketing: false
            }));
            hideCookieBanner();
        });
    }

    function hideCookieBanner() {
        cookieConsent.classList.remove('show');
        setTimeout(() => {
            cookieConsent.style.display = 'none';
        }, 400); // Wait for animation to complete
    }

    // Optional: Initialize analytics based on consent
    if (cookieChoice === 'accepted' || cookieChoice === 'customized') {
        const preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
        if (preferences.analytics) {
            // Initialize analytics here (e.g., Google Analytics)
            // Example: gtag('consent', 'update', { 'analytics_storage': 'granted' });
        }
    }
});

