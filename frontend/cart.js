// Cart Management System
class CartManager {
    constructor() {
        this.cartKey = 'game_cart_items';
        this.cartItems = this.getCartItems();
        this.cartItemsContainer = document.getElementById('cart-items');
        this.cartTotalElement = document.getElementById('cart-total-price');
        this.checkoutBtn = document.getElementById('checkout-btn');
        this.checkoutModal = document.getElementById('checkout-modal');
        this.closeModalBtn = document.querySelector('.close-modal');
        this.checkoutForm = document.getElementById('checkout-form');

        this.initEventListeners();
        this.renderCart();
    }

    initEventListeners() {
        // Checkout button opens modal
        this.checkoutBtn.addEventListener('click', () => {
            this.checkoutModal.style.display = 'block';
        });

        // Close modal button
        this.closeModalBtn.addEventListener('click', () => {
            this.checkoutModal.style.display = 'none';
        });

        // Close modal when clicking outside
        this.checkoutModal.addEventListener('click', (e) => {
            if (e.target === this.checkoutModal) {
                this.checkoutModal.style.display = 'none';
            }
        });

        // Checkout form submission
        this.checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processCheckout();
        });
    }

    getCartItems() {
        return JSON.parse(localStorage.getItem(this.cartKey)) || [];
    }

    saveCartItems() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cartItems));
    }

    addToCart(game) {
        // Check if game already in cart
        const existingGame = this.cartItems.find(item => item.id === game.id);
        
        if (!existingGame) {
            this.cartItems.push(game);
            this.saveCartItems();
            this.renderCart();
            this.showNotification(`${game.name} added to cart`);
        }
    }

    removeFromCart(gameId) {
        this.cartItems = this.cartItems.filter(item => item.id !== gameId);
        this.saveCartItems();
        this.renderCart();
        this.showNotification('Game removed from cart');
    }

    renderCart() {
        // Clear existing cart items
        this.cartItemsContainer.innerHTML = '';

        // If cart is empty
        if (this.cartItems.length === 0) {
            this.cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="Home.html" class="btn">Browse Games</a>
                </div>
            `;
            this.cartTotalElement.textContent = '$0.00';
            return;
        }

        // Render cart items
        let totalPrice = 0;
        this.cartItems.forEach(game => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${game.image}" alt="${game.name}">
                <div class="cart-item-details">
                    <h3>${game.name}</h3>
                    <p class="cart-item-price">$${game.price.toFixed(2)}</p>
                </div>
                <button class="cart-item-remove" data-id="${game.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            // Add remove event listener
            cartItemElement.querySelector('.cart-item-remove').addEventListener('click', () => {
                this.removeFromCart(game.id);
            });

            this.cartItemsContainer.appendChild(cartItemElement);
            totalPrice += game.price;
        });

        // Update total price
        this.cartTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }

    processCheckout() {
        // Validate form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const payment = document.getElementById('payment').value;

        if (!name || !email || !payment) {
            this.showNotification('Please fill all checkout details');
            return;
        }

        // Simulate checkout process
        alert(`Thank you ${name}! Your purchase is complete.`);
        
        // Clear cart
        this.cartItems = [];
        this.saveCartItems();
        this.renderCart();
        
        // Close modal
        this.checkoutModal.style.display = 'none';
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        document.body.appendChild(notification);

        // Show and auto-remove
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});