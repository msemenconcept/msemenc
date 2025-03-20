// ===============================
// Utility Functions
// ===============================

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
 * Animate success action with a pulse effect
 * @param {HTMLElement} element - Element to animate
 */
function animateSuccess(element) {
    element.classList.add('success-action');
    setTimeout(() => {
        element.classList.remove('success-action');
    }, 800);
}

/**
 * Format price for display
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
    // Ensure price has 2 decimal places and proper separator
    return price.toFixed(2) + 'DH';
}

/**
 * Validate phone number
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
function isValidPhoneNumber(phoneNumber) {
    // Remove any non-digit characters for validation
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    // Check if it's a valid Moroccan number format (9 digits)
    const regex = /^[0-9]{9}$/;
    return regex.test(digitsOnly);
}

/**
 * Format phone number for display
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Format as XXX XXX XXX
    if (digitsOnly.length >= 9) {
        return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    return phoneNumber;
}

// ===============================
// ShoppingCart Class
// ===============================
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
            showToast('Erreur: Informations produit invalides', 'error');
            return false;
        }
        
        // Check if item already exists
        const existingItemIndex = this.items.findIndex(item => item.name === name);
        
        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            this.items[existingItemIndex].quantity += quantity;
            this.items[existingItemIndex].total = this.items[existingItemIndex].quantity * this.items[existingItemIndex].price;
            showToast(`Ajouté ${quantity} ${name} de plus au panier`, 'success');
        } else {
            // Add new item
            this.items.push({
                id: Date.now(),
                name: name,
                price: price,
                quantity: quantity,
                total: price * quantity
            });
            showToast(`${name} ajouté au panier`, 'success');
        }
        
        // Update totals and save
        this.updateTotals();
        this.saveToStorage();
        
        return true;
    }
    
    // Update item in cart
    updateItem(itemId, newQuantity) {
        if (isNaN(newQuantity) || newQuantity <= 0) {
            showToast('Quantité invalide', 'error');
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

// ===============================
// Variables
// ===============================
let currentQuantity = 1;
let currentItemPrice = 0;
let currentItemId = null;
let editMode = false;
let cartTotal = 0;

// Initialize cart
const cart = new ShoppingCart();

// ===============================
// DOM Elements
// ===============================
// Main elements
const foodItemsContainer = document.getElementById('foodItemsContainer');
const foodItems = document.querySelectorAll('.food-item');
const backToTopBtn = document.getElementById('backToTopBtn');
const toastContainer = document.getElementById('toastContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const noResultsMessage = document.getElementById('noResultsMessage');
const appHeader = document.getElementById('app-header');
const categoryWrapper = document.getElementById('category-wrapper');
const categoryTabs = document.getElementById('categoryTabs');
const scrollLeft = document.getElementById('scrollLeft');
const scrollRight = document.getElementById('scrollRight');

// Search elements (new)
const searchContainer = document.getElementById('searchContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');

// Modals
const itemModal = document.getElementById('itemModal');
const basketModal = document.getElementById('basketModal');
const confirmationModal = document.getElementById('confirmationModal');
const fullImageModal = document.getElementById('fullImageModal');

// Modal elements
const modalHeaderText = document.getElementById('modal-header-text');
const modalItemName = document.getElementById('modal-item-name');
const modalItemDescription = document.getElementById('modal-item-description');
const modalItemPrice = document.getElementById('modal-item-price');
const modalItemImage = document.getElementById('modal-item-image');
const fullscreenImage = document.getElementById('fullscreen-image');

// Close buttons
const closeItemModalBtn = document.getElementById('closeItemModal');
const closeBasketBtn = document.getElementById('closeBasket');
const closeConfirmationBtn = document.getElementById('closeConfirmation');
const closeFullImageModalBtn = document.getElementById('closeFullImageModal');

// Quantity controls
const quantityInput = document.getElementById('quantity');
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const addToCartBtn = document.getElementById('addToCart');
const quantityPresetBtns = document.querySelectorAll('.quantity-preset');

// Cart elements
const cartTotalSpan = document.getElementById('cart-total');
const cartItemsCount = document.getElementById('cart-items-count');
const basketTotalSpan = document.getElementById('basketTotal');
const confirmationTotalSpan = document.getElementById('confirmationTotal');
const cartItemsList = document.getElementById('cartItemsList');
const orderDetailsList = document.getElementById('orderDetailsList');
const customerDetails = document.getElementById('customerDetails');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const tabs = document.querySelectorAll('.tab');
const viewCartBtn = document.getElementById('viewCart');
const emptyCartBtn = document.getElementById('emptyCart');
const checkoutBtn = document.getElementById('checkout');
const submitOrderBtn = document.getElementById('submitOrder');

// Form elements
const fullNameInput = document.getElementById('fullName');
const phoneNumberInput = document.getElementById('phoneNumber');
const fullNameFeedback = document.getElementById('fullNameFeedback');
const phoneNumberFeedback = document.getElementById('phoneNumberFeedback');

// ===============================
// Prevent Double-tap Zoom
// ===============================

// Prevent double-tap zoom on iOS devices
(function preventDoubleTapZoom() {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
})();

// Prevent focus zoom
document.addEventListener('focus', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        document.documentElement.style.touchAction = 'none';
        setTimeout(function() {
            document.documentElement.style.touchAction = '';
        }, 100);
    }
}, true);

// ===============================
// Category & Header Position Fix
// ===============================

/**
 * Update category position based on header height
 * This fixes the wiggling issue on scroll
 */
function updateCategoryPosition() {
    const headerHeight = appHeader.offsetHeight;
    const searchHeight = searchContainer.offsetHeight;
    categoryWrapper.style.top = `${headerHeight + searchHeight}px`;
    
    // Update the margin for the main content
    const categoryHeight = categoryWrapper.offsetHeight;
    foodItemsContainer.style.marginTop = `${headerHeight + searchHeight + categoryHeight}px`;
}

// ===============================
// Search Functionality (New)
// ===============================

/**
 * Filter items based on search term
 * @param {string} searchTerm - Term to search for
 */
function searchItems(searchTerm) {
    // Show loading indicator
    loadingIndicator.style.display = 'flex';
    
    // Hide no results message
    noResultsMessage.style.display = 'none';
    
    // Normalize search term
    const normalizedTerm = searchTerm.toLowerCase().trim();
    
    // Use setTimeout to allow UI to update before filtering
    setTimeout(() => {
        let visibleCount = 0;
        
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
        loadingIndicator.style.display = 'none';
        
        // Show no results message if needed
        if (visibleCount === 0) {
            noResultsMessage.style.display = 'flex';
        }
    }, 300); // Small delay to show loading indicator
}

// ===============================
// Modals Management
// ===============================

/**
 * Open a modal with improved accessibility
 * @param {HTMLElement} modal - Modal element to open
 */
function openModal(modal) {
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
}

/**
 * Close a modal with improved accessibility
 * @param {HTMLElement} modal - Modal element to close
 */
function closeModal(modal) {
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
}

/**
 * Reset item modal to default state
 */
function resetItemModal() {
    modalHeaderText.textContent = 'Ajouter au panier';
    addToCartBtn.querySelector('.btn-text').textContent = 'Ajouter au panier';
    currentItemId = null;
    editMode = false;
    currentQuantity = 1;
    quantityInput.value = currentQuantity;
    
    // Reset quantity preset buttons
    quantityPresetBtns.forEach(btn => btn.classList.remove('active'));
    quantityPresetBtns[0].classList.add('active'); // Activate the first preset (1)
    
    // Enable/disable decrease button based on quantity
    updateQuantityControls();
}

// ===============================
// Toast Notifications
// ===============================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (info, success, error)
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Allow clicking to dismiss
    toast.addEventListener('click', () => toast.remove());
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ===============================
// Image Management
// ===============================

/**
 * Handle modal image loading
 * @param {string} imageSrc - Image source URL
 * @param {string} itemName - Item name for alt text
 */
function handleModalImage(imageSrc, itemName) {
    if (imageSrc) {
        // First set a loading state
        modalItemImage.alt = "Chargement de l'image...";
        modalItemImage.style.display = "block"; // Ensure image is visible
        
        // Show the image loading
        modalItemImage.src = imageSrc;
        
        // Add error handling for the image
        modalItemImage.onerror = function() {
            handleImageError(this);
        };
        
        // When image loads successfully
        modalItemImage.onload = function() {
            this.alt = itemName;
            // Remove any error message if it exists
            const errorMsg = document.querySelector('.image-error-message');
            if (errorMsg) errorMsg.remove();
        };
    } else {
        // Handle case where no image is found
        modalItemImage.src = '';
        modalItemImage.alt = "Image non disponible";
        modalItemImage.style.display = "none";
        
        handleImageError(modalItemImage);
    }
}

/**
 * Handle image loading errors
 * @param {HTMLImageElement} imageElement - Image element
 */
function handleImageError(imageElement) {
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
}

// ===============================
// Cart & Item Management
// ===============================

/**
 * Update decrease button state based on current quantity
 */
function updateQuantityControls() {
    if (currentQuantity <= 1) {
        decreaseBtn.disabled = true;
        decreaseBtn.style.opacity = '0.5';
        decreaseBtn.style.cursor = 'not-allowed';
    } else {
        decreaseBtn.disabled = false;
        decreaseBtn.style.opacity = '1';
        decreaseBtn.style.cursor = 'pointer';
    }
}

/**
 * Set quantity value and update UI
 * @param {number} quantity - New quantity value
 */
function setQuantity(quantity) {
    // Ensure quantity is at least 1
    currentQuantity = Math.max(1, quantity);
    
    // Update input
    quantityInput.value = currentQuantity;
    
    // Update preset buttons
    quantityPresetBtns.forEach(btn => {
        const btnQuantity = parseInt(btn.dataset.quantity);
        if (btnQuantity === currentQuantity) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update decrease button state
    updateQuantityControls();
}

/**
 * Animate the cart button
 */
function animateCartButton() {
    viewCartBtn.classList.add('success-action');
    setTimeout(() => {
        viewCartBtn.classList.remove('success-action');
    }, 800);
    
    viewCartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        viewCartBtn.style.transform = 'scale(1)';
    }, 300);
}

/**
 * Add item to cart
 */
function addItemToCart() {
    const name = modalItemName.textContent;
    const price = currentItemPrice;
    
    // Add to cart using the cart class
    cart.addItem(name, price, currentQuantity);
    
    // Update UI
    updateCartUI();
    
    // Add animation to cart button
    animateCartButton();
    
    // Add animation to the add button
    animateSuccess(addToCartBtn);
    
    // Close modal
    closeModal(itemModal);
    resetItemModal();
}

/**
 * Update item in cart
 */
function updateItemInCart() {
    // Update item using the cart class
    const result = cart.updateItem(currentItemId, currentQuantity);
    
    if (result.success) {
        // Update UI
        updateCartUI();
        renderCartItems();
        
        // Show toast message
        if (result.newQuantity > result.oldQuantity) {
            showToast(`Quantité de ${result.name} augmentée à ${result.newQuantity}`, 'success');
        } else if (result.newQuantity < result.oldQuantity) {
            showToast(`Quantité de ${result.name} diminuée à ${result.newQuantity}`, 'success');
        } else {
            showToast(`Quantité de ${result.name} inchangée`, 'info');
        }
        
        // Add animation
        animateSuccess(addToCartBtn);
        
        // Close item modal and show basket modal
        closeModal(itemModal);
        openModal(basketModal);
        
        // Reset modal
        resetItemModal();
    }
}

/**
 * Edit cart item
 * @param {number} itemId - Item ID to edit
 */
function editCartItem(itemId) {
    const item = cart.findItem(itemId);
    if (!item) return;
    
    // Set current item details
    modalHeaderText.textContent = 'Modifier l\'article';
    modalItemName.textContent = item.name;
    modalItemDescription.textContent = '';
    modalItemPrice.textContent = formatPrice(item.price);
    currentQuantity = item.quantity;
    quantityInput.value = currentQuantity;
    currentItemPrice = item.price;
    currentItemId = itemId;
    editMode = true;
    
    // Update quantity preset buttons
    quantityPresetBtns.forEach(btn => {
        const btnQuantity = parseInt(btn.dataset.quantity);
        if (btnQuantity === currentQuantity) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Try to find the original item to get its image
    const originalItem = Array.from(foodItems).find(foodItem => 
        foodItem.dataset.name === item.name
    );
    
    if (originalItem) {
        const imageElement = originalItem.querySelector('.food-image');
        if (imageElement) {
            const imageSrc = imageElement.src;
            handleModalImage(imageSrc, item.name);
        } else {
            handleModalImage('', item.name);
        }
    } else {
        handleModalImage('', item.name);
    }
    
    // Change button text
    addToCartBtn.querySelector('.btn-text').textContent = 'Mettre à jour';
    
    // Update quantity controls
    updateQuantityControls();
    
    // Close basket modal and open item modal
    closeModal(basketModal);
    openModal(itemModal);
}

/**
 * Remove item from cart
 * @param {number} itemId - Item ID to remove
 */
function removeCartItem(itemId) {
    const result = cart.removeItem(itemId);
    
    if (result.success) {
        updateCartUI();
        renderCartItems();
        showToast(`${result.name} supprimé du panier`, 'info');
    }
}

/**
 * Update the UI based on cart state
 */
function updateCartUI() {
    cartTotal = cart.getTotal();
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
        // Update UI elements
        cartTotalSpan.textContent = formatPrice(cartTotal);
        cartItemsCount.textContent = cart.getItemCount();
        basketTotalSpan.textContent = formatPrice(cartTotal);
        confirmationTotalSpan.textContent = formatPrice(cartTotal);
        
        // Update cart button animation
        if (cart.getItemCount() > 0) {
            viewCartBtn.style.animation = 'pulse 2s infinite';
        } else {
            viewCartBtn.style.animation = 'none';
        }
        
        // Toggle empty cart message
        if (emptyCartMessage) {
            emptyCartMessage.style.display = cart.isEmpty() ? 'flex' : 'none';
        }
        
        // Update checkout button state
        if (checkoutBtn) {
            checkoutBtn.disabled = cart.isEmpty();
            if (cart.isEmpty()) {
                checkoutBtn.classList.add('disabled');
            } else {
                checkoutBtn.classList.remove('disabled');
            }
        }
    });
}

/**
 * Render order confirmation details
 */
function renderOrderConfirmation() {
    orderDetailsList.innerHTML = '';
    customerDetails.innerHTML = '';
    
    // Add customer details
    customerDetails.innerHTML = `
        <p><strong>Nom du client:</strong> ${fullNameInput.value}</p>
        <p><strong>Numéro de téléphone:</strong> +212 ${formatPhoneNumber(phoneNumberInput.value)}</p>
    `;
    
    // Add order details
    cart.getItems().forEach(item => {
        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'order-item';
        orderItemElement.innerHTML = `
            ${item.name} x${item.quantity} = ${formatPrice(item.total)}
        `;
        orderDetailsList.appendChild(orderItemElement);
    });
}

/**
 * Render cart items
 */
function renderCartItems() {
    // Clear previous items but preserve empty message
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

/**
 * Validate checkout form
 * @returns {boolean} Form validation result
 */
function validateCheckoutForm() {
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
}

// ===============================
// Tab Filtering
// ===============================

/**
 * Filter items by category
 * @param {string} category - Category to filter by
 */
function filterItemsByCategory(category) {
    // Clear search
    searchInput.value = '';
    
    // Show loading indicator
    loadingIndicator.style.display = 'flex';
    
    // Hide no results message
    noResultsMessage.style.display = 'none';
    
    // Use setTimeout to allow UI to update before filtering
    setTimeout(() => {
        let visibleCount = 0;
        
        // Show/hide items based on category
        if (category === 'concept') {
            foodItems.forEach(item => {
                if (!item.classList.contains('standard-item') && 
                    !item.classList.contains('sale-item') && 
                    !item.classList.contains('boisson-chaude-item') && 
                    !item.classList.contains('boisson-fraiche-item')) {
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
        } else {
            // For any other categories, just hide all items
            foodItems.forEach(item => {
                item.style.display = 'none';
            });
        }
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        // Show no results message if needed
        if (visibleCount === 0) {
            noResultsMessage.style.display = 'flex';
        }
    }, 300); // Small delay to show loading indicator
}

/**
 * Update scroll indicators visibility
 */
function updateScrollIndicators() {
    if (categoryTabs.scrollLeft > 10) {
        scrollLeft.style.opacity = '1';
    } else {
        scrollLeft.style.opacity = '0';
    }
    
    if (categoryTabs.scrollLeft + categoryTabs.clientWidth < categoryTabs.scrollWidth - 10) {
        scrollRight.style.opacity = '1';
    } else {
        scrollRight.style.opacity = '0';
    }
}

// ===============================
// Lazy Loading
// ===============================

/**
 * Set up lazy loading for images
 */
function setupLazyLoading() {
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
}

// ===============================
// Event Listeners
// ===============================

// When DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI based on cart state
    updateCartUI();
    
    // Fix category position
    updateCategoryPosition();
    
    // Set up lazy loading
    setupLazyLoading();
    
    // Initial check for scroll indicators
    updateScrollIndicators();
    
    // Load saved customer info from local storage
    fullNameInput.value = localStorage.getItem('customerName') || '';
    phoneNumberInput.value = localStorage.getItem('customerPhone') || '';
    
    // Format phone number on load
    if (phoneNumberInput.value) {
        phoneNumberInput.value = formatPhoneNumber(phoneNumberInput.value);
    }
    
    // Show welcome message on first visit
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            showToast('Bienvenue à Msemen Concept ! Découvrez nos délicieuses options.', 'info');
            localStorage.setItem('hasVisited', 'true');
        }, 1000);
    }
    
    // Initialize with Concept tab
    document.querySelector('.tab[data-category="concept"]').click();
});

// Window resize event - update positions
window.addEventListener('resize', debounce(() => {
    updateCategoryPosition();
    updateScrollIndicators();
}, 100));

// Food items click event with event delegation
foodItemsContainer.addEventListener('click', (e) => {
    // Find closest food-item parent if click happened on a child element
    const foodItem = e.target.closest('.food-item');
    
    // Skip if not a food item
    if (!foodItem) return;
    
    // Reset modal state first
    resetItemModal();
    
    // Get item data
    const name = foodItem.dataset.name;
    const price = foodItem.dataset.price;
    const description = foodItem.dataset.description;
    
    // Get the image src from the item with error handling
    const imageElement = foodItem.querySelector('.food-image');
    const imageSrc = imageElement ? imageElement.src : '';
    
    modalItemName.textContent = name;
    modalItemDescription.textContent = description;
    modalItemPrice.textContent = price;
    
    // Handle image loading
    handleModalImage(imageSrc, name);
    
    // Reset quantity
    currentQuantity = 1;
    quantityInput.value = currentQuantity;
    
    // Activate first preset button
    quantityPresetBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.quantity-preset[data-quantity="1"]').classList.add('active');
    
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
        showToast('Erreur de prix. Veuillez réessayer.', 'error');
        return; // Don't open modal if price is invalid
    }
    
    // Update quantity controls
    updateQuantityControls();
    
    // Add a small delay before opening the modal to ensure all calculations are complete
    setTimeout(() => {
        // Show modal
        openModal(itemModal);
    }, 50);
});

// Fix for Add to Cart Button - using addEventListener instead of onclick
addToCartBtn.addEventListener('click', function(e) {
    // Prevent multiple clicks
    e.preventDefault();
    
    // Add visual feedback
    addToCartBtn.classList.add('button-click');
    
    // Disable the button temporarily to prevent double-clicks
    addToCartBtn.disabled = true;
    
    // Check if in edit mode
    if (editMode) {
        updateItemInCart();
    } else {
        addItemToCart();
    }
    
    // Re-enable the button after a short delay
    setTimeout(() => {
        addToCartBtn.disabled = false;
        addToCartBtn.classList.remove('button-click');
    }, 500);
});

// Search functionality
searchInput.addEventListener('input', debounce(function() {
    searchItems(this.value);
}, 300));

// Clear search button
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    
    // Refilter to current category
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        const category = activeTab.dataset.category;
        filterItemsByCategory(category);
    }
});

// Category tabs click
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Filter items by category
        const category = tab.dataset.category;
        filterItemsByCategory(category);
    });
    
    // Keyboard access
    tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tab.click();
        }
    });
});

// Scroll indicators
scrollLeft.addEventListener('click', () => {
    categoryTabs.scrollBy({ left: -100, behavior: 'smooth' });
});

scrollRight.addEventListener('click', () => {
    categoryTabs.scrollBy({ left: 100, behavior: 'smooth' });
});

// Category tabs scroll
categoryTabs.addEventListener('scroll', debounce(updateScrollIndicators, 50));

// Quantity controls with improved handling
decreaseBtn.addEventListener('click', () => {
    if (currentQuantity > 1) {
        setQuantity(currentQuantity - 1);
    }
});

increaseBtn.addEventListener('click', () => {
    setQuantity(currentQuantity + 1);
});

// Direct quantity input handling
quantityInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 99) {
        value = 99;
    }
    
    setQuantity(value);
});

// Handle quantity preset buttons
quantityPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const quantity = parseInt(btn.dataset.quantity);
        setQuantity(quantity);
    });
});

// Cart management
viewCartBtn.addEventListener('click', () => {
    renderCartItems();
    openModal(basketModal);
});

emptyCartBtn.addEventListener('click', () => {
    if (cart.isEmpty()) {
        showToast('Votre panier est déjà vide', 'info');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        cart.clearCart();
        updateCartUI();
        renderCartItems();
        showToast('Panier vidé', 'info');
    }
});

// Fullscreen image
modalItemImage.addEventListener('click', () => {
    // Set the fullscreen image src to the current modal image
    fullscreenImage.src = modalItemImage.src;
    fullscreenImage.alt = modalItemImage.alt;
    
    // Show the fullscreen modal
    openModal(fullImageModal);
});

// Form inputs storage
fullNameInput.addEventListener('input', () => {
    fullNameFeedback.textContent = '';
    fullNameInput.classList.remove('error');
    
    localStorage.setItem('customerName', fullNameInput.value);
});

phoneNumberInput.addEventListener('input', () => {
    phoneNumberFeedback.textContent = '';
    phoneNumberInput.classList.remove('error');
    
    // Format phone number as user types
    const cursorPosition = phoneNumberInput.selectionStart;
    const unformattedValue = phoneNumberInput.value.replace(/\D/g, '');
    const formattedValue = formatPhoneNumber(unformattedValue);
    
    phoneNumberInput.value = formattedValue;
    localStorage.setItem('customerPhone', unformattedValue);
    
    // Attempt to restore cursor position after formatting
    if (phoneNumberInput === document.activeElement) {
        // Calculate new cursor position
        const newPosition = cursorPosition + (formattedValue.length - phoneNumberInput.value.length);
        phoneNumberInput.setSelectionRange(newPosition, newPosition);
    }
});

// Event delegation for cart item buttons
cartItemsList.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const removeBtn = e.target.closest('.remove-btn');
    
    if (editBtn) {
        const itemId = parseInt(editBtn.dataset.id);
        editCartItem(itemId);
    } else if (removeBtn) {
        const itemId = parseInt(removeBtn.dataset.id);
        if (confirm(`Êtes-vous sûr de vouloir supprimer cet article de votre panier ?`)) {
            removeCartItem(itemId);
        }
    }
});

// Checkout process
checkoutBtn.addEventListener('click', () => {
    // Validate form
    if (!validateCheckoutForm()) {
        showToast('Veuillez corriger les erreurs du formulaire', 'error');
        return;
    }
    
    if (cart.isEmpty()) {
        showToast('Votre panier est vide', 'error');
        return;
    }
    
    // Generate order details
    renderOrderConfirmation();
    
    // Hide basket modal and show confirmation modal
    closeModal(basketModal);
    openModal(confirmationModal);
});

// Submit order via WhatsApp
submitOrderBtn.addEventListener('click', () => {
    const name = fullNameInput.value.trim();
    const phone = phoneNumberInput.value.trim();
    
    // Generate WhatsApp message
    let message = `*Nouvelle commande depuis l'application Msemen Concept*\n\n`;
    message += `*Détails du client:*\n`;
    message += `Nom: ${name}\n`;
    message += `Téléphone: +212 ${formatPhoneNumber(phone)}\n\n`;
    message += `*Détails de la commande:*\n`;
    
    cart.getItems().forEach(item => {
        message += `- ${item.name} x${item.quantity} = ${formatPrice(item.total)}\n`;
    });
    
    message += `\n*Total: ${formatPrice(cart.getTotal())}*`;
    
    // Encode for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "+212614882875"; // This should be configurable
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Close modal and reset
    closeModal(confirmationModal);
    showToast('Commande envoyée par WhatsApp!', 'success');
    
    // Clear cart
    cart.clearCart();
    updateCartUI();
});

// Modal close buttons
closeItemModalBtn.addEventListener('click', () => {
    closeModal(itemModal);
    resetItemModal();
});

closeBasketBtn.addEventListener('click', () => {
    closeModal(basketModal);
});

closeConfirmationBtn.addEventListener('click', () => {
    closeModal(confirmationModal);
});

closeFullImageModalBtn.addEventListener('click', () => {
    closeModal(fullImageModal);
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === itemModal) {
        closeModal(itemModal);
        resetItemModal();
    }
    if (e.target === basketModal) {
        closeModal(basketModal);
    }
    if (e.target === confirmationModal) {
        closeModal(confirmationModal);
    }
    if (e.target === fullImageModal) {
        closeModal(fullImageModal);
    }
});

// Back to top button
window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 200) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}, 50));

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        if (fullImageModal.style.display === 'flex') {
            closeModal(fullImageModal);
        } else if (itemModal.style.display === 'flex') {
            closeModal(itemModal);
            resetItemModal();
        } else if (basketModal.style.display === 'flex') {
            closeModal(basketModal);
        } else if (confirmationModal.style.display === 'flex') {
            closeModal(confirmationModal);
        }
    }
    
    // CTRL+B to view cart
    if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (!cart.isEmpty()) {
            renderCartItems();
            openModal(basketModal);
        } else {
            showToast('Votre panier est vide', 'info');
        }
    }
    
    // CTRL+F to focus search
    if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        searchInput.focus();
    }
});

// Get the fullscreen image container
const fullscreenImageContainer = document.querySelector('.fullscreen-image-container');

// Add click event listener to close the fullscreen image when clicking anywhere in the container
if (fullscreenImageContainer) {
    fullscreenImageContainer.addEventListener('click', (e) => {
        // Only close if the click is not on the close button
        if (!e.target.closest('.fullscreen-close-btn')) {
            closeModal(fullImageModal);
        }
        // Stop propagation to prevent triggering multiple close events
        e.stopPropagation();
    });
}

// Prevent the image itself from closing the modal when dragging/interacting with it
document.getElementById('fullscreen-image').addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal(fullImageModal);
});
