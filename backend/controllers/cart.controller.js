// controllers/cart.controller.js
import Cart from '../models/cart.model.js';
import Game from '../models/game.model.js';

// Get cart items for a user
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const cart = await Cart.findOne({ userId }).populate('items.gameId');
    
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { gameId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => 
      item.gameId.toString() === gameId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ gameId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.gameId');
    
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// Update cart item quantity
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { gameId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => 
      item.gameId.toString() === gameId.toString()
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => 
        item.gameId.toString() !== gameId.toString()
      );
    } else {
      cartItem.quantity = quantity;
    }

    await cart.save();
    const populatedCart = await cart.populate('items.gameId');
    
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity', error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { gameId } = req.params;

    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => 
      item.gameId.toString() !== gameId.toString()
    );

    await cart.save();
    const populatedCart = await cart.populate('items.gameId');
    
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item', error: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};