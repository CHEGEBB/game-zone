let cart = [];

const cartStyles = `
<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #050e2d;
        margin: 0;
        padding: 20px;
        color: #fff;
    }
    .cart-container {
        max-width: 800px;
        margin: 0 auto;
        background-color: #1b2141;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }
    .cart-container h2 {
        text-align: center;
        color: #fff;
        margin-bottom: 20px;
    }
    .cart-items {
        display: grid;
        gap: 15px;
    }
    .cart-item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ecf0f1;
        padding-bottom: 15px;
    }
    .cart-item img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        margin-right: 15px;
        border-radius: 8px;
    }
    .cart-item-details {
        flex-grow: 1;
    }
    .cart-item-details h4 {
        margin: 0 0 10px 0;
        color: #fff;
    }
    .quantity-control {
        display: flex;
        align-items: center;
        margin: 10px 0;
    }
    .quantity-control button {
        width: 30px;
        height: 30px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .quantity-control button:hover {
        background-color: #2980b9;
    }
    .quantity-control span {
        margin: 0 10px;
        font-weight: bold;
    }
    .remove-item {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .remove-item:hover {
        background-color: #c0392b;
    }
    .cart-summary {
        text-align: right;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 2px solid #ecf0f1;
    }
    .checkout-btn {
        background-color: #27ae60;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .checkout-btn:hover {
        background-color: #2ecc71;
    }
    @media (max-width: 600px) {
        .cart-container {
            padding: 10px;
        }
        .cart-item {
            flex-direction: column;
            text-align: center;
        }
        .cart-item img {
            margin-right: 0;
            margin-bottom: 10px;
        }
    }
</style>
`;
function getAuthToken() {
    return localStorage.getItem('authToken');
}

async function fetchFromAPI(endpoint, options = {}) {
    try {
        const response = await fetch("https://game-zone-62w0.onrender.com/api/cart", {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Load cart from backend
async function loadCartFromBackend() {
    try {
        const data = await fetchFromAPI('cart');
        cart = data.items || [];
        updateCartCount();
    } catch (error) {
        console.error('Error loading cart:', error);
        // Fallback to local storage if backend fails
        loadCartFromLocalStorage();
    }
}

// Add to Cart with Backend Integration
async function addToCart(game) {
    try {
        await fetchFromAPI('cart/add', {
            method: 'POST',
            body: JSON.stringify({
                gameId: game.id,
                quantity: 1
            })
        });
        
        await loadCartFromBackend();
    } catch (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local functionality
        const existingItem = cart.find(item => item.name === game.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: game.name,
                price: parseFloat(game.price.replace('$', '')),
                quantity: 1,
                image: game.image
            });
        }
        updateCartCount();
        saveCartToLocalStorage();
    }
}

// Update Cart Count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalQuantity;
}

// Local Storage Fallback Functions
function saveCartToLocalStorage() {
    localStorage.setItem('gameZoneCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('gameZoneCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Update Quantity with Backend Integration
async function updateQuantity(gameName, newQuantity) {
    try {
        await fetchFromAPI('cart/update', {
            method: 'PUT',
            body: JSON.stringify({
                gameId: gameName,
                quantity: newQuantity
            })
        });
        
        await loadCartFromBackend();
        createCartPage();
    } catch (error) {
        console.error('Error updating quantity:', error);
        // Fallback to local functionality
        const item = cart.find(item => item.name === gameName);
        if (item) {
            if (newQuantity > 0) {
                item.quantity = newQuantity;
            } else {
                cart = cart.filter(item => item.name !== gameName);
            }
            saveCartToLocalStorage();
            createCartPage();
        }
    }
}

// Remove Item with Backend Integration
async function removeItem(gameName) {
    try {
        await fetchFromAPI(`cart/remove/${gameName}`, {
            method: 'DELETE'
        });
        
        await loadCartFromBackend();
        createCartPage();
    } catch (error) {
        console.error('Error removing item:', error);
        // Fallback to local functionality
        cart = cart.filter(item => item.name !== gameName);
        saveCartToLocalStorage();
        createCartPage();
    }
}

// Create Cart Page
function createCartPage() {
    document.head.insertAdjacentHTML('beforeend', cartStyles);

    const cartContainer = document.createElement('div');
    cartContainer.classList.add('cart-container');
    
    const cartContent = cart.length === 0 
        ? '<h2>Your Cart</h2><p style="text-align: center; color: #7f8c8d;">Your cart is empty</p>'
        : `
            <h2>Your Cart</h2>
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>Price: $${item.price.toFixed(2)}</p>
                            <div class="quantity-control">
                                <button class="decrease-qty" data-name="${item.name}">-</button>
                                <span>${item.quantity}</span>
                                <button class="increase-qty" data-name="${item.name}">+</button>
                            </div>
                            <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                            <button class="remove-item" data-name="${item.name}">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <h3>Total: $${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
                <button class="checkout-btn">Proceed to Checkout</button>
            </div>
        `;

    cartContainer.innerHTML = cartContent;
    document.body.innerHTML = '';
    document.body.appendChild(cartContainer);

    addCartEventListeners();
}

// Add Event Listeners for Cart Interactions
function addCartEventListeners() {
    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', (e) => {
            const gameName = e.target.dataset.name;
            const item = cart.find(item => item.name === gameName);
            if (item) {
                updateQuantity(gameName, item.quantity - 1);
            }
        });
    });

    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', (e) => {
            const gameName = e.target.dataset.name;
            const item = cart.find(item => item.name === gameName);
            if (item) {
                updateQuantity(gameName, item.quantity + 1);
            }
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const gameName = e.target.dataset.name;
            removeItem(gameName);
        });
    });

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (cart.length > 0) {
                try {
                    await fetchFromAPI('cart/checkout', { method: 'POST' });
                    alert('Thank you for your purchase!');
                    cart = [];
                    saveCartToLocalStorage();
                    createCartPage();
                } catch (error) {
                    console.error('Checkout error:', error);
                    alert('Thank Your for your purchase 😊');
                }
            } else {
                alert('Your cart is empty!');
            }
        });
    }
}

// Initialize Add to Cart Buttons
function initializeAddToCartButtons() {
    document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const gameCard = e.target.closest('.game-card');
            const game = {
                id: gameCard.dataset.id,
                name: gameCard.querySelector('h4').textContent,
                price: gameCard.querySelector('.price').textContent,
                image: gameCard.querySelector('.card-header img').src
            };

            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            button.disabled = true;

            try {
                await addToCart(game);
                button.innerHTML = '<i class="fas fa-check"></i> Added';
            } catch (error) {
                console.error('Error adding to cart:', error);
                button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            }

            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        });
    });
}

// Initialize Cart Icon
function initializeCartIcon() {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', createCartPage);
    }
}

// Initialize Everything on Page Load
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromBackend().catch(() => loadCartFromLocalStorage());
    initializeAddToCartButtons();
    initializeCartIcon();
    
    // Your existing filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            gameCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = '';
                } else {
                    card.style.display = card.getAttribute('data-category') === category ? '' : 'none';
                }
            });
        });
    });

    // Your existing preview/demo functionality
    gameCards.forEach(card => {
        const demoBtn = card.querySelector('.demo-btn');
        const cardImage = card.querySelector('.card-header img');
        const previewBtn = card.querySelector('.preview-btn');
        
        if (demoBtn && cardImage && previewBtn) {
            demoBtn.addEventListener('click', () => {
                const videoSrc = previewBtn.getAttribute('data-video');
                
                if (videoSrc) {
                    const videoElement = document.createElement('video');
                    videoElement.src = videoSrc;
                    videoElement.autoplay = true;
                    videoElement.loop = true;
                    videoElement.muted = true;
                    videoElement.style.width = '100%';
                    videoElement.style.height = '100%';
                    videoElement.style.objectFit = 'cover';
                    
                    cardImage.replaceWith(videoElement);
                    
                    videoElement.addEventListener('click', () => {
                        videoElement.replaceWith(cardImage);
                    });
                }
            });
        }
    });

    // Preview Modal Functionality
    const previewButtons = document.querySelectorAll('.preview-btn');
    const previewModal = document.getElementById('previewModal');
    const previewVideo = document.getElementById('previewVideo');
    const closeModal = document.querySelector('.close-modal');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoSrc = button.getAttribute('data-video');
            previewVideo.src = videoSrc;
            previewModal.style.display = 'block';
        });
    });

    closeModal?.addEventListener('click', () => {
        previewVideo.pause();
        previewVideo.currentTime = 0;
        previewModal.style.display = 'none';
    });

    previewModal?.addEventListener('click', (event) => {
        if (event.target === previewModal) {
            previewVideo.pause();
            previewVideo.currentTime = previewVideo.currentTime = 0;
            previewModal.style.display = 'none';
        }
    });
    window.addEventListener('unhandledrejection', event => {
        console.error('Unhandled promise rejection:', event.reason);
        if (event.reason.message.includes('API call failed')) {
            loadCartFromLocalStorage();
        }
    });
});

async function handleAPIError(error, fallbackFunction) {
    console.error('API Error:', error);
    if (typeof fallbackFunction === 'function') {
        await fallbackFunction();
    }
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #e74c3c;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeOut 3s forwards;
    `;
    errorDiv.textContent = 'There was an error connecting to the server. Using offline mode.';
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

window.handleAPIError = handleAPIError;

document.addEventListener('keydown', (event) => {
    const previewModal = document.getElementById('previewModal');
    const previewVideo = document.getElementById('previewVideo');
    
    if (event.key === 'Escape' && previewModal && previewModal.style.display === 'block') {
        previewVideo.pause();
        previewVideo.currentTime = 0;
        previewModal.style.display = 'none';
    }
});
window.addEventListener('online', () => {
    console.log('Back online, syncing cart...');
    loadCartFromBackend().catch(error => {
        handleAPIError(error, loadCartFromLocalStorage);
    });
});

window.addEventListener('offline', () => {
    console.log('Gone offline, switching to local storage...');
    loadCartFromLocalStorage();
});

// Add touch events for mobile devices
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        const cartItem = evt.target.closest('.cart-item');
        if (cartItem && xDiff > 100) { 
            const gameName = cartItem.querySelector('.cart-item-details h4').textContent;
            removeItem(gameName);
        }
    }

    xDown = null;
    yDown = null;
}

// Progressive enhancement for modern browsers
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add support for web share API
if (navigator.share) {
    document.querySelectorAll('.share-btn').forEach(button => {
        button.style.display = 'block';
        button.addEventListener('click', async () => {
            const gameCard = button.closest('.game-card');
            const gameName = gameCard.querySelector('h4').textContent;
            const gamePrice = gameCard.querySelector('.price').textContent;
            
            try {
                await navigator.share({
                    title: gameName,
                    text: `Check out ${gameName} for ${gamePrice}!`,
                    url: window.location.href
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        });
    });
}

// Add support for native lazy loading
document.querySelectorAll('img').forEach(img => {
    if ('loading' in HTMLImageElement.prototype) {
        img.loading = 'lazy';
    }
});

// Cache cart data for offline use
if ('caches' in window) {
    caches.open('cart-cache').then(cache => {
        cache.add('/api/cart');
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeItem,
        updateQuantity,
        loadCartFromBackend,
        loadCartFromLocalStorage,
        createCartPage
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Add hamburger menu button if it doesn't exist
    const header = document.querySelector('header');
    if (!document.querySelector('.toggleMenu')) {
        const toggleMenu = document.createElement('div');
        toggleMenu.className = 'toggleMenu';
        toggleMenu.innerHTML = '<i class="fas fa-bars"></i>';
        header.appendChild(toggleMenu);
    }

    const toggleMenu = document.querySelector('.toggleMenu');
    const nav = document.querySelector('.nav');
    
    // Toggle menu function
    function toggleNav() {
        nav.classList.toggle('active');
        const icon = toggleMenu.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
    
    // Event listeners
    toggleMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleNav();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !toggleMenu.contains(e.target)) {
            nav.classList.remove('active');
            const icon = toggleMenu.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = toggleMenu.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
        });
    });

    // Handle cart count
    const cartCount = document.querySelector('.cart-count');
    const cartIcon = document.querySelector('.cart-icon');
    
    cartIcon.addEventListener('click', function() {
        // Add your cart functionality here
        console.log('Cart clicked');
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            nav.classList.remove('active');
            const icon = toggleMenu.querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
});