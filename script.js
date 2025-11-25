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
            mobileMenuToggle.classList.toggle('active');
            document.body.style.overflow = !isActive ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        const navLinkItems = document.querySelectorAll('.nav-links a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
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
                        mobileMenuToggle.classList.remove('active');
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
    
    // Enhanced Form Validation
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        function validateField(field) {
            const errorMessage = field.parentElement.querySelector('.error-message');
            let isValid = true;
            let errorText = '';
            
            // Remove previous error state
            field.classList.remove('error');
            if (errorMessage) {
                errorMessage.classList.remove('show');
                errorMessage.textContent = '';
            }
            
            // Validate based on field type
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    errorText = 'Please enter a valid email address';
                }
            }
            
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorText = 'This field is required';
            }
            
            if (field.id === 'message' && field.value.trim().length < 10) {
                isValid = false;
                errorText = 'Message must be at least 10 characters';
            }
            
            if (!isValid) {
                field.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = errorText;
                    errorMessage.classList.add('show');
                }
            }
            
            return isValid;
        }
        
        // Form submission with validation
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Validate all fields
            let allValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    allValid = false;
                }
            });
            
            if (!allValid) {
                return;
            }
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            if (!submitButton) {
                alert('Error: Submit button not found. Please refresh the page.');
                return;
            }
            
            const originalButtonText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending... <span class="spinner"></span>';
            
            try {
                // Use Vercel serverless function as proxy
                const apiURL = '/api/submit-form';
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);
                
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
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok || response.status === 302) {
                    contactForm.reset();
                    // Clear any error states
                    inputs.forEach(input => {
                        input.classList.remove('error');
                        const errorMsg = input.parentElement.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.classList.remove('show');
                            errorMsg.textContent = '';
                        }
                    });
                    showSuccessModal();
                } else {
                    const errorResult = await response.json().catch(() => ({ error: 'Unknown error' }));
                    throw new Error(errorResult.error || 'Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                if (error.name === 'AbortError') {
                    contactForm.reset();
                    inputs.forEach(input => {
                        input.classList.remove('error');
                        const errorMsg = input.parentElement.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.classList.remove('show');
                            errorMsg.textContent = '';
                        }
                    });
                    showSuccessModal();
                } else {
                    alert('Sorry, there was an error sending your message. Please try again later or contact us directly at contact@swiftsitelabs.com');
                }
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
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

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
});


// Back to Top Button
window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Email Copy to Clipboard
document.addEventListener('DOMContentLoaded', () => {
    const emailLink = document.getElementById('emailLink');
    const copyToast = document.getElementById('copyToast');
    
    if (emailLink && copyToast) {
        emailLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = emailLink.getAttribute('data-email');
            
            try {
                await navigator.clipboard.writeText(email);
                
                // Show toast
                copyToast.classList.add('show');
                setTimeout(() => {
                    copyToast.classList.remove('show');
                }, 2000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    copyToast.classList.add('show');
                    setTimeout(() => {
                        copyToast.classList.remove('show');
                    }, 2000);
                } catch (err) {
                    // If all else fails, just open mailto
                    window.location.href = `mailto:${email}`;
                }
                document.body.removeChild(textArea);
            }
        });
    }
});

// Active Nav State on Scroll
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
});

// Enhanced Form Validation
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
        
        function validateField(field) {
            const errorMessage = field.parentElement.querySelector('.error-message');
            let isValid = true;
            let errorText = '';
            
            // Remove previous error state
            field.classList.remove('error');
            if (errorMessage) {
                errorMessage.classList.remove('show');
                errorMessage.textContent = '';
            }
            
            // Validate based on field type
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    errorText = 'Please enter a valid email address';
                }
            }
            
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorText = 'This field is required';
            }
            
            if (field.id === 'message' && field.value.trim().length < 10) {
                isValid = false;
                errorText = 'Message must be at least 10 characters';
            }
            
            if (!isValid) {
                field.classList.add('error');
                if (errorMessage) {
                    errorMessage.textContent = errorText;
                    errorMessage.classList.add('show');
                }
            }
            
            return isValid;
        }
        
        // Update form submission to use validation
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Validate all fields
            let allValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    allValid = false;
                }
            });
            
            if (!allValid) {
                return;
            }
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            if (!submitButton) {
                alert('Error: Submit button not found. Please refresh the page.');
                return;
            }
            
            const originalButtonText = submitButton.textContent;
            
            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending... <span class="spinner"></span>';
            
            try {
                // Use Vercel serverless function as proxy
                const apiURL = '/api/submit-form';
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);
                
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
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok || response.status === 302) {
                    contactForm.reset();
                    // Clear any error states
                    inputs.forEach(input => {
                        input.classList.remove('error');
                        const errorMsg = input.parentElement.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.classList.remove('show');
                            errorMsg.textContent = '';
                        }
                    });
                    showSuccessModal();
                } else {
                    const errorResult = await response.json().catch(() => ({ error: 'Unknown error' }));
                    throw new Error(errorResult.error || 'Form submission failed');
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                if (error.name === 'AbortError') {
                    contactForm.reset();
                    inputs.forEach(input => {
                        input.classList.remove('error');
                        const errorMsg = input.parentElement.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.classList.remove('show');
                            errorMsg.textContent = '';
                        }
                    });
                    showSuccessModal();
                } else {
                    alert('Sorry, there was an error sending your message. Please try again later or contact us directly at contact@swiftsitelabs.com');
                }
            } finally {
                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});

