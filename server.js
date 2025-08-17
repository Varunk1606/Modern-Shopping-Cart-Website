
const products = [
    {
        id: 1,
        name: "Apple (1KG)",
        price: 100,
        stock: 50,
        image: "img/apple.jpg",
        category: "fruits"
    },
    {
        id: 2,
        name: "Banana (1KG)",
        price: 80,
        stock: 45,
        image: "img/banana.png",
        category: "fruits"
    },
    {
        id: 3,
        name: "Milk (1L)",
        price: 60,
        stock: 30,
        image: "img/milk.jpg",
        category: "dairy"
    },
    {
        id: 4,
        name: "Bread (500g)",
        price: 40,
        stock: 25,
        image: "img/bread.webp",
        category: "bakery"
    },
    {
        id: 5,
        name: "Eggs (12 pieces)",
        price: 120,
        stock: 40,
        image: "img/eggs.webp",
        category: "dairy"
    },
    {
        id: 6,
        name: "Rice (2KG)",
        price: 150,
        stock: 35,
        image: "img/rice.webp",
        category: "grains"
    }
];

// Cart state
let cart = [];
let filteredProducts = [...products];

// DOM elements
const searchInput = document.getElementById('search');
const productGrid = document.querySelector('.grid');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const subtotalElement = document.querySelector('.subtotal');
const taxElement = document.querySelector('.tax');
const totalElement = document.querySelector('.total-amount');
const clearCartBtn = document.querySelector('.clear-cart');
const checkoutBtn = document.querySelector('.checkout-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartDisplay();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Cart actions
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', handleCheckout);
}

// Render products in the grid
function renderProducts() {
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="product-image">
            <img width="80px" height="80px" style="border-radius: 10px;" 
                 src="${product.image}" alt="${product.name}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTAiIGZpbGw9IiNGMUY1RjkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjOTRBM0I4Ij4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPgo8cGF0aCBkPSJNMTIgNkM5Ljc5IDYgOCA3Ljc5IDggMTBzMS43OSA0IDQgNCA0LTEuNzkgNC00LTEuNzktNC00LTR6bTAgNmMtMS4xIDAtMi0uOS0yLTJzLjktMiAyLTIgMiAuOSAyIDItLjkgMi0yIDJ6Ii8+Cjwvc3ZnPgo8L3N2Zz4='">
        </div>
                 <div class="product-name">
             <p>${product.name}</p>
             <div class="price">Price: ₹${product.price} Stock: ${product.stock}</div>
         </div>
        <button class="addbtn" onclick="addToCart(${product.id})" 
                ${product.stock === 0 ? 'disabled' : ''}>
            ${product.stock === 0 ? 'OUT OF STOCK' : 'ADD'}
        </button>
    `;
    return card;
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts();
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Maximum stock limit reached!', 'error');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (!item || !product) return;
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else if (newQuantity <= product.stock) {
        item.quantity = newQuantity;
        updateCartDisplay();
    } else {
        showNotification('Maximum stock limit reached!', 'error');
    }
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
    
    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <span>Add some products to get started!</span>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iOCIgZmlsbD0iI0YxRjVGNyIvPgo8c3ZnIHg9IjEyIiB5PSIxMiIgd2lkdGg9IjI2IiBoZWlnaHQ9IjI2IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5NEEzQjgiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnp6Ii8+CjxwYXRoIGQ9Ik0xMiA2QzkuNzkgNiA4IDcuNzkgOCAxMHMxLjc5IDQgNCA0IDQtMS43OSA0LTQtMS43OS00LTQtNHoiLz4KPC9zdmc+Cjwvc3ZnPg=='">
                                 <div class="cart-item-details">
                     <p class="cart-item-name">${item.name}</p>
                     <p class="cart-item-price">₹${item.price}</p>
                 </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove">×</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update summary
    updateCartSummary();
    
    // Update checkout button state
    checkoutBtn.disabled = cart.length === 0;
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
         subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
     taxElement.textContent = `₹${tax.toFixed(2)}`;
     totalElement.textContent = `₹${total.toFixed(2)}`;
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty!', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartDisplay();
        showNotification('Cart cleared successfully!', 'success');
    }
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1;
    const subtotal = total / 1.1;
    const tax = total - subtotal;
    
    // Generate receipt
    showReceipt(cart, subtotal, tax, total);
    
    // Clear cart after successful checkout
    cart = [];
    updateCartDisplay();
    showNotification('Order placed successfully!', 'success');
}

// Show receipt
function showReceipt(items, subtotal, tax, total) {
    // Remove existing receipt
    const existingReceipt = document.querySelector('.receipt-overlay');
    if (existingReceipt) {
        existingReceipt.remove();
    }
    
    // Create receipt overlay
    const receiptOverlay = document.createElement('div');
    receiptOverlay.className = 'receipt-overlay';
    
    // Generate receipt HTML
    const receiptHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <div class="receipt-logo">
                    <img src="img/grocery-logo.svg" alt="Logo" width="25">
                    <h2>Grocery Management System</h2>
                </div>
                <div class="receipt-info">
                    <p><strong>Bill #:</strong> ${generateReceiptNumber()}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
                </div>
            </div>
            
            <div class="receipt-divider"></div>
            
            <div class="receipt-items">
                ${items.map(item => `
                    <div class="receipt-item">
                        <div class="item-details">
                            <span class="item-name">${item.name}</span>
                            <span class="item-qty-price">${item.quantity} x ₹${item.price}</span>
                        </div>
                        <span class="item-total">₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="receipt-divider"></div>
            
            <div class="receipt-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>₹${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (10%):</span>
                    <span>₹${tax.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total Amount:</span>
                    <span>₹${total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="receipt-footer">
                <p>Thank you for shopping with us!</p>
                <p>Please visit again.</p>
            </div>
            
            <div class="receipt-actions">
                <button class="print-receipt" onclick="printReceipt()">Print Bill</button>
                <button class="close-receipt" onclick="closeReceipt()">Close</button>
            </div>
        </div>
    `;
    
    receiptOverlay.innerHTML = receiptHTML;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .receipt-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .receipt {
            background: white;
            border-radius: 8px;
            padding: 25px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
            font-family: 'Courier New', monospace;
        }
        
        .receipt-header {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .receipt-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .receipt-logo h2 {
            margin: 0;
            color: #0ea5e9;
            font-size: 1.1rem;
            font-weight: bold;
        }
        
        .receipt-info {
            font-size: 0.9rem;
            color: #64748b;
        }
        
        .receipt-info p {
            margin: 5px 0;
        }
        
        .receipt-divider {
            height: 1px;
            background: #000;
            margin: 15px 0;
        }
        
        .receipt-items {
            margin-bottom: 20px;
        }
        
        .receipt-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 8px 0;
            border-bottom: 1px dotted #e5e7eb;
        }
        
        .item-details {
            flex: 1;
        }
        
        .item-name {
            font-weight: bold;
            color: #1f2937;
            display: block;
            margin-bottom: 2px;
        }
        
        .item-qty-price {
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        .item-total {
            font-weight: bold;
            color: #1f2937;
            text-align: right;
            min-width: 80px;
        }
        
        .receipt-summary {
            margin-bottom: 20px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            font-size: 0.9rem;
        }
        
        .summary-row.total {
            font-weight: bold;
            font-size: 1rem;
            color: #000;
            border-top: 1px solid #000;
            padding-top: 8px;
            margin-top: 8px;
        }
        
        .receipt-footer {
            text-align: center;
            color: #000;
            font-size: 0.85rem;
            margin-bottom: 20px;
            font-weight: bold;
        }
        
        .receipt-footer p {
            margin: 5px 0;
        }
        
        .receipt-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        
        .print-receipt, .close-receipt {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .print-receipt {
            background: #0ea5e9;
            color: white;
        }
        
        .print-receipt:hover {
            background: #0284c7;
        }
        
        .close-receipt {
            background: #f1f5f9;
            color: #64748b;
            border: 1px solid #e2e8f0;
        }
        
        .close-receipt:hover {
            background: #e2e8f0;
            color: #475569;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @media print {
            .receipt-overlay {
                position: static;
                background: none;
            }
            
            .receipt {
                box-shadow: none;
                max-width: none;
                width: 100%;
            }
            
            .receipt-actions {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(receiptOverlay);
    
    // Close on overlay click
    receiptOverlay.addEventListener('click', function(e) {
        if (e.target === receiptOverlay) {
            closeReceipt();
        }
    });
}

// Generate receipt number
function generateReceiptNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RCP-${timestamp}-${random}`;
}

// Print receipt
function printReceipt() {
    window.print();
}

// Close receipt
function closeReceipt() {
    const receiptOverlay = document.querySelector('.receipt-overlay');
    if (receiptOverlay) {
        receiptOverlay.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#0ea5e9',
        warning: '#f59e0b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add close button styles
    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Global functions for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.handleCheckout = handleCheckout;
window.printReceipt = printReceipt;
window.closeReceipt = closeReceipt;
