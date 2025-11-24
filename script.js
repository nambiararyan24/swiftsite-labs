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
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Simple validation
        if (name && email && message) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Google Apps Script Web App URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbxQHUlHAjOO-wshNxqayvPX-Q3rnPRv-b_7cfJYDB0c11az6PbUoGCJ6aKXX4X16HoZ/exec';
            
            // Create a unique iframe name
            const iframeName = 'gas_iframe_' + Date.now();
            
            // Create hidden iframe
            const iframe = document.createElement('iframe');
            iframe.name = iframeName;
            iframe.id = iframeName;
            iframe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;top:-9999px;border:none;visibility:hidden;';
            document.body.appendChild(iframe);
            
            // Create form that will submit to iframe
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = scriptURL;
            form.target = iframeName;
            form.style.cssText = 'display:none;';
            
            // Add form fields
            const data = {
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            Object.keys(data).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            });
            
            document.body.appendChild(form);
            
            // Listen for iframe load to know when submission is complete
            let submissionComplete = false;
            const checkSubmission = () => {
                if (!submissionComplete) {
                    submissionComplete = true;
                    
                    // Clean up
                    setTimeout(() => {
                        try {
                            if (form.parentNode) document.body.removeChild(form);
                            if (iframe.parentNode) document.body.removeChild(iframe);
                        } catch (err) {
                            console.log('Cleanup:', err);
                        }
                        
                        // Show success and reset
                        alert('Thank you for your message! We will get back to you soon.');
                        contactForm.reset();
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }, 500);
                }
            };
            
            // Try to detect when iframe loads (submission complete)
            try {
                iframe.onload = checkSubmission;
            } catch (e) {
                // Fallback: just wait and assume success
                setTimeout(checkSubmission, 2000);
            }
            
            // Submit the form
            form.submit();
            
            // Fallback timeout in case iframe.onload doesn't fire
            setTimeout(checkSubmission, 3000);
            
        } else {
            alert('Please fill in all fields.');
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

