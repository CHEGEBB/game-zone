import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart 
} from '../controllers/cart.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateQuantity);
router.delete('/remove/:gameId', removeFromCart);
router.delete('/clear', clearCart);

export default router;