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

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name && email && message) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            try {
                // Google Apps Script Web App URL
                const scriptURL = 'https://script.google.com/macros/s/AKfycbxQHUlHAjOO-wshNxqayvPX-Q3rnPRv-b_7cfJYDB0c11az6PbUoGCJ6aKXX4X16HoZ/exec';
                
                // Create a unique iframe name to avoid conflicts
                const iframeName = 'hidden_iframe_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                
                // Create and append hidden iframe BEFORE creating the form
                const iframe = document.createElement('iframe');
                iframe.name = iframeName;
                iframe.id = iframeName;
                iframe.style.position = 'fixed';
                iframe.style.top = '-10000px';
                iframe.style.left = '-10000px';
                iframe.style.width = '1px';
                iframe.style.height = '1px';
                iframe.style.border = 'none';
                iframe.style.opacity = '0';
                iframe.style.pointerEvents = 'none';
                
                // Append iframe first
                document.body.appendChild(iframe);
                
                // Wait a tiny bit for iframe to be ready
                setTimeout(() => {
                    // Create form element
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = scriptURL;
                    form.target = iframeName;
                    form.style.display = 'none';
                    form.setAttribute('accept-charset', 'UTF-8');
                    
                    // Create and append hidden inputs
                    const fields = {
                        'name': name,
                        'email': email,
                        'message': message,
                        'timestamp': new Date().toISOString()
                    };
                    
                    for (const [key, value] of Object.entries(fields)) {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = value;
                        form.appendChild(input);
                    }
                    
                    // Append form to body
                    document.body.appendChild(form);
                    
                    // Submit form (this will submit to the iframe, not redirect the page)
                    form.submit();
                    
                    // Clean up and show success after a delay
                    setTimeout(() => {
                        // Remove form and iframe
                        try {
                            if (form && form.parentNode) {
                                document.body.removeChild(form);
                            }
                            if (iframe && iframe.parentNode) {
                                document.body.removeChild(iframe);
                            }
                        } catch (cleanupError) {
                            console.log('Cleanup error (non-critical):', cleanupError);
                        }
                        
                        // Show success message
                        alert('Thank you for your message! We will get back to you soon.');
                        contactForm.reset();
                        
                        // Re-enable button
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }, 2000);
                }, 100);
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error sending your message. Please try again later or contact us directly at contact@swiftsitelabs.com');
                // Re-enable button on error
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
}

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

// Observe service cards and other elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .about-content, .project-card, .contact-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

