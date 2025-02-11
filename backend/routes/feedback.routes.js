import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json({ message: "Feedback route working" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;