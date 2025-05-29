// =================================================================
// SCRIPT.JS - PORTAFOLIO PROFESIONAL DE CRISTIAN BORDÓN
// =================================================================

// Configuración global
const CONFIG = {
    EMAIL_SERVICE: 'https://formspree.io/f/YOUR_FORM_ID',
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 100,
    TESTIMONIAL_INTERVAL: 5000
};

// =================================================================
// CONFIGURACIÓN DE EMAILJS - ACTUALIZADO CON TUS DATOS REALES
// =================================================================

const EMAIL_CONFIG = {
    SERVICE_ID: 'service_g50s2sv',
    TEMPLATE_ID: 'template_0fc49do',
    PUBLIC_KEY: '-avaKSi0GQ1MQ2I-4'
};

// Inicializar EmailJS
emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);

// =================================================================
// UTILIDADES GENERALES
// =================================================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function smoothScrollTo(element, offset = 80) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// =================================================================
// ARREGLO DEFINITIVO PARA SCROLL MÓVIL - SIMPLIFICADO
// =================================================================

function setupMobileScroll() {
    console.log('🔧 Configurando scroll móvil...');
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window;
    
    if (isMobile || isTouch) {
        // Configuración simple y efectiva
        document.documentElement.style.overflow = 'auto';
        document.documentElement.style.webkitOverflowScrolling = 'touch';
        document.documentElement.style.touchAction = 'pan-y';
        
        document.body.style.overflow = 'auto';
        document.body.style.webkitOverflowScrolling = 'touch';
        document.body.style.touchAction = 'pan-y';
        document.body.style.position = 'relative';
        document.body.style.height = 'auto';
        document.body.style.minHeight = '100vh';
        
        // Solo prevenir zoom, NO prevenir scroll
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault(); // Prevenir zoom en doble tap
            }
            lastTouchEnd = now;
        }, { passive: false });
        
        // Prevenir zoom con pellizco pero permitir scroll
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('gesturechange', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('gestureend', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        console.log('✅ Scroll móvil configurado');
    }
}

// =================================================================
// HEADER Y NAVEGACIÓN - SIMPLIFICADO
// =================================================================

class HeaderManager {
    constructor() {
        this.header = document.querySelector('header');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.nav = document.querySelector('nav');
        this.navLinks = document.querySelectorAll('nav a');
        this.init();
    }
    
    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
    }
    
    setupScrollEffect() {
        const handleScroll = debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }, CONFIG.DEBOUNCE_DELAY);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    setupMobileMenu() {
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }
        
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }
    
    toggleMobileMenu() {
        this.nav.classList.toggle('active');
        const icon = this.menuToggle.querySelector('i');
        
        if (this.nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    closeMobileMenu() {
        this.nav.classList.remove('active');
        const icon = this.menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const isMobile = window.innerWidth <= 768;
                    const offset = isMobile ? 60 : 80;
                    smoothScrollTo(targetElement, offset);
                }
            });
        });
    }
    
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        const handleScroll = debounce(() => {
            const scrollPosition = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, CONFIG.DEBOUNCE_DELAY);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
}

// =================================================================
// ANIMACIÓN DE ESCRITURA DE CÓDIGO
// =================================================================

class CodeTypewriter {
    constructor() {
        this.codeLines = document.querySelectorAll('.code-line');
        this.currentLine = 0;
        this.isTyping = false;
        this.init();
    }
    
    init() {
        setTimeout(() => {
            this.startTyping();
        }, 1000);
        
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const codeEditor = document.querySelector('.code-editor');
        if (!codeEditor) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isTyping) {
                    this.resetAnimation();
                    setTimeout(() => {
                        this.startTyping();
                    }, 500);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(codeEditor);
    }
    
    resetAnimation() {
        this.currentLine = 0;
        this.codeLines.forEach(line => {
            line.classList.remove('show');
            line.style.opacity = '0';
            line.style.transform = 'translateY(10px)';
        });
    }
    
    startTyping() {
        if (this.isTyping || this.currentLine >= this.codeLines.length) return;
        
        this.isTyping = true;
        this.typeNextLine();
    }
    
    typeNextLine() {
        if (this.currentLine >= this.codeLines.length) {
            this.isTyping = false;
            
            setTimeout(() => {
                this.resetAnimation();
                setTimeout(() => {
                    this.startTyping();
                }, 1000);
            }, 5000);
            return;
        }
        
        const currentLineElement = this.codeLines[this.currentLine];
        currentLineElement.classList.add('show');
        
        this.currentLine++;
        
        const delay = this.currentLine === this.codeLines.length ? 1000 : 400;
        setTimeout(() => {
            this.typeNextLine();
        }, delay);
    }
}

// =================================================================
// RESTO DE COMPONENTES (mantener igual)
// =================================================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.animate-on-scroll');
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.addAnimationClasses();
    }
    
    addAnimationClasses() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        const serviceCards = document.querySelectorAll('.service-card');
        const aboutContent = document.querySelector('.about-content');
        
        if (heroContent) {
            heroContent.classList.add('animate-on-scroll', 'fade-in-left');
            heroContent.style.opacity = '1';
        }
        if (heroImage) {
            heroImage.classList.add('animate-on-scroll', 'fade-in-right');
            heroImage.style.opacity = '1';
        }
        if (aboutContent) {
            aboutContent.classList.add('animate-on-scroll');
            aboutContent.style.opacity = '1';
        }
        
        serviceCards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.opacity = '1';
        });
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, options);
        
        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// =================================================================
// FORMULARIO MULTI-PASO (mantener igual que antes)
// =================================================================

class MultiStepForm {
    constructor() {
        this.form = document.getElementById('project-form');
        this.steps = document.querySelectorAll('.form-step');
        this.progressBar = document.getElementById('form-progress');
        this.stepIndicators = document.querySelectorAll('.step');
        this.currentStep = 1;
        this.totalSteps = this.steps.length;
        this.formData = {};
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.setupFormNavigation();
        this.setupFormValidation();
        this.setupConditionalFields();
        this.setupFormSubmission();
        this.updateProgress();
    }
    
    setupFormNavigation() {
        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nextStep = parseInt(btn.getAttribute('data-next'));
                if (this.validateCurrentStep()) {
                    this.goToStep(nextStep);
                }
            });
        });
        
        document.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prevStep = parseInt(btn.getAttribute('data-prev'));
                this.goToStep(prevStep);
            });
        });
    }
    
    setupFormValidation() {
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });
        
        this.form.addEventListener('change', (e) => {
            this.validateField(e.target);
            this.updateFormData();
        });
    }
    
    setupConditionalFields() {
        document.querySelectorAll('input[name="has-website"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const websiteField = document.getElementById('current-website');
                if (e.target.value === 'si') {
                    websiteField.style.display = 'block';
                    websiteField.querySelector('input').required = true;
                } else {
                    websiteField.style.display = 'none';
                    websiteField.querySelector('input').required = false;
                }
            });
        });
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateCurrentStep()) {
                this.submitForm();
            }
        });
    }
    
    validateField(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';
        
        field.classList.remove('error');
        if (errorElement) {
            errorElement.remove();
        }
        
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && field.value && !validateEmail(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        } else if (field.name === 'accept-terms' && field.type === 'checkbox' && !field.checked) {
            isValid = false;
            errorMessage = 'Debes aceptar los términos para continuar';
        }
        
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('span');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    updateFormData() {
        const formData = new FormData(this.form);
        this.formData = {};
        
        for (let [key, value] of formData.entries()) {
            if (this.formData[key]) {
                if (Array.isArray(this.formData[key])) {
                    this.formData[key].push(value);
                } else {
                    this.formData[key] = [this.formData[key], value];
                }
            } else {
                this.formData[key] = value;
            }
        }
        
        const features = [];
        document.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
            features.push(checkbox.value);
        });
        if (features.length > 0) {
            this.formData.features = features;
        }
    }
    
    goToStep(stepNumber) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.steps[this.currentStep - 1].style.display = 'none';
        this.currentStep = stepNumber;
        this.steps[this.currentStep - 1].style.display = 'block';
        
        this.updateProgress();
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 100);
    }
    
    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
        
        this.stepIndicators.forEach((indicator, index) => {
            if (index < this.currentStep) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    async submitForm() {
        try {
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            this.updateFormData();
            const templateParams = this.prepareEmailData();
            
            await this.sendEmailWithEmailJS(templateParams);
            this.showSuccessMessage();
            
            showNotification('¡Formulario enviado correctamente! Te contactaré pronto.', 'success');
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showNotification('Error al enviar el formulario. Por favor intenta nuevamente.', 'error');
        } finally {
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.textContent = 'Enviar Solicitud';
            submitBtn.disabled = false;
        }
    }
    
    prepareEmailData() {
        const features = Array.isArray(this.formData.features) 
            ? this.formData.features.join(', ') 
            : (this.formData.features || 'No especificadas');
        
        return {
            first_name: this.formData['first-name'] || '',
            last_name: this.formData['last-name'] || '',
            email: this.formData.email || '',
            phone: this.formData.phone || '',
            company: this.formData.company || 'No especificada',
            how_found: this.formData['how-found'] || 'No especificado',
            project_type: this.formData['project-type'] || '',
            project_purpose: this.formData['project-purpose'] || '',
            has_website: this.formData['has-website'] || '',
            website_url: this.formData['website-url'] || 'No tiene',
            preferred_colors: this.formData['preferred-colors'] || 'No especificados',
            has_logo: this.formData['has-logo'] || '',
            reference_sites: this.formData['reference-sites'] || 'No especificados',
            features: features,
            additional_features: this.formData['additional-features'] || 'No especificadas',
            responsive: this.formData.responsive || '',
            deadline: this.formData.deadline || 'No especificada',
            budget: this.formData.budget || '',
            additional_comments: this.formData['additional-comments'] || 'Sin comentarios adicionales',
            submission_date: new Date().toLocaleString('es-AR', {
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    }
    
    async sendEmailWithEmailJS(templateParams) {
        try {
            const response = await emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams
            );
            
            console.log('Email enviado correctamente:', response);
            return response;
            
        } catch (error) {
            console.error('Error al enviar email:', error);
            throw error;
        }
    }
    
    showSuccessMessage() {
        this.form.style.display = 'none';
        
        const successMessage = document.getElementById('form-success');
        successMessage.style.display = 'block';
        
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>¡Gracias por tu solicitud!</h3>
            <p>He recibido toda la información sobre tu proyecto y me pondré en contacto contigo en las próximas 24 horas.</p>
            <div class="success-actions">
                <a href="#inicio" class="btn primary-btn">Volver al inicio</a>
                <a href="#contacto" class="btn secondary-btn">Información de contacto</a>
            </div>
        `;
        
        smoothScrollTo(successMessage, 100);
    }
}

// =================================================================
// COMPONENTES RESTANTES (simplificados)
// =================================================================

class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.init();
    }
    
    init() {
        this.setupFilterButtons();
    }
    
    setupFilterButtons() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                this.filterItems(filter);
            });
        });
    }
    
    filterItems(filter) {
        this.portfolioItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

class TestimonialsSlider {
    constructor() {
        this.wrapper = document.querySelector('.testimonial-wrapper');
        this.slides = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.prevBtn = document.querySelector('.prev-testimonial');
        this.nextBtn = document.querySelector('.next-testimonial');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        this.setupControls();
        this.setupDots();
        this.setupAutoPlay();
        this.updateSlider();
    }
    
    setupControls() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToPrevSlide();
                }
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToNextSlide();
                }
            });
        }
    }
    
    setupDots() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isTransitioning && index !== this.currentSlide) {
                    this.goToSlide(index);
                }
            });
        });
    }
    
    setupAutoPlay() {
        this.startAutoPlay();
        
        if (this.wrapper) {
            this.wrapper.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });
            
            this.wrapper.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }
    
    goToSlide(slideIndex) {
        if (slideIndex === this.currentSlide || this.isTransitioning) return;
        
        this.isTransitioning = true;
        const prevSlide = this.currentSlide;
        this.currentSlide = slideIndex;
        
        this.slides[prevSlide].classList.remove('active');
        
        if (slideIndex > prevSlide) {
            this.slides[prevSlide].classList.add('prev');
        } else {
            this.slides[prevSlide].classList.add('next');
        }
        
        setTimeout(() => {
            this.slides[prevSlide].classList.remove('prev', 'next');
            this.slides[this.currentSlide].classList.add('active');
            this.updateControls();
            
            setTimeout(() => {
                this.isTransitioning = false;
            }, 500);
        }, 50);
    }
    
    goToNextSlide() {
        const nextSlide = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextSlide);
    }
    
    goToPrevSlide() {
        const prevSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevSlide);
    }
    
    updateSlider() {
        this.updateControls();
    }
    
    updateControls() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.goToNextSlide();
            }
        }, CONFIG.TESTIMONIAL_INTERVAL);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

class DarkModeToggle {
    constructor() {
        this.darkModeBtn = document.querySelector('.dark-mode-btn');
        this.body = document.body;
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }
    
    init() {
        this.loadDarkModePreference();
        this.setupEventListeners();
    }
    
    loadDarkModePreference() {
        const savedMode = localStorage.getItem('darkMode');
        const shouldUseDarkMode = savedMode === 'enabled' || 
            (savedMode === null && this.prefersDark.matches);
        
        if (shouldUseDarkMode) {
            this.enableDarkMode();
        }
    }
    
    setupEventListeners() {
        if (this.darkModeBtn) {
            this.darkModeBtn.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }
        
        this.prefersDark.addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.disableDarkMode();
                }
            }
        });
    }
    
    toggleDarkMode() {
        if (this.body.classList.contains('dark-mode')) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
    
    enableDarkMode() {
        this.body.classList.add('dark-mode');
        if (this.darkModeBtn) {
            this.darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
        localStorage.setItem('darkMode', 'enabled');
    }
    
    disableDarkMode() {
        this.body.classList.remove('dark-mode');
        if (this.darkModeBtn) {
            this.darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('darkMode', 'disabled');
    }
}

class ScrollToTop {
    constructor() {
        this.scrollBtn = document.querySelector('.scroll-top-btn');
        this.init();
    }
    
    init() {
        this.createScrollButton();
        this.setupScrollDetection();
        this.setupClickHandler();
    }
    
    createScrollButton() {
        if (!this.scrollBtn) {
            this.scrollBtn = document.createElement('button');
            this.scrollBtn.className = 'scroll-top-btn';
            this.scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(this.scrollBtn);
        }
    }
    
    setupScrollDetection() {
        const handleScroll = debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 500) {
                this.scrollBtn.classList.add('visible');
            } else {
                this.scrollBtn.classList.remove('visible');
            }
        }, CONFIG.DEBOUNCE_DELAY);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    setupClickHandler() {
        this.scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// =================================================================
// INICIALIZACIÓN PRINCIPAL - SIMPLIFICADA
// =================================================================

class App {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Configurar scroll móvil PRIMERO
            setupMobileScroll();
            
            // Inicializar componentes
            this.components.headerManager = new HeaderManager();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.multiStepForm = new MultiStepForm();
            this.components.portfolioFilter = new PortfolioFilter();
            this.components.testimonialsSlider = new TestimonialsSlider();
            this.components.darkModeToggle = new DarkModeToggle();
            this.components.scrollToTop = new ScrollToTop();
            this.components.codeTypewriter = new CodeTypewriter();
            
            console.log('✅ Aplicación inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
        }
    }
}

// =================================================================
// ESTILOS PARA NOTIFICACIONES
// =================================================================

const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow);
        z-index: 10000;
        transform: translateX(100%);
        transition: var(--transition);
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.notification-success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification.notification-error {
        border-left: 4px solid var(--danger-color);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-primary);
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-success .notification-content i {
        color: var(--success-color);
    }
    
    .notification-error .notification-content i {
        color: var(--danger-color);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// =================================================================
// INICIALIZAR APLICACIÓN
// =================================================================

const portfolioApp = new App();
window.PortfolioApp = portfolioApp;