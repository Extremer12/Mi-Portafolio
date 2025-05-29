// =================================================================
// SCRIPT.JS - PORTAFOLIO PROFESIONAL DE CRISTIAN BORDÓN
// =================================================================

// Configuración global
const CONFIG = {
    EMAIL_SERVICE: 'https://formspree.io/f/YOUR_FORM_ID', // Reemplazar con tu ID de Formspree
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 100,
    TESTIMONIAL_INTERVAL: 5000
};

// =================================================================
// UTILIDADES GENERALES
// =================================================================

// Función de debounce para optimizar performance
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

// Función para hacer smooth scroll
function smoothScrollTo(element, offset = 80) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

// Función para validar email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Función para mostrar notificaciones
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
    
    // Mostrar notificación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar notificación
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// =================================================================
// MANEJO DEL HEADER Y NAVEGACIÓN - MEJORADO PARA MOBILE
// =================================================================

class HeaderManager {
    constructor() {
        this.header = document.querySelector('header');
        this.menuToggle = document.querySelector('.menu-toggle');
        this.nav = document.querySelector('nav');
        this.navLinks = document.querySelectorAll('nav a');
        this.lastScrollTop = 0;
        
        this.init();
    }
    
    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.preventHorizontalScroll();
    }
    
    preventHorizontalScroll() {
        // Prevenir scroll horizontal en toda la página
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevenir zoom con doble tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    setupScrollEffect() {
        const handleScroll = debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Agregar clase scrolled al header
            if (scrollTop > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            this.lastScrollTop = scrollTop;
        }, CONFIG.DEBOUNCE_DELAY);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    setupMobileMenu() {
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }
        
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Cerrar menú al hacer click en un enlace
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
        
        // Prevenir scroll del body cuando el menú está abierto
        this.nav.addEventListener('transitionend', () => {
            if (this.nav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }
    
    toggleMobileMenu() {
        this.nav.classList.toggle('active');
        const icon = this.menuToggle.querySelector('i');
        
        if (this.nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            this.menuToggle.setAttribute('aria-expanded', 'true');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            this.menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
    
    closeMobileMenu() {
        this.nav.classList.remove('active');
        const icon = this.menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Ajustar offset para móviles
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
        
        window.addEventListener('scroll', handleScroll);
    }
}

// =================================================================
// ANIMACIONES EN SCROLL
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
        // Añadir clases de animación a elementos específicos
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        const serviceCards = document.querySelectorAll('.service-card');
        const aboutContent = document.querySelector('.about-content');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (heroContent) {
            heroContent.classList.add('animate-on-scroll', 'fade-in-left');
            heroContent.style.opacity = '1'; // Asegurar visibilidad inicial
        }
        if (heroImage) {
            heroImage.classList.add('animate-on-scroll', 'fade-in-right');
            heroImage.style.opacity = '1'; // Asegurar visibilidad inicial
        }
        if (aboutContent) {
            aboutContent.classList.add('animate-on-scroll');
            aboutContent.style.opacity = '1'; // Asegurar visibilidad inicial
        }
        
        serviceCards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.opacity = '1'; // Asegurar visibilidad inicial
        });
        
        portfolioItems.forEach((item, index) => {
            item.classList.add('animate-on-scroll');
            item.style.animationDelay = `${index * 0.1}s`;
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
// MANEJO DEL FORMULARIO MULTI-PASO
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
        // Botones siguiente
        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nextStep = parseInt(btn.getAttribute('data-next'));
                if (this.validateCurrentStep()) {
                    this.goToStep(nextStep);
                }
            });
        });
        
        // Botones anterior
        document.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prevStep = parseInt(btn.getAttribute('data-prev'));
                this.goToStep(prevStep);
            });
        });
    }
    
    setupFormValidation() {
        // Validación en tiempo real
        this.form.addEventListener('input', (e) => {
            this.validateField(e.target);
        });
        
        this.form.addEventListener('change', (e) => {
            this.validateField(e.target);
            this.updateFormData();
        });
    }
    
    setupConditionalFields() {
        // Mostrar campo de URL si tiene sitio web
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
        
        // Limpiar errores previos
        field.classList.remove('error');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Validaciones específicas
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        } else if (field.type === 'email' && field.value && !validateEmail(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        } else if (field.type === 'url' && field.value && !this.validateUrl(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa una URL válida';
        }
        
        // Mostrar error si existe
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('span');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }
        
        return isValid;
    }
    
    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
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
        
        // Validaciones específicas por paso
        if (this.currentStep === 1) {
            const projectType = document.getElementById('project-type');
            const hasWebsite = document.querySelector('input[name="has-website"]:checked');
            
            if (!projectType.value) {
                this.validateField(projectType);
                isValid = false;
            }
            
            if (!hasWebsite) {
                showNotification('Por favor selecciona si tienes un sitio web actualmente', 'error');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    updateFormData() {
        const formData = new FormData(this.form);
        this.formData = {};
        
        // Campos simples
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
        
        // Checkboxes múltiples
        const features = [];
        document.querySelectorAll('input[name="features"]:checked').forEach(checkbox => {
            features.push(checkbox.value);
        });
        if (features.length > 0) {
            this.formData.features = features;
        }
    }
    
    goToStep(stepNumber) {
        // Ocultar paso actual
        this.steps[this.currentStep - 1].style.display = 'none';
        
        // Mostrar nuevo paso
        this.currentStep = stepNumber;
        this.steps[this.currentStep - 1].style.display = 'block';
        
        // Actualizar indicadores
        this.updateProgress();
        
        // Scroll hacia el formulario
        const formContainer = document.querySelector('.questionnaire-container');
        smoothScrollTo(formContainer, 100);
    }
    
    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
        
        // Actualizar indicadores de pasos
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
            // Mostrar loading
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Actualizar datos del formulario
            this.updateFormData();
            
            // Preparar datos para envío
            const formData = new FormData();
            Object.keys(this.formData).forEach(key => {
                if (Array.isArray(this.formData[key])) {
                    formData.append(key, this.formData[key].join(', '));
                } else {
                    formData.append(key, this.formData[key]);
                }
            });
            
            // Enviar formulario (simulado)
            await this.sendFormData(formData);
            
            // Mostrar mensaje de éxito
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showNotification('Error al enviar el formulario. Por favor intenta nuevamente.', 'error');
        } finally {
            // Restaurar botón
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.textContent = 'Enviar';
            submitBtn.disabled = false;
        }
    }
    
    async sendFormData(formData) {
        // Simular envío de formulario
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Datos del formulario:', Object.fromEntries(formData));
                resolve();
            }, 2000);
        });
        
        // Para usar con Formspree u otro servicio:
        /*
        const response = await fetch(CONFIG.EMAIL_SERVICE, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error en el envío');
        }
        */
    }
    
    showSuccessMessage() {
        // Ocultar formulario
        this.form.style.display = 'none';
        
        // Mostrar mensaje de éxito
        const successMessage = document.getElementById('form-success');
        successMessage.style.display = 'block';
        
        // Scroll hacia el mensaje
        smoothScrollTo(successMessage, 100);
    }
}

// =================================================================
// FILTRO DE PORTAFOLIO
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
                
                // Actualizar botón activo
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filtrar elementos
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

// =================================================================
// SLIDER DE TESTIMONIOS - MEJORADO
// =================================================================

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
        this.setupKeyboardNavigation();
        this.updateSlider();
        
        console.log(`Testimonios slider inicializado con ${this.totalSlides} testimonios`);
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
        
        // Pausar autoplay al hover o focus
        if (this.wrapper) {
            this.wrapper.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });
            
            this.wrapper.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
            
            this.wrapper.addEventListener('focusin', () => {
                this.stopAutoPlay();
            });
            
            this.wrapper.addEventListener('focusout', () => {
                this.startAutoPlay();
            });
        }
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    this.goToPrevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.goToNextSlide();
                }
            }
        });
    }
    
    goToSlide(slideIndex) {
        if (slideIndex === this.currentSlide || this.isTransitioning) return;
        
        this.isTransitioning = true;
        const prevSlide = this.currentSlide;
        this.currentSlide = slideIndex;
        
        // Animar salida del slide actual
        this.slides[prevSlide].classList.remove('active');
        
        // Determinar dirección de la animación
        if (slideIndex > prevSlide) {
            this.slides[prevSlide].classList.add('prev');
        } else {
            this.slides[prevSlide].classList.add('next');
        }
        
        // Animar entrada del nuevo slide
        setTimeout(() => {
            // Limpiar clases del slide anterior
            this.slides[prevSlide].classList.remove('prev', 'next');
            
            // Activar nuevo slide
            this.slides[this.currentSlide].classList.add('active');
            
            // Actualizar controles
            this.updateControls();
            
            // Permitir nuevas transiciones después de completar la animación
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
        // Actualizar dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Actualizar botones (opcional: deshabilitar en los extremos)
        if (this.prevBtn) {
            this.prevBtn.disabled = false; // Siempre habilitado por el loop
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = false; // Siempre habilitado por el loop
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // Limpiar interval anterior
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
    
    // Método para pausar temporalmente el autoplay
    pauseAutoPlay(duration = 3000) {
        this.stopAutoPlay();
        setTimeout(() => {
            this.startAutoPlay();
        }, duration);
    }
    
    // Método para destruir el slider (útil para cleanup)
    destroy() {
        this.stopAutoPlay();
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });
    }
}

// =================================================================
// MODO OSCURO
// =================================================================

class DarkModeToggle {
    constructor() {
        this.darkModeBtn = document.querySelector('.dark-mode-btn');
        this.body = document.body;
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }
    
    init() {
        // No crear botón ya que está en el HTML
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
        
        // Escuchar cambios en preferencias del sistema
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
            this.darkModeBtn.setAttribute('aria-label', 'Switch to light mode');
        }
        localStorage.setItem('darkMode', 'enabled');
    }
    
    disableDarkMode() {
        this.body.classList.remove('dark-mode');
        if (this.darkModeBtn) {
            this.darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            this.darkModeBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
        localStorage.setItem('darkMode', 'disabled');
    }
}

// =================================================================
// BOTÓN SCROLL TO TOP (Actualizar para eliminar el dark mode btn)
// =================================================================

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
            this.scrollBtn.setAttribute('aria-label', 'Scroll to top');
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
        
        window.addEventListener('scroll', handleScroll);
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
// EFECTOS DE PARALLAX Y PARTÍCULAS
// =================================================================

class ParallaxEffects {
    constructor() {
        this.particles = document.querySelectorAll('.particle');
        this.init();
    }
    
    init() {
        this.setupParticleMovement();
        this.createAdditionalParticles();
    }
    
    setupParticleMovement() {
        window.addEventListener('scroll', debounce(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            this.particles.forEach((particle, index) => {
                const speed = 0.5 + (index % 3) * 0.3;
                particle.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
            });
        }, 16)); // 60fps
    }
    
    createAdditionalParticles() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;
        
        // Crear partículas adicionales dinámicamente
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (6 + Math.random() * 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }
}

// =================================================================
// LAZY LOADING DE IMÁGENES
// =================================================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            this.loadAllImages();
        }
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        this.images.forEach(img => observer.observe(img));
    }
    
    loadImage(img) {
        img.src = img.dataset.src;
        img.onload = () => {
            img.classList.add('loaded');
        };
    }
    
    loadAllImages() {
        this.images.forEach(img => this.loadImage(img));
    }
}

// =================================================================
// PERFORMANCE MONITOR
// =================================================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        this.logPageLoadTime();
        this.setupPerformanceObserver();
    }
    
    logPageLoadTime() {
        window.addEventListener('load', () => {
            // Corregir el cálculo del tiempo de carga
            const loadTime = performance.now();
            console.log(`Tiempo de carga de la página: ${Math.round(loadTime)}ms`);
        });
    }
    
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name.includes('.jpg') || entry.name.includes('.png') || entry.name.includes('.webp')) {
                        console.log(`Imagen cargada: ${entry.name} en ${entry.duration}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }
}

// =================================================================
// MANEJO DE ORIENTACIÓN Y RESIZE
// =================================================================

class ResponsiveHandler {
    constructor() {
        this.init();
    }
    
    init() {
        this.handleOrientationChange();
        this.handleResize();
    }
    
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Forzar recálculo después del cambio de orientación
            setTimeout(() => {
                window.scrollTo(0, window.scrollY);
                this.adjustViewport();
            }, 500);
        });
    }
    
    handleResize() {
        window.addEventListener('resize', debounce(() => {
            this.adjustViewport();
        }, 250));
    }
    
    adjustViewport() {
        // Ajustar altura de viewport en móviles
        if (window.innerWidth <= 768) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }
}

// =================================================================
// OPTIMIZACIONES PARA TOUCH
// =================================================================

class TouchOptimizations {
    constructor() {
        this.init();
    }
    
    init() {
        this.addTouchFeedback();
        this.preventScrollBounce();
    }
    
    addTouchFeedback() {
        // Añadir feedback visual para elementos táctiles
        const touchElements = document.querySelectorAll('.btn, .service-card, .portfolio-item, .testimonial-card, .contact-card, .skill-tag');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            element.addEventListener('touchend', () => {
                element.style.transform = '';
            }, { passive: true });
        });
    }
    
    preventScrollBounce() {
        // Prevenir el rebote de scroll en iOS
        document.addEventListener('touchmove', (e) => {
            const target = e.target;
            const scrollableParent = this.findScrollableParent(target);
            
            if (!scrollableParent) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    findScrollableParent(element) {
        while (element && element !== document.body) {
            const style = window.getComputedStyle(element);
            if (style.overflowY === 'scroll' || style.overflowY === 'auto') {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }
}

// =================================================================
// INICIALIZACIÓN PRINCIPAL - ACTUALIZADA
// =================================================================

class App {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Inicializar componentes principales
            this.components.headerManager = new HeaderManager();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.multiStepForm = new MultiStepForm();
            this.components.portfolioFilter = new PortfolioFilter();
            this.components.testimonialsSlider = new TestimonialsSlider();
            this.components.darkModeToggle = new DarkModeToggle();
            this.components.scrollToTop = new ScrollToTop();
            this.components.parallaxEffects = new ParallaxEffects();
            this.components.lazyLoader = new LazyLoader();
            
            // Nuevos componentes para móviles
            this.components.responsiveHandler = new ResponsiveHandler();
            this.components.touchOptimizations = new TouchOptimizations();
            
            // Solo en desarrollo
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                this.components.performanceMonitor = new PerformanceMonitor();
            }
            
            // Configuraciones adicionales
            this.setupKeyboardNavigation();
            this.setupServiceWorker();
            this.setupViewportFix();
            
            console.log('✅ Aplicación inicializada correctamente');
            
        } catch (error) {
            console.error('❌ Error al inicializar la aplicación:', error);
        }
    }
    
    setupViewportFix() {
        // Fix para altura de viewport en móviles
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 500);
        });
    }
    
    setupKeyboardNavigation() {
        // Navegación con teclado mejorada
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Cerrar menú móvil si está abierto
                const nav = document.querySelector('nav');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }
    
    setupServiceWorker() {
        console.log('Service Worker deshabilitado temporalmente');
    }
}

// =================================================================
// ESTILOS ADICIONALES PARA NOTIFICACIONES
// =================================================================

// Agregar estilos para notificaciones dinámicamente
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

// Agregar estilos al documento
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// =================================================================
// INICIALIZAR APLICACIÓN
// =================================================================

// Crear instancia principal de la aplicación
const portfolioApp = new App();

// Exportar para uso global si es necesario
window.PortfolioApp = portfolioApp;