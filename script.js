// Variables
let cartTotal = 0;
let currentQuantity = 1;
let currentItemPrice = 0;
let currentItemId = null;
let cartItems = [];
let editMode = false;
// Check for saved cart in local storage
const savedCart = localStorage.getItem('msemenCart');
if (savedCart) {
    try {
        cartItems = JSON.parse(savedCart);
        updateCartDisplay();
    } catch (e) {
        console.error('Error loading saved cart', e);
    }
}

// Create toast container
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

// Create loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'loading';
loadingIndicator.innerHTML = '<div class="loading-spinner"></div>';
document.querySelector('.food-items').appendChild(loadingIndicator);

// Create no results message
const noResultsMessage = document.createElement('div');
noResultsMessage.className = 'no-results';
noResultsMessage.textContent = 'Aucun article correspondant.';
document.querySelector('.food-items').appendChild(noResultsMessage);

// Create back to top button
const backToTopBtn = document.createElement('div');
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '↑';
backToTopBtn.title = 'Retour en haut';
document.body.appendChild(backToTopBtn);

// DOM Elements
const foodItems = document.querySelectorAll('.food-item');
const addButtons = document.querySelectorAll('.add-btn');
const itemModal = document.getElementById('itemModal');
const basketModal = document.getElementById('basketModal');
const confirmationModal = document.getElementById('confirmationModal');
const modalHeaderText = document.getElementById('modal-header-text');
const modalItemName = document.getElementById('modal-item-name');
const modalItemDescription = document.getElementById('modal-item-description');
const modalItemPrice = document.getElementById('modal-item-price');
const quantitySpan = document.getElementById('quantity');
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const addToCartBtn = document.getElementById('addToCart');
const cartTotalSpan = document.getElementById('cart-total');
const cartItemsCount = document.getElementById('cart-items-count');
const basketTotalSpan = document.getElementById('basketTotal');
const confirmationTotalSpan = document.getElementById('confirmationTotal');
const cartItemsList = document.getElementById('cartItemsList');
const orderDetailsList = document.getElementById('orderDetailsList');
const customerDetails = document.getElementById('customerDetails');
const tabs = document.querySelectorAll('.tab');
const viewCartBtn = document.getElementById('viewCart');
const emptyCartBtn = document.getElementById('emptyCart');
const checkoutBtn = document.getElementById('checkout');
const submitOrderBtn = document.getElementById('submitOrder');
const fullNameInput = document.getElementById('fullName');
const phoneNumberInput = document.getElementById('phoneNumber');
const closeItemModalBtn = document.getElementById('closeItemModal');
const closeBasketBtn = document.getElementById('closeBasket');
const closeConfirmationBtn = document.getElementById('closeConfirmation');

// Close modal buttons
closeItemModalBtn.addEventListener('click', () => {
    itemModal.style.display = 'none';
    resetItemModal();
});

closeBasketBtn.addEventListener('click', () => {
    basketModal.style.display = 'none';
});

closeConfirmationBtn.addEventListener('click', () => {
    confirmationModal.style.display = 'none';
});

// Reset item modal to default state
function resetItemModal() {
    modalHeaderText.textContent = 'Ajouter au panier';
    addToCartBtn.textContent = 'Ajouter au panier';
    currentItemId = null;
    editMode = false;
    currentQuantity = 1;
    quantitySpan.textContent = currentQuantity;
    
    // Reset addToCartBtn function
    addToCartBtn.onclick = addItemToCart;
    
    // Enable/disable decrease button based on quantity
    updateQuantityControls();
}

// Update decrease button state based on current quantity
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

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Tab filtering functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        
        // Hide no results message
        noResultsMessage.style.display = 'none';
        
        setTimeout(() => {
            const category = tab.dataset.category;
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
                noResultsMessage.style.display = 'block';
            }
        }, 300); // Small delay to show loading indicator
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === itemModal) {
        itemModal.style.display = 'none';
        resetItemModal();
    }
    if (e.target === basketModal) {
        basketModal.style.display = 'none';
    }
    if (e.target === confirmationModal) {
        confirmationModal.style.display = 'none';
    }
});

// Quantity control
decreaseBtn.addEventListener('click', () => {
    if (currentQuantity > 1) {
        currentQuantity--;
        quantitySpan.textContent = currentQuantity;
        updateQuantityControls();
    }
});

increaseBtn.addEventListener('click', () => {
    currentQuantity++;
    quantitySpan.textContent = currentQuantity;
    updateQuantityControls();
});

// Add to cart function
function addItemToCart() {
    const name = modalItemName.textContent;
    const price = currentItemPrice;
    const totalForItem = price * currentQuantity;
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += currentQuantity;
        cartItems[existingItemIndex].total = cartItems[existingItemIndex].quantity * price;
        showToast(`Ajouté ${currentQuantity} ${name} de plus au panier`, 'success');
    } else {
        // Add new item to cart
        cartItems.push({
            id: Date.now(), // Unique ID for each item
            name: name,
            price: price,
            quantity: currentQuantity,
            total: totalForItem
        });
        showToast(`${name} ajouté au panier`, 'success');
    }
    
    // Save cart to local storage
    localStorage.setItem('msemenCart', JSON.stringify(cartItems));
    
    // Update cart display
    updateCartDisplay();
    
    // Add animation to cart button
    animateCartButton();
    
    // Close modal
    itemModal.style.display = 'none';
    resetItemModal();
}

// Animate cart button
function animateCartButton() {
    viewCartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        viewCartBtn.style.transform = 'scale(1)';
    }, 300);
}

// Set default onclick for addToCartBtn
addToCartBtn.onclick = addItemToCart;

// Update item in cart function
function updateItemInCart() {
    const item = cartItems.find(item => item.id === currentItemId);
    if (item) {
        const oldQuantity = item.quantity;
        item.quantity = currentQuantity;
        item.total = item.price * item.quantity;
        
        // Update cart display
        updateCartDisplay();
        
        // Save cart to local storage
        localStorage.setItem('msemenCart', JSON.stringify(cartItems));
        
        // Show toast message
        if (currentQuantity > oldQuantity) {
            showToast(`Quantité de ${item.name} augmentée à ${currentQuantity}`, 'info');
        } else if (currentQuantity < oldQuantity) {
            showToast(`Quantité de ${item.name} diminuée à ${currentQuantity}`, 'info');
        } else {
            showToast(`Quantité de ${item.name} inchangée`, 'info');
        }
        
        // Close item modal and show basket modal
        itemModal.style.display = 'none';
        basketModal.style.display = 'flex';
        
        // Reset modal
        resetItemModal();
    }
}

// View cart button
viewCartBtn.addEventListener('click', () => {
    renderCartItems();
    basketModal.style.display = 'flex';
});

// Empty cart
emptyCartBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
        showToast('Votre panier est déjà vide', 'info');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        cartItems = [];
        updateCartDisplay();
        renderCartItems();
        
        // Clear from local storage
        localStorage.removeItem('msemenCart');
        
        showToast('Panier vidé', 'info');
    }
});

// Checkout button
checkoutBtn.addEventListener('click', () => {
    // Validate form
    if (!fullNameInput.value.trim()) {
        showToast('Veuillez entrer votre nom complet', 'error');
        fullNameInput.focus();
        return;
    }
    
    if (!phoneNumberInput.value.trim()) {
        showToast('Veuillez entrer votre numéro de téléphone', 'error');
        phoneNumberInput.focus();
        return;
    }
    
    // Validate phone number format
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(phoneNumberInput.value.trim().replace(/\s/g, ''))) {
        showToast('Veuillez entrer un numéro de téléphone valide', 'error');
        phoneNumberInput.focus();
        return;
    }
    
    if (cartItems.length === 0) {
        showToast('Votre panier est vide', 'error');
        return;
    }
    
    // Generate order details
    renderOrderConfirmation();
    
    // Hide basket modal and show confirmation modal
    basketModal.style.display = 'none';
    confirmationModal.style.display = 'flex';
});

// Submit order via WhatsApp
submitOrderBtn.addEventListener('click', () => {
    const name = fullNameInput.value.trim();
    const phone = phoneNumberInput.value.trim();
    
    // Generate WhatsApp message
    let message = `*Nouvelle commande depuis l'application Msemen Concept*\n\n`;
    message += `*Détails du client:*\n`;
    message += `Nom: ${name}\n`;
    message += `Téléphone: ${phone}\n\n`;
    message += `*Détails de la commande:*\n`;
    
    cartItems.forEach(item => {
        message += `- ${item.name} x${item.quantity} = ${item.total.toFixed(2)}DH\n`;
    });
    
    message += `\n*Total: ${cartTotal.toFixed(2)}DH*`;
    
    // Encode for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+212600000000?text=${encodedMessage}`; // Replace with actual number
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Close modal and reset
    confirmationModal.style.display = 'none';
    showToast('Commande envoyée par WhatsApp!', 'success');
    
    // Clear cart
    cartItems = [];
    updateCartDisplay();
    localStorage.removeItem('msemenCart');
});

// Function to update cart display with total and count
function updateCartDisplay() {
    cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    cartTotalSpan.textContent = cartTotal.toFixed(2) + 'DH';
    cartItemsCount.textContent = itemCount;
    basketTotalSpan.textContent = cartTotal.toFixed(2) + 'DH';
    confirmationTotalSpan.textContent = cartTotal.toFixed(2) + 'DH';
    
    // Update the cart button visibility
    if (itemCount > 0) {
        viewCartBtn.style.animation = 'pulse 2s infinite';
    } else {
        viewCartBtn.style.animation = 'none';
    }
}

// Function to edit cart item
function editCartItem(itemId) {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;
    
    // Set current item details
    modalHeaderText.textContent = 'Modifier l\'article';
    modalItemName.textContent = item.name;
    modalItemDescription.textContent = '';
    modalItemPrice.textContent = item.price.toFixed(2) + 'DH';
    currentQuantity = item.quantity;
    quantitySpan.textContent = currentQuantity;
    currentItemPrice = item.price;
    currentItemId = itemId;
    editMode = true;
    
    // Change button text
    addToCartBtn.textContent = 'Mettre à jour';
    
    // Override add to cart button functionality
    addToCartBtn.onclick = updateItemInCart;
    
    // Update quantity controls
    updateQuantityControls();
    
    // Show modal
    basketModal.style.display = 'none';
    itemModal.style.display = 'flex';
}

// Function to remove cart item
function removeCartItem(itemId) {
    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${item.name} de votre panier ?`)) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        updateCartDisplay();
        renderCartItems();
        
        // Save cart to local storage
        localStorage.setItem('msemenCart', JSON.stringify(cartItems));
        
        showToast(`${item.name} supprimé du panier`, 'info');
    }
}

// Function to render order confirmation
function renderOrderConfirmation() {
    orderDetailsList.innerHTML = '';
    customerDetails.innerHTML = '';
    
    // Add customer details
    customerDetails.innerHTML = `
        <p><strong>Nom du client:</strong> ${fullNameInput.value}</p>
        <p><strong>Numéro de téléphone:</strong> ${phoneNumberInput.value}</p>
    `;
    
    // Add order details
    cartItems.forEach(item => {
        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'order-item';
        orderItemElement.innerHTML = `
            ${item.name} x${item.quantity} = ${item.total.toFixed(2)}DH
        `;
        orderDetailsList.appendChild(orderItemElement);
    });
}

// Function to render cart items
function renderCartItems() {
    cartItemsList.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<div class="empty-cart-message">Votre panier est vide</div>';
        return;
    }
    
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price.toFixed(2)}DH × ${item.quantity} = ${item.total.toFixed(2)}DH</div>
            </div>
            <div class="item-controls">
                <button class="edit-btn" data-id="${item.id}" title="Modifier">✏️</button>
                <button class="remove-btn" data-id="${item.id}" title="Supprimer">🗑️</button>
            </div>
        `;
        cartItemsList.appendChild(cartItemElement);
    });
    
    // Add event listeners to edit and remove buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            editCartItem(itemId);
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.dataset.id);
            removeCartItem(itemId);
        });
    });
}

// Back to top button functionality
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Make food items clickable to open modal
foodItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Ignore if clicking on a button
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }
        
        const name = item.dataset.name;
        const price = item.dataset.price;
        const description = item.dataset.description;
        
        modalItemName.textContent = name;
        modalItemDescription.textContent = description;
        modalItemPrice.textContent = price;
        
        // Reset quantity
        currentQuantity = 1;
        quantitySpan.textContent = currentQuantity;
        
        // Set current item price for calculations
        currentItemPrice = parseFloat(price.replace('DH', ''));
        
        // Update quantity controls
        updateQuantityControls();
        
        // Show modal
        itemModal.style.display = 'flex';
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        if (itemModal.style.display === 'flex') {
            itemModal.style.display = 'none';
            resetItemModal();
        } else if (basketModal.style.display === 'flex') {
            basketModal.style.display = 'none';
        } else if (confirmationModal.style.display === 'flex') {
            confirmationModal.style.display = 'none';
        }
    }
    
    // CTRL+B to view cart
    if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (cartItems.length > 0) {
            renderCartItems();
            basketModal.style.display = 'flex';
        } else {
            showToast('Votre panier est vide', 'info');
        }
    }
});

// Save form info in local storage
fullNameInput.value = localStorage.getItem('customerName') || '';
phoneNumberInput.value = localStorage.getItem('customerPhone') || '';

fullNameInput.addEventListener('change', () => {
    localStorage.setItem('customerName', fullNameInput.value);
});

phoneNumberInput.addEventListener('change', () => {
    localStorage.setItem('customerPhone', phoneNumberInput.value);
});

// Initialize the view with the 'Concept' tab selected
document.querySelector('.tab[data-category="concept"]').click();

// Show welcome message on first visit
if (!localStorage.getItem('hasVisited')) {
    setTimeout(() => {
        showToast('Bienvenue à Msemen Concept ! Découvrez nos délicieuses options.', 'info');
        localStorage.setItem('hasVisited', 'true');
    }, 1000);
}

// Add scroll indicators for category tabs
const categoryTabs = document.querySelector('.category-tabs');
const scrollIndicatorLeft = document.querySelector('.scroll-indicator-left');
const scrollIndicatorRight = document.querySelector('.scroll-indicator-right');

// Function to check scroll position and show/hide indicators
function updateScrollIndicators() {
    if (categoryTabs.scrollLeft > 10) {
        scrollIndicatorLeft.style.opacity = '1';
    } else {
        scrollIndicatorLeft.style.opacity = '0';
    }
    
    if (categoryTabs.scrollLeft + categoryTabs.clientWidth < categoryTabs.scrollWidth - 10) {
        scrollIndicatorRight.style.opacity = '1';
    } else {
        scrollIndicatorRight.style.opacity = '0';
    }
}

// Initial check
updateScrollIndicators();

// Update on scroll
categoryTabs.addEventListener('scroll', updateScrollIndicators);

// Add scroll buttons functionality
scrollIndicatorLeft.addEventListener('click', () => {
    categoryTabs.scrollBy({ left: -100, behavior: 'smooth' });
});

scrollIndicatorRight.addEventListener('click', () => {
    categoryTabs.scrollBy({ left: 100, behavior: 'smooth' });
});

// Improve accessibility - make tabs navigable by keyboard
tabs.forEach(tab => {
    tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tab.click();
        }
    });
});

// Add pulse animation for the cart button
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(style);
