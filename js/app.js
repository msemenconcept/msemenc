/**
 * Msemen Concept - Main Application JavaScript
 * Integrated single-page application with landing page and ordering system
 */

// Immediately-invoked function expression to avoid global scope pollution
(function() {
    'use strict';
    
    // Initialize GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    /**
     * ========================================
     * UTILITY FUNCTIONS
     * ========================================
     */
    
    /**
     * Debounce function to limit how often a function is called
     * @param {Function} func - The function to debounce
     * @param {number} wait - The debounce delay in milliseconds
     * @param {boolean} immediate - Whether to call the function immediately
     * @returns {Function} Debounced function
     */
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
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
     * Format price for display
     * @param {number} price - Price to format
     * @returns {string} Formatted price
     */
    function formatPrice(price) {
        return price.toFixed(2) + 'DH';
    }

    /**
     * Validate phone number
     * @param {string} phoneNumber - Phone number to validate
     * @returns {boolean} Whether phone number is valid
     */
    function isValidPhoneNumber(phoneNumber) {
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        const regex = /^[0-9]{9}$/;
        return regex.test(digitsOnly);
    }

    /**
     * Format phone number for display
     * @param {string} phoneNumber - Phone number to format
     * @returns {string} Formatted phone number
     */
    function formatPhoneNumber(phoneNumber) {
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        
        if (digitsOnly.length >= 9) {
            return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
        }
        
        return phoneNumber;
    }

    /**
     * ========================================
     * SHOPPING CART CLASS
     * ========================================
     */
    class ShoppingCart {
        constructor() {
            this.items = [];
            this.total = 0;
            this.itemCount = 0;
            this.loadFromStorage();
        }
        
        // Load cart from local storage
        loadFromStorage() {
            const savedCart = localStorage.getItem('msemenCart');
            if (savedCart) {
                try {
                    this.items = JSON.parse(savedCart);
                    this.updateTotals();
                } catch (e) {
                    console.error('Error loading saved cart', e);
                    this.items = [];
                }
            }
        }
        
        // Save cart to local storage
        saveToStorage() {
            localStorage.setItem('msemenCart', JSON.stringify(this.items));
        }
        
        // Add item to cart
        addItem(name, price, quantity = 1) {
            // Validate inputs
            if (!name || isNaN(price) || quantity <= 0) {
                UI.showToast('Erreur: Informations produit invalides', 'error');
                return false;
            }
            
            // Check if item already exists
            const existingItemIndex = this.items.findIndex(item => item.name === name);
            
            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                this.items[existingItemIndex].quantity += quantity;
                this.items[existingItemIndex].total = this.items[existingItemIndex].quantity * this.items[existingItemIndex].price;
                UI.showToast(`Ajouté ${quantity} ${name} de plus au panier`, 'success');
            } else {
                // Add new item
                this.items.push({
                    id: Date.now(),
                    name: name,
                    price: price,
                    quantity: quantity,
                    total: price * quantity
                });
                UI.showToast(`${name} ajouté au panier`, 'success');
            }
            
            // Update totals and save
            this.updateTotals();
            this.saveToStorage();
            
            return true;
        }
        
        // Update item in cart
        updateItem(itemId, newQuantity) {
            if (isNaN(newQuantity) || newQuantity <= 0) {
                UI.showToast('Quantité invalide', 'error');
                return false;
            }
            
            const item = this.items.find(item => item.id === itemId);
            if (!item) return false;
            
            const oldQuantity = item.quantity;
            item.quantity = newQuantity;
            item.total = item.price * item.quantity;
            
            // Update totals and save
            this.updateTotals();
            this.saveToStorage();
            
            // Return change info
            return {
                success: true,
                name: item.name,
                oldQuantity,
                newQuantity: item.quantity
            };
        }
        
        // Remove item from cart
        removeItem(itemId) {
            const itemIndex = this.items.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return false;
            
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            
            // Update totals and save
            this.updateTotals();
            this.saveToStorage();
            
            return {
                success: true,
                name: removedItem.name
            };
        }
        
        // Clear cart
        clearCart() {
            this.items = [];
            this.updateTotals();
            localStorage.removeItem('msemenCart');
            return true;
        }
        
        // Find item by ID
        findItem(itemId) {
            return this.items.find(item => item.id === itemId);
        }
        
        // Update cart totals
        updateTotals() {
            this.total = this.items.reduce((sum, item) => sum + item.total, 0);
            this.itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
        }
        
        // Get cart data
        getItems() {
            return this.items;
        }
        
        getTotal() {
            return this.total;
        }
        
        getItemCount() {
            return this.itemCount;
        }
        
        // Check if cart is empty
        isEmpty() {
            return this.items.length === 0;
        }
    }

    /**
     * ========================================
     * UI MODULE
     * Handles user interface interactions
     * ========================================
     */
    const UI = (function() {
        // Private variables
        let currentQuantity = 1;
        let currentItemPrice = 0;
        let currentItemId = null;
        let editMode = false;
        
        // DOM Elements cache
        const dom = {
            // Main sections
            mainContent: document.getElementById('main-content'),
            orderSystem: document.getElementById('order-system'),
            
            // Common elements
            preloader: document.getElementById('preloader'),
            header: document.getElementById('header'),
            toastContainer: document.getElementById('toastContainer'),
            backToTopBtn: document.getElementById('scroll-top-btn'),
            
            // Navigation elements
            navMenu: document.getElementById('nav-menu'),
            mobileToggle: document.getElementById('mobile-toggle'),
            
            // Order system elements
            searchInput: document.getElementById('searchInput'),
            clearSearchBtn: document.getElementById('clearSearch'),
            categoryTabs: document.getElementById('categoryTabs'),
            foodItemsContainer: document.getElementById('foodItemsContainer'),
            loadingIndicator: document.getElementById('loadingIndicator'),
            noResultsMessage: document.getElementById('noResultsMessage'),
            tabs: document.querySelectorAll('.tab'),
            desktopLinks: document.querySelectorAll('.sidebar-nav a'),
            
            // Cart elements
            viewCartBtn: document.getElementById('viewCart'),
            cartTotal: document.getElementById('cart-total'),
            cartItemsCount: document.getElementById('cart-items-count'),
            cartItemsList: document.getElementById('cartItemsList'),
            emptyCartMessage: document.getElementById('emptyCartMessage'),
            basketTotal: document.getElementById('basketTotal'),
            emptyCartBtn: document.getElementById('emptyCart'),
            
            // Order buttons
            openOrderBtn: document.getElementById('open-order-btn'),
            heroOrderBtn: document.getElementById('hero-order-btn'),
            aboutOrderBtn: document.getElementById('about-order-btn'),
            viewAllBtn: document.getElementById('view-all-btn'),
            ctaOrderBtn: document.getElementById('cta-order-btn'),
            footerOrderBtn: document.getElementById('footer-order-btn'),
            closeOrderBtn: document.getElementById('close-order-system'),
            quickOrderBtns: document.querySelectorAll('.quick-order-btn'),
            
            // Modals
            itemModal: document.getElementById('itemModal'),
            basketModal: document.getElementById('basketModal'),
            confirmationModal: document.getElementById('confirmationModal'),
            fullImageModal: document.getElementById('fullImageModal'),
            
            // Modal elements
            modalHeaderText: document.getElementById('modal-header-text'),
            modalItemName: document.getElementById('modal-item-name'),
            modalItemDescription: document.getElementById('modal-item-description'),
            modalItemPrice: document.getElementById('modal-item-price'),
            modalItemImage: document.getElementById('modal-item-image'),
            fullscreenImage: document.getElementById('fullscreen-image'),
            
            // Modal close buttons
            closeItemModalBtn: document.getElementById('closeItemModal'),
            closeBasketBtn: document.getElementById('closeBasket'),
            closeConfirmationBtn: document.getElementById('closeConfirmation'),
            closeFullImageModalBtn: document.getElementById('closeFullImageModal'),
            
            // Quantity controls
            quantityInput: document.getElementById('quantity'),
            decreaseBtn: document.getElementById('decrease'),
            increaseBtn: document.getElementById('increase'),
            addToCartBtn: document.getElementById('addToCart'),
            
            // Checkout elements
            checkoutBtn: document.getElementById('checkout'),
            submitOrderBtn: document.getElementById('submitOrder'),
            fullNameInput: document.getElementById('fullName'),
            phoneNumberInput: document.getElementById('phoneNumber'),
            fullNameFeedback: document.getElementById('fullNameFeedback'),
            phoneNumberFeedback: document.getElementById('phoneNumberFeedback'),
            orderDetailsList: document.getElementById('orderDetailsList'),
            customerDetails: document.getElementById('customerDetails'),
            confirmationTotal: document.getElementById('confirmationTotal'),
            
            // Animation elements
            counterElements: document.querySelectorAll('.counter')
        };
        
        // Public methods
        return {
            /**
             * Initialize UI components
             */
            init: function() {
                this.setupEventListeners();
                this.initializeScrollAnimations();
                this.setupLazyLoading();
                this.loadSavedUserInfo();
                this.updateCartUI();
                this.checkURLForOrderSystem();
                
                // Show welcome message on first visit
                if (!localStorage.getItem('hasVisited')) {
                    setTimeout(() => {
                        this.showToast('Bienvenue à Msemen Concept ! Découvrez nos délicieuses options.', 'info');
                        localStorage.setItem('hasVisited', 'true');
                    }, 1000);
                }
            },
            
            /**
             * Set up all event listeners
             */
            setupEventListeners: function() {
                // Preloader
                window.addEventListener('load', function() {
                    dom.preloader.classList.add('fade');
                    setTimeout(() => {
                        dom.preloader.style.display = 'none';
                    }, 500);
                });
                
                // Window events
                window.addEventListener('scroll', debounce(this.handleScroll.bind(this), 50));
                window.addEventListener('resize', debounce(this.handleResize.bind(this), 100));
                window.addEventListener('popstate', this.handlePopState.bind(this));
                
                // Header events
                dom.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
                
                // Navigation item clicks
                dom.navMenu.addEventListener('click', this.handleNavClick.bind(this));
                
                // Order system toggle buttons
                const orderButtons = [
                    dom.openOrderBtn, dom.heroOrderBtn, dom.aboutOrderBtn, 
                    dom.viewAllBtn, dom.ctaOrderBtn, dom.footerOrderBtn
                ];
                orderButtons.forEach(btn => {
                    if (btn) btn.addEventListener('click', this.showOrderSystem.bind(this));
                });
                
                // Quick order buttons in specialty items
                dom.quickOrderBtns.forEach(btn => {
                    btn.addEventListener('click', this.handleQuickOrderClick.bind(this));
                });
                
                // Close order system button
                if (dom.closeOrderBtn) {
                    dom.closeOrderBtn.addEventListener('click', this.hideOrderSystem.bind(this));
                }
                
                // Search functionality
                if (dom.searchInput) {
                    dom.searchInput.addEventListener('input', debounce((e) => {
                        Products.searchItems(e.target.value);
                    }, 300));
                }
                
                if (dom.clearSearchBtn) {
                    dom.clearSearchBtn.addEventListener('click', () => {
                        dom.searchInput.value = '';
                        dom.searchInput.focus();
                        
                        // Refilter to current category
                        const activeTab = document.querySelector('.tab.active');
                        if (activeTab) {
                            const category = activeTab.dataset.category;
                            Products.filterItemsByCategory(category);
                        }
                    });
                }
                
                // Category navigation
                if (dom.tabs) {
                    dom.tabs.forEach(tab => {
                        tab.addEventListener('click', () => {
                            const category = tab.dataset.category;
                            Products.updateActiveNavigation(category);
                            Products.filterItemsByCategory(category);
                        });
                        
                        // Keyboard access
                        tab.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                tab.click();
                            }
                        });
                    });
                }
                
                // Desktop sidebar links
                if (dom.desktopLinks) {
                    dom.desktopLinks.forEach(link => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            const category = link.dataset.category;
                            Products.updateActiveNavigation(category);
                            Products.filterItemsByCategory(category);
                        });
                    });
                }
                
                // Food items click event with event delegation
                if (dom.foodItemsContainer) {
                    dom.foodItemsContainer.addEventListener('click', this.handleFoodItemClick.bind(this));
                }
                
                // Cart events
                if (dom.viewCartBtn) {
                    dom.viewCartBtn.addEventListener('click', this.handleViewCartClick.bind(this));
                }
                
                if (dom.emptyCartBtn) {
                    dom.emptyCartBtn.addEventListener('click', Cart.handleEmptyCCartClick.bind(Cart));
                }
                
                // Cart item buttons via event delegation
                if (dom.cartItemsList) {
                    dom.cartItemsList.addEventListener('click', Cart.handleCartItemAction.bind(Cart));
                }
                
                // Quantity controls
                if (dom.decreaseBtn) {
                    dom.decreaseBtn.addEventListener('click', () => {
                        if (currentQuantity > 1) {
                            this.setQuantity(currentQuantity - 1);
                        }
                    });
                }
                
                if (dom.increaseBtn) {
                    dom.increaseBtn.addEventListener('click', () => {
                        this.setQuantity(currentQuantity + 1);
                    });
                }
                
                if (dom.quantityInput) {
                    dom.quantityInput.addEventListener('input', function() {
                        let value = parseInt(this.value);
                        if (isNaN(value) || value < 1) {
                            value = 1;
                        } else if (value > 99) {
                            value = 99;
                        }
                        
                        UI.setQuantity(value);
                    });
                }
                
                // Add to cart button
                if (dom.addToCartBtn) {
                    dom.addToCartBtn.addEventListener('click', function(e) {
                        // Prevent multiple clicks
                        e.preventDefault();
                        
                        // Add visual feedback
                        this.classList.add('button-click');
                        
                        // Disable the button temporarily to prevent double-clicks
                        this.disabled = true;
                        
                        // Check if in edit mode
                        if (editMode) {
                            Cart.updateItemInCart(currentItemId, currentQuantity);
                        } else {
                            Cart.addCurrentItemToCart();
                        }
                        
                        // Re-enable the button after a short delay
                        setTimeout(() => {
                            this.disabled = false;
                            this.classList.remove('button-click');
                        }, 500);
                    });
                }
                
                // Modal images
                if (dom.modalItemImage) {
                    dom.modalItemImage.addEventListener('click', () => {
                        dom.fullscreenImage.src = dom.modalItemImage.src;
                        dom.fullscreenImage.alt = dom.modalItemImage.alt;
                        this.openModal(dom.fullImageModal);
                    });
                }
                
                // Fullscreen image click to close
                const fullscreenImageContainer = document.querySelector('.fullscreen-image-container');
                if (fullscreenImageContainer) {
                    fullscreenImageContainer.addEventListener('click', (e) => {
                        if (!e.target.closest('.fullscreen-close-btn')) {
                            this.closeModal(dom.fullImageModal);
                        }
                        e.stopPropagation();
                    });
                }
                
                if (dom.fullscreenImage) {
                    dom.fullscreenImage.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.closeModal(dom.fullImageModal);
                    });
                }
                
                // Modal close buttons
                if (dom.closeItemModalBtn) {
                    dom.closeItemModalBtn.addEventListener('click', () => {
                        this.closeModal(dom.itemModal);
                        this.resetItemModal();
                    });
                }
                
                if (dom.closeBasketBtn) {
                    dom.closeBasketBtn.addEventListener('click', () => {
                        this.closeModal(dom.basketModal);
                    });
                }
                
                if (dom.closeConfirmationBtn) {
                    dom.closeConfirmationBtn.addEventListener('click', () => {
                        this.closeModal(dom.confirmationModal);
                    });
                }
                
                if (dom.closeFullImageModalBtn) {
                    dom.closeFullImageModalBtn.addEventListener('click', () => {
                        this.closeModal(dom.fullImageModal);
                    });
                }
                
                // Form inputs storage and validation
                if (dom.fullNameInput) {
                    dom.fullNameInput.addEventListener('input', () => {
                        dom.fullNameFeedback.textContent = '';
                        dom.fullNameInput.classList.remove('error');
                        
                        localStorage.setItem('customerName', dom.fullNameInput.value);
                    });
                }
                
                if (dom.phoneNumberInput) {
                    dom.phoneNumberInput.addEventListener('input', () => {
                        dom.phoneNumberFeedback.textContent = '';
                        dom.phoneNumberInput.classList.remove('error');
                        
                        // Format phone number as user types
                        const cursorPosition = dom.phoneNumberInput.selectionStart;
                        const unformattedValue = dom.phoneNumberInput.value.replace(/\D/g, '');
                        const formattedValue = formatPhoneNumber(unformattedValue);
                        
                        dom.phoneNumberInput.value = formattedValue;
                        localStorage.setItem('customerPhone', unformattedValue);
                        
                        // Attempt to restore cursor position after formatting
                        if (dom.phoneNumberInput === document.activeElement) {
                            // Calculate new cursor position
                            const newPosition = cursorPosition + (formattedValue.length - dom.phoneNumberInput.value.length);
                            dom.phoneNumberInput.setSelectionRange(newPosition, newPosition);
                        }
                    });
                }
                
                // Checkout process
                if (dom.checkoutBtn) {
                    dom.checkoutBtn.addEventListener('click', Checkout.processCheckout.bind(Checkout));
                }
                
                // WhatsApp order submission
                if (dom.submitOrderBtn) {
                    dom.submitOrderBtn.addEventListener('click', Checkout.submitOrder.bind(Checkout));
                }
                
                // Close modals when clicking outside
                window.addEventListener('click', (e) => {
                    if (e.target === dom.itemModal) {
                        this.closeModal(dom.itemModal);
                        this.resetItemModal();
                    }
                    if (e.target === dom.basketModal) {
                        this.closeModal(dom.basketModal);
                    }
                    if (e.target === dom.confirmationModal) {
                        this.closeModal(dom.confirmationModal);
                    }
                    if (e.target === dom.fullImageModal) {
                        this.closeModal(dom.fullImageModal);
                    }
                });
                
                // Back to top button
                if (dom.backToTopBtn) {
                    dom.backToTopBtn.addEventListener('click', () => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    });
                }
                
                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    // ESC to close modals
                    if (e.key === 'Escape') {
                        if (dom.fullImageModal.style.display === 'flex') {
                            this.closeModal(dom.fullImageModal);
                        } else if (dom.itemModal.style.display === 'flex') {
                            this.closeModal(dom.itemModal);
                            this.resetItemModal();
                        } else if (dom.basketModal.style.display === 'flex') {
                            this.closeModal(dom.basketModal);
                        } else if (dom.confirmationModal.style.display === 'flex') {
                            this.closeModal(dom.confirmationModal);
                        } else if (dom.orderSystem.classList.contains('active')) {
                            this.hideOrderSystem();
                        }
                    }
                    
                    // CTRL+B to view cart
                    if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        if (!Cart.cart.isEmpty()) {
                            Cart.renderCartItems();
                            this.openModal(dom.basketModal);
                        } else {
                            this.showToast('Votre panier est vide', 'info');
                        }
                    }
                    
                    // CTRL+F to focus search
                    if (e.key === 'f' && (e.ctrlKey || e.metaKey) && dom.searchInput) {
                        e.preventDefault();
                        dom.searchInput.focus();
                    }
                });
                
                // Smooth scrolling for navigation links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function(e) {
                        // Skip if it's an order button (already handled)
                        if (this.id && (
                            this.id === 'open-order-btn' || 
                            this.id === 'hero-order-btn' || 
                            this.id === 'about-order-btn' || 
                            this.id === 'view-all-btn' || 
                            this.id === 'cta-order-btn' || 
                            this.id === 'footer-order-btn'
                        )) {
                            return;
                        }
                        
                        e.preventDefault();
                        
                        const targetId = this.getAttribute('href');
                        if (targetId === '#') return;
                        
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            window.scrollTo({
                                top: targetElement.offsetTop - 70, // Adjust for header height
                                behavior: 'smooth'
                            });
                            
                            // Close mobile menu if open
                            if (dom.navMenu.classList.contains('active')) {
                                dom.navMenu.classList.remove('active');
                                dom.mobileToggle.classList.remove('open');
                            }
                        }
                    });
                });
            },
            
            /**
             * Initialize scroll animations
             */
            initializeScrollAnimations: function() {
                // Add active class to navigation based on scroll position
                function setActiveNavLink() {
                    const sections = document.querySelectorAll('section[id]');
                    const navLinks = document.querySelectorAll('.nav-menu a');
                    
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
                const navLinks = document.querySelectorAll('.nav-menu a');
                
                if (window.innerWidth >= 992 && nav) {
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
                dom.counterElements.forEach(counter => {
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
            },
            
            /**
             * Set up lazy loading for images
             */
            setupLazyLoading: function() {
                // If Intersection Observer is supported
                if ('IntersectionObserver' in window) {
                    const imageObserver = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                const src = img.dataset.src;
                                if (src) {
                                    img.src = src;
                                    img.removeAttribute('data-src');
                                    imageObserver.unobserve(img);
                                }
                            }
                        });
                    });
                    
                    // Target all images with data-src attribute
                    document.querySelectorAll('img[data-src]').forEach(img => {
                        imageObserver.observe(img);
                    });
                } else {
                    // Fallback for browsers that don't support Intersection Observer
                    document.querySelectorAll('img[data-src]').forEach(img => {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    });
                }
            },
            
            /**
             * Load saved user information
             */
            loadSavedUserInfo: function() {
                if (dom.fullNameInput) {
                    dom.fullNameInput.value = localStorage.getItem('customerName') || '';
                }
                
                if (dom.phoneNumberInput) {
                    const savedPhone = localStorage.getItem('customerPhone') || '';
                    dom.phoneNumberInput.value = formatPhoneNumber(savedPhone);
                }
            },
            
            /**
             * Check URL for order system parameters
             */
            checkURLForOrderSystem: function() {
                // If URL has #order-system, show the order system
                if (window.location.hash === '#order-system') {
                    this.showOrderSystem();
                    
                    // Check for category parameter
                    const urlParams = new URLSearchParams(window.location.search);
                    const category = urlParams.get('category');
                    if (category) {
                        const tab = document.querySelector(`.tab[data-category="${category}"]`);
                        if (tab) {
                            tab.click();
                        }
                    }
                }
            },
            
            /**
             * Handle window scroll event
             */
            handleScroll: function() {
                // Header scroll effect
                if (window.scrollY > 50) {
                    dom.header.classList.add('scrolled');
                } else {
                    dom.header.classList.remove('scrolled');
                }
                
                // Back to top button visibility
                if (window.scrollY > 300) {
                    dom.backToTopBtn.classList.add('visible');
                } else {
                    dom.backToTopBtn.classList.remove('visible');
                }
            },
            
            /**
             * Handle window resize event
             */
            handleResize: function() {
                // Adjust positioning if order system is visible
                if (dom.orderSystem && dom.orderSystem.classList.contains('active')) {
                    // Reset any mobile menu
                    if (dom.navMenu.classList.contains('active')) {
                        dom.navMenu.classList.remove('active');
                        dom.mobileToggle.classList.remove('open');
                    }
                }
            },
            
            /**
             * Handle browser back/forward navigation
             */
            handlePopState: function(event) {
                // If navigating back from order system
                if (window.location.hash !== '#order-system' && dom.orderSystem && dom.orderSystem.classList.contains('active')) {
                    this.hideOrderSystem();
                } 
                // If navigating to order system
                else if (window.location.hash === '#order-system' && dom.orderSystem && !dom.orderSystem.classList.contains('active')) {
                    this.showOrderSystem();
                }
            },
            
            /**
             * Toggle mobile menu
             */
            toggleMobileMenu: function() {
                dom.navMenu.classList.toggle('active');
                dom.mobileToggle.classList.toggle('open');
            },
            
            /**
             * Handle navigation click
             */
            handleNavClick: function(e) {
                if (e.target.tagName === 'A') {
                    dom.navMenu.classList.remove('active');
                    dom.mobileToggle.classList.remove('open');
                }
            },
            
            /**
             * Show the order system
             */
            showOrderSystem: function(e) {
                if (e) e.preventDefault();
                
                // Update URL without reloading page
                window.history.pushState({ page: 'order' }, 'Order System', '#order-system');
                
                // Show order system
                dom.orderSystem.classList.add('active');
                dom.orderSystem.style.display = 'block';
                
                // Hide main content scroll
                document.body.style.overflow = 'hidden';
                
                // Reset to default category
                setTimeout(() => {
                    const defaultTab = document.querySelector('.tab[data-category="concept"]');
                    if (defaultTab && !defaultTab.classList.contains('active')) {
                        defaultTab.click();
                    }
                }, 100);
                
                // Update cart UI
                this.updateCartUI();
            },
            
            /**
             * Hide the order system
             */
            hideOrderSystem: function(e) {
                if (e) e.preventDefault();
                
                // Update URL without reloading page
                window.history.pushState({ page: 'home' }, 'Home', window.location.pathname);
                
                // Hide order system
                dom.orderSystem.classList.remove('active');
                
                // Use a timeout to allow the animation to complete
                setTimeout(() => {
                    dom.orderSystem.style.display = 'none';
                    // Restore main content scroll
                    document.body.style.overflow = '';
                }, 300);
            },
            
            /**
             * Handle quick order button click in specialty items
             */
            handleQuickOrderClick: function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const btn = e.target;
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const description = btn.dataset.description;
                
                // Show the order system
                this.showOrderSystem();
                
                // Then show the item modal
                this.showQuickOrderModal(name, price, description);
            },
            
            /**
             * Show modal for quick ordering
             */
            showQuickOrderModal: function(name, price, description) {
                this.resetItemModal();
                
                dom.modalItemName.textContent = name;
                dom.modalItemDescription.textContent = description;
                dom.modalItemPrice.textContent = formatPrice(price);
                
                // Try to find the image in the food items
                const foodItem = Array.from(document.querySelectorAll('.food-item')).find(item => 
                    item.dataset.name === name
                );
                
                let imageSrc = '';
                if (foodItem) {
                    const imageElement = foodItem.querySelector('.food-image');
                    if (imageElement) {
                        imageSrc = imageElement.src;
                    }
                }
                
                this.handleModalImage(imageSrc, name);
                
                // Reset quantity
                currentQuantity = 1;
                dom.quantityInput.value = currentQuantity;
                
                // Set current item price for calculations
                currentItemPrice = price;
                
                // Update quantity controls
                this.updateQuantityControls();
                
                // Show modal after a short delay to ensure order system is fully visible
                setTimeout(() => {
                    this.openModal(dom.itemModal);
                }, 300);
            },
            
            /**
             * Handle food item click in the order system
             */
            handleFoodItemClick: function(e) {
                // Find closest food-item parent if click happened on a child element
                const foodItem = e.target.closest('.food-item');
                
                // Skip if not a food item or if clicking the add button
                if (!foodItem || e.target.classList.contains('add-btn')) return;
                
                // Reset modal state first
                this.resetItemModal();
                
                // Get item data
                const name = foodItem.dataset.name;
                const price = foodItem.dataset.price;
                const description = foodItem.dataset.description;
                
                // Get the image src from the item with error handling
                const imageElement = foodItem.querySelector('.food-image');
                const imageSrc = imageElement ? imageElement.src : '';
                
                dom.modalItemName.textContent = name;
                dom.modalItemDescription.textContent = description;
                dom.modalItemPrice.textContent = price;
                
                // Handle image loading
                this.handleModalImage(imageSrc, name);
                
                // Reset quantity
                currentQuantity = 1;
                dom.quantityInput.value = currentQuantity;
                
                // Set current item price for calculations
                try {
                    // Better price parsing with fallback
                    currentItemPrice = parseFloat(price.replace('DH', '').trim());
                    if (isNaN(currentItemPrice)) {
                        throw new Error('Invalid price format');
                    }
                } catch (error) {
                    console.error('Error parsing price:', error);
                    currentItemPrice = 0;
                    this.showToast('Erreur de prix. Veuillez réessayer.', 'error');
                    return; // Don't open modal if price is invalid
                }
                
                // Update quantity controls
                this.updateQuantityControls();
                
                // Add a small delay before opening the modal to ensure all calculations are complete
                setTimeout(() => {
                    // Show modal
                    this.openModal(dom.itemModal);
                }, 50);
            },
            
            /**
             * Handle view cart button click
             */
            handleViewCartClick: function() {
                Cart.renderCartItems();
                this.openModal(dom.basketModal);
            },
            
            /**
             * Open a modal with improved accessibility
             */
            openModal: function(modal) {
                // Show the modal
                modal.style.display = 'flex';
                
                // Find the first focusable element
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length) {
                    focusableElements[0].focus();
                }
                
                // Remember the element that had focus before
                modal.dataset.lastFocus = document.activeElement.id || 'body';
                
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
            },
            
            /**
             * Close a modal with improved accessibility
             */
            closeModal: function(modal) {
                // Hide the modal
                modal.style.display = 'none';
                
                // Return focus to the element that had it before
                const lastFocusId = modal.dataset.lastFocus;
                if (lastFocusId && lastFocusId !== 'body') {
                    const lastFocus = document.getElementById(lastFocusId);
                    if (lastFocus) lastFocus.focus();
                } else {
                    document.body.focus();
                }
                
                // Restore body scrolling
                document.body.style.overflow = '';
            },
            
            /**
             * Reset item modal to default state
             */
            resetItemModal: function() {
                dom.modalHeaderText.textContent = 'Ajouter au panier';
                dom.addToCartBtn.querySelector('.btn-text').textContent = 'Ajouter au panier';
                currentItemId = null;
                editMode = false;
                currentQuantity = 1;
                dom.quantityInput.value = currentQuantity;
                
                // Enable/disable decrease button based on quantity
                this.updateQuantityControls();
            },
            
            /**
             * Update decrease button state based on current quantity
             */
            updateQuantityControls: function() {
                if (currentQuantity <= 1) {
                    dom.decreaseBtn.disabled = true;
                    dom.decreaseBtn.style.opacity = '0.5';
                    dom.decreaseBtn.style.cursor = 'not-allowed';
                } else {
                    dom.decreaseBtn.disabled = false;
                    dom.decreaseBtn.style.opacity = '1';
                    dom.decreaseBtn.style.cursor = 'pointer';
                }
            },
            
            /**
             * Set quantity value and update UI
             */
            setQuantity: function(quantity) {
                // Ensure quantity is at least 1
                currentQuantity = Math.max(1, quantity);
                
                // Update input
                dom.quantityInput.value = currentQuantity;
                
                // Update decrease button state
                this.updateQuantityControls();
            },
            
            /**
             * Handle modal image loading
             */
            handleModalImage: function(imageSrc, itemName) {
                if (imageSrc) {
                    // First set a loading state
                    dom.modalItemImage.alt = "Chargement de l'image...";
                    dom.modalItemImage.style.display = "block"; // Ensure image is visible
                    
                    // Show the image loading
                    dom.modalItemImage.src = imageSrc;
                    
                    // Add error handling for the image
                    dom.modalItemImage.onerror = function() {
                        UI.handleImageError(this);
                    };
                    
                    // When image loads successfully
                    dom.modalItemImage.onload = function() {
                        this.alt = itemName;
                        // Remove any error message if it exists
                        const errorMsg = document.querySelector('.image-error-message');
                        if (errorMsg) errorMsg.remove();
                    };
                } else {
                    // Handle case where no image is found
                    dom.modalItemImage.src = '';
                    dom.modalItemImage.alt = "Image non disponible";
                    dom.modalItemImage.style.display = "none";
                    
                    this.handleImageError(dom.modalItemImage);
                }
            },
            
            /**
             * Handle image loading errors
             */
            handleImageError: function(imageElement) {
                imageElement.alt = "Image non disponible";
                imageElement.style.padding = "20px";
                imageElement.style.backgroundColor = "#f8f8f8";
                
                // Add a visible message inside the container
                const errorMsg = document.createElement('div');
                errorMsg.className = 'image-error-message';
                errorMsg.textContent = "Image non disponible";
                
                // Remove any previous error message
                const previousMsg = document.querySelector('.image-error-message');
                if (previousMsg) previousMsg.remove();
                
                const container = imageElement.closest('.modal-image-container');
                if (container) {
                    container.appendChild(errorMsg);
                }
            },
            
            /**
             * Animate the cart button
             */
            animateCartButton: function() {
                dom.viewCartBtn.classList.add('success-action');
                setTimeout(() => {
                    dom.viewCartBtn.classList.remove('success-action');
                }, 800);
                
                dom.viewCartBtn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    dom.viewCartBtn.style.transform = 'scale(1)';
                }, 300);
            },
            
            /**
             * Add success animation to element
             */
            animateSuccess: function(element) {
                element.classList.add('success-action');
                setTimeout(() => {
                    element.classList.remove('success-action');
                }, 800);
            },
            
            /**
             * Update the UI based on cart state
             */
            updateCartUI: function() {
                const cartTotal = Cart.cart.getTotal();
                
                // Use requestAnimationFrame for smoother updates
                requestAnimationFrame(() => {
                    // Update UI elements
                    dom.cartTotal.textContent = formatPrice(cartTotal);
                    dom.cartItemsCount.textContent = Cart.cart.getItemCount();
                    dom.basketTotal.textContent = formatPrice(cartTotal);
                    dom.confirmationTotal.textContent = formatPrice(cartTotal);
                    
                    // Update cart button animation
                    if (Cart.cart.getItemCount() > 0) {
                        dom.viewCartBtn.style.animation = 'pulse 2s infinite';
                    } else {
                        dom.viewCartBtn.style.animation = 'none';
                    }
                    
                    // Toggle empty cart message
                    if (dom.emptyCartMessage) {
                        dom.emptyCartMessage.style.display = Cart.cart.isEmpty() ? 'flex' : 'none';
                    }
                    
                    // Update checkout button state
                    if (dom.checkoutBtn) {
                        dom.checkoutBtn.disabled = Cart.cart.isEmpty();
                        if (Cart.cart.isEmpty()) {
                            dom.checkoutBtn.classList.add('disabled');
                        } else {
                            dom.checkoutBtn.classList.remove('disabled');
                        }
                    }
                });
            },
            
            /**
             * Show toast notification
             */
            showToast: function(message, type = 'info') {
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.textContent = message;
                
                dom.toastContainer.appendChild(toast);
                
                // Allow clicking to dismiss
                toast.addEventListener('click', () => toast.remove());
                
                // Remove toast after 3 seconds
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 3000);
            },
            
            // Public properties for other modules to access
            get currentQuantity() { return currentQuantity; },
            get currentItemPrice() { return currentItemPrice; },
            get currentItemId() { return currentItemId; },
            get editMode() { return editMode; },
            
            // Public setters
            setEditMode: function(mode, itemId = null) {
                editMode = mode;
                currentItemId = itemId;
            },
            
            setModalTitle: function(text) {
                dom.modalHeaderText.textContent = text;
            },
            
            setAddButtonText: function(text) {
                dom.addToCartBtn.querySelector('.btn-text').textContent = text;
            }
        };
    })();

    /**
     * ========================================
     * PRODUCTS MODULE
     * Handles product display and filtering
     * ========================================
     */
    const Products = (function() {
        // DOM Elements
        const foodItemsContainer = document.getElementById('foodItemsContainer');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const noResultsMessage = document.getElementById('noResultsMessage');
        const tabs = document.querySelectorAll('.tab');
        const desktopLinks = document.querySelectorAll('.sidebar-nav a');
        
        return {
            /**
             * Filter items by category
             */
            filterItemsByCategory: function(category) {
                // Clear search
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.value = '';
                
                // Show loading indicator
                if (loadingIndicator) loadingIndicator.style.display = 'flex';
                
                // Hide no results message
                if (noResultsMessage) noResultsMessage.style.display = 'none';
                
                // Use setTimeout to allow UI to update before filtering
                setTimeout(() => {
                    let visibleCount = 0;
                    const foodItems = document.querySelectorAll('.food-item');
                    
                    // Show/hide items based on category
                    if (category === 'concept') {
                        foodItems.forEach(item => {
                            if (!item.classList.contains('standard-item') && 
                                !item.classList.contains('sale-item') && 
                                !item.classList.contains('boisson-chaude-item') && 
                                !item.classList.contains('boisson-fraiche-item') &&
                                !item.classList.contains('ramadan-item')) {
                                item.style.display = 'flex';
                                visibleCount++;
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    } else if (category === 'standards') {
                        foodItems.forEach(item => {
                            if (item.classList.contains('standard-item')) {
                                item.style.display = 'flex';
                                visibleCount++;
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    } else if (category === 'sales') {
                        foodItems.forEach(item => {
                            if (item.classList.contains('sale-item')) {
                                item.style.display = 'flex';
                                visibleCount++;
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    } else if (category === 'boissons-chauds') {
                        foodItems.forEach(item => {
                            if (item.classList.contains('boisson-chaude-item')) {
                                item.style.display = 'flex';
                                visibleCount++;
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    } else if (category === 'boissons-fraiches') {
                        foodItems.forEach(item => {
                            if (item.classList.contains('boisson-fraiche-item')) {
                                item.style.display = 'flex';
                                visibleCount++;
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    } else if (category === 'ramadan') {
                        foodItems.forEach(item => {
                            if (item.classList.contains('ramadan-item')) {
                                item.style.display = 'flex';
                                visibleCount++;
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    } else {
                        // For any other categories, just hide all items
                        foodItems.forEach(item => {
                            item.style.display = 'none';
                        });
                    }
                    
                    // Hide loading indicator
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                    
                    // Show no results message if needed
                    if (noResultsMessage && visibleCount === 0) {
                        noResultsMessage.style.display = 'flex';
                    }
                }, 300); // Small delay to show loading indicator
            },
            
            /**
             * Update active tab and sidebar link
             */
            updateActiveNavigation: function(category) {
                // Update mobile tabs
                tabs.forEach(tab => {
                    if (tab.dataset.category === category) {
                        tab.classList.add('active');
                        tab.setAttribute('aria-selected', 'true');
                    } else {
                        tab.classList.remove('active');
                        tab.setAttribute('aria-selected', 'false');
                    }
                });
                
                // Update desktop navigation
                desktopLinks.forEach(link => {
                    if (link.dataset.category === category) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Update URL query parameter but maintain the hash
                const url = new URL(window.location.href);
                url.searchParams.set('category', category);
                window.history.replaceState({}, '', url);
            },
            
            /**
             * Filter items based on search term
             */
            searchItems: function(searchTerm) {
                // Show loading indicator
                if (loadingIndicator) loadingIndicator.style.display = 'flex';
                
                // Hide no results message
                if (noResultsMessage) noResultsMessage.style.display = 'none';
                
                // Normalize search term
                const normalizedTerm = searchTerm.toLowerCase().trim();
                
                // Use setTimeout to allow UI to update before filtering
                setTimeout(() => {
                    let visibleCount = 0;
                    const foodItems = document.querySelectorAll('.food-item');
                    
                    // Filter items based on name and description
                    foodItems.forEach(item => {
                        const itemName = item.dataset.name.toLowerCase();
                        const itemDesc = item.dataset.description.toLowerCase();
                        
                        if (normalizedTerm === '' || 
                            itemName.includes(normalizedTerm) || 
                            itemDesc.includes(normalizedTerm)) {
                            item.style.display = 'flex';
                            visibleCount++;
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    // Update category tabs to show "All" as active when searching
                    if (normalizedTerm !== '') {
                        tabs.forEach(tab => tab.classList.remove('active'));
                    }
                    
                    // Hide loading indicator
                    if (loadingIndicator) loadingIndicator.style.display = 'none';
                    
                    // Show no results message if needed
                    if (noResultsMessage && visibleCount === 0) {
                        noResultsMessage.style.display = 'flex';
                    }
                }, 300); // Small delay to show loading indicator
            }
        };
    })();

    /**
     * ========================================
     * CART MODULE
     * Handles shopping cart functionality
     * ========================================
     */
    const Cart = (function() {
        // Initialize cart
        const cart = new ShoppingCart();
        
        // DOM Elements
        const cartItemsList = document.getElementById('cartItemsList');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const itemModal = document.getElementById('itemModal');
        const basketModal = document.getElementById('basketModal');
        
        return {
            // Expose cart object for access by other modules
            cart: cart,
            
            /**
             * Add current item to cart
             */
            addCurrentItemToCart: function() {
                const name = document.getElementById('modal-item-name').textContent;
                const price = UI.currentItemPrice;
                const quantity = UI.currentQuantity;
                
                // Add to cart using the cart class
                cart.addItem(name, price, quantity);
                
                // Update UI
                UI.updateCartUI();
                
                // Add animation to cart button
                UI.animateCartButton();
                
                // Add animation to the add button
                UI.animateSuccess(document.getElementById('addToCart'));
                
                // Close modal
                UI.closeModal(itemModal);
                UI.resetItemModal();
            },
            
            /**
             * Update item in cart
             */
            updateItemInCart: function(itemId, newQuantity) {
                // Update item using the cart class
                const result = cart.updateItem(itemId, newQuantity);
                
                if (result.success) {
                    // Update UI
                    UI.updateCartUI();
                    this.renderCartItems();
                    
                    // Show toast message
                    if (result.newQuantity > result.oldQuantity) {
                        UI.showToast(`Quantité de ${result.name} augmentée à ${result.newQuantity}`, 'success');
                    } else if (result.newQuantity < result.oldQuantity) {
                        UI.showToast(`Quantité de ${result.name} diminuée à ${result.newQuantity}`, 'success');
                    } else {
                        UI.showToast(`Quantité de ${result.name} inchangée`, 'info');
                    }
                    
                    // Add animation
                    UI.animateSuccess(document.getElementById('addToCart'));
                    
                    // Close item modal and show basket modal
                    UI.closeModal(itemModal);
                    UI.openModal(basketModal);
                    
                    // Reset modal
                    UI.resetItemModal();
                }
            },
            
            /**
             * Edit cart item
             */
            editCartItem: function(itemId) {
                const item = cart.findItem(itemId);
                if (!item) return;
                
                // Set current item details
                UI.setModalTitle('Modifier l\'article');
                document.getElementById('modal-item-name').textContent = item.name;
                document.getElementById('modal-item-description').textContent = '';
                document.getElementById('modal-item-price').textContent = formatPrice(item.price);
                document.getElementById('quantity').value = item.quantity;
                
                // Update state
                UI.setEditMode(true, itemId);
                UI.setQuantity(item.quantity);
                currentItemPrice = item.price;
                
                // Try to find the original item to get its image
                const originalItem = Array.from(document.querySelectorAll('.food-item')).find(foodItem => 
                    foodItem.dataset.name === item.name
                );
                
                if (originalItem) {
                    const imageElement = originalItem.querySelector('.food-image');
                    if (imageElement) {
                        const imageSrc = imageElement.src;
                        UI.handleModalImage(imageSrc, item.name);
                    } else {
                        UI.handleModalImage('', item.name);
                    }
                } else {
                    UI.handleModalImage('', item.name);
                }
                
                // Change button text
                UI.setAddButtonText('Mettre à jour');
                
                // Update quantity controls
                UI.updateQuantityControls();
                
                // Close basket modal and open item modal
                UI.closeModal(basketModal);
                UI.openModal(itemModal);
            },
            
            /**
             * Remove item from cart
             */
            removeCartItem: function(itemId) {
                const result = cart.removeItem(itemId);
                
                if (result.success) {
                    UI.updateCartUI();
                    this.renderCartItems();
                    UI.showToast(`${result.name} supprimé du panier`, 'info');
                }
            },
            
            /**
             * Handle empty cart button click
             */
            handleEmptyCCartClick: function() {
                if (cart.isEmpty()) {
                    UI.showToast('Votre panier est déjà vide', 'info');
                    return;
                }
                
                if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                    cart.clearCart();
                    UI.updateCartUI();
                    this.renderCartItems();
                    UI.showToast('Panier vidé', 'info');
                }
            },
            
            /**
             * Handle cart item actions (edit/remove)
             */
            handleCartItemAction: function(e) {
                const editBtn = e.target.closest('.edit-btn');
                const removeBtn = e.target.closest('.remove-btn');
                
                if (editBtn) {
                    const itemId = parseInt(editBtn.dataset.id);
                    this.editCartItem(itemId);
                } else if (removeBtn) {
                    const itemId = parseInt(removeBtn.dataset.id);
                    if (confirm(`Êtes-vous sûr de vouloir supprimer cet article de votre panier ?`)) {
                        this.removeCartItem(itemId);
                    }
                }
            },
            
            /**
             * Render cart items
             */
            renderCartItems: function() {
                // Clear previous items but preserve empty message
                if (cartItemsList) {
                    Array.from(cartItemsList.children).forEach(child => {
                        if (!child.classList.contains('empty-cart-message')) {
                            child.remove();
                        }
                    });
                    
                    const items = cart.getItems();
                    
                    if (items.length === 0) {
                        if (emptyCartMessage) {
                            emptyCartMessage.style.display = 'flex';
                        }
                        return;
                    }
                    
                    // Hide empty cart message if items exist
                    if (emptyCartMessage) {
                        emptyCartMessage.style.display = 'none';
                    }
                    
                    items.forEach(item => {
                        const cartItemElement = document.createElement('div');
                        cartItemElement.className = 'cart-item';
                        cartItemElement.innerHTML = `
                            <div class="item-info">
                                <div class="item-name">${item.name}</div>
                                <div class="item-price">${formatPrice(item.price)} × ${item.quantity} = ${formatPrice(item.total)}</div>
                            </div>
                            <div class="item-controls">
                                <button class="edit-btn" data-id="${item.id}" title="Modifier" aria-label="Modifier ${item.name}">✏️</button>
                                <button class="remove-btn" data-id="${item.id}" title="Supprimer" aria-label="Supprimer ${item.name}">🗑️</button>
                            </div>
                        `;
                        cartItemsList.appendChild(cartItemElement);
                    });
                }
            }
        };
    })();

    /**
     * ========================================
     * CHECKOUT MODULE
     * Handles order checkout process
     * ========================================
     */
    const Checkout = (function() {
        // DOM Elements
        const fullNameInput = document.getElementById('fullName');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const fullNameFeedback = document.getElementById('fullNameFeedback');
        const phoneNumberFeedback = document.getElementById('phoneNumberFeedback');
        const basketModal = document.getElementById('basketModal');
        const confirmationModal = document.getElementById('confirmationModal');
        const orderDetailsList = document.getElementById('orderDetailsList');
        const customerDetails = document.getElementById('customerDetails');
        
        return {
            /**
             * Process checkout
             */
            processCheckout: function() {
                // Validate form
                if (!this.validateCheckoutForm()) {
                    UI.showToast('Veuillez corriger les erreurs du formulaire', 'error');
                    return;
                }
                
                if (Cart.cart.isEmpty()) {
                    UI.showToast('Votre panier est vide', 'error');
                    return;
                }
                
                // Generate order details
                this.renderOrderConfirmation();
                
                // Hide basket modal and show confirmation modal
                UI.closeModal(basketModal);
                UI.openModal(confirmationModal);
            },
            
            /**
             * Validate checkout form
             */
            validateCheckoutForm: function() {
                let isValid = true;
                
                // Validate name
                if (!fullNameInput.value.trim()) {
                    fullNameFeedback.textContent = 'Le nom est requis';
                    fullNameInput.classList.add('error');
                    isValid = false;
                } else if (fullNameInput.value.trim().length < 3) {
                    fullNameFeedback.textContent = 'Le nom doit contenir au moins 3 caractères';
                    fullNameInput.classList.add('error');
                    isValid = false;
                } else {
                    fullNameFeedback.textContent = '';
                    fullNameInput.classList.remove('error');
                }
                
                // Validate phone
                if (!phoneNumberInput.value.trim()) {
                    phoneNumberFeedback.textContent = 'Le numéro de téléphone est requis';
                    phoneNumberInput.classList.add('error');
                    isValid = false;
                } else if (!isValidPhoneNumber(phoneNumberInput.value)) {
                    phoneNumberFeedback.textContent = 'Numéro de téléphone invalide (9 chiffres requis)';
                    phoneNumberInput.classList.add('error');
                    isValid = false;
                } else {
                    phoneNumberFeedback.textContent = '';
                    phoneNumberInput.classList.remove('error');
                }
                
                return isValid;
            },
            
            /**
             * Render order confirmation details
             */
            renderOrderConfirmation: function() {
                orderDetailsList.innerHTML = '';
                customerDetails.innerHTML = '';
                
                // Add customer details
                customerDetails.innerHTML = `
                    <p><strong>Nom du client:</strong> ${fullNameInput.value}</p>
                    <p><strong>Numéro de téléphone:</strong> +212 ${formatPhoneNumber(phoneNumberInput.value)}</p>
                `;
                
                // Add order details
                Cart.cart.getItems().forEach(item => {
                    const orderItemElement = document.createElement('div');
                    orderItemElement.className = 'order-item';
                    orderItemElement.innerHTML = `
                        ${item.name} x${item.quantity} = ${formatPrice(item.total)}
                    `;
                    orderDetailsList.appendChild(orderItemElement);
                });
            },
            
            /**
             * Submit order via WhatsApp
             */
            submitOrder: function() {
                const name = fullNameInput.value.trim();
                const phone = phoneNumberInput.value.trim();
                
                // Generate WhatsApp message
                let message = `*Nouvelle commande depuis l'application Msemen Concept*\n\n`;
                message += `*Détails du client:*\n`;
                message += `Nom: ${name}\n`;
                message += `Téléphone: +212 ${formatPhoneNumber(phone)}\n\n`;
                message += `*Détails de la commande:*\n`;
                
                Cart.cart.getItems().forEach(item => {
                    message += `- ${item.name} x${item.quantity} = ${formatPrice(item.total)}\n`;
                });
                
                message += `\n*Total: ${formatPrice(Cart.cart.getTotal())}*`;
                
                // Encode for WhatsApp URL
                const encodedMessage = encodeURIComponent(message);
                const whatsappNumber = "+212614882878"; // This should be configurable
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                
                // Open WhatsApp
                window.open(whatsappUrl, '_blank');
                
                // Close modal and reset
                UI.closeModal(confirmationModal);
                UI.showToast('Commande envoyée par WhatsApp!', 'success');
                
                // Clear cart
                Cart.cart.clearCart();
                UI.updateCartUI();
            }
        };
    })();

    // Initialize the application when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize UI
        UI.init();
        
        // Initialize default category in order system
        const defaultTab = document.querySelector('.tab[data-category="concept"]');
        if (defaultTab) {
            defaultTab.click();
        }
    });

})();
