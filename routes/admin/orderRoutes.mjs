import express from 'express';
import { getOrders, updateOrderPaid, updateOrderDelivered } from '../../controllers/admin/orderController.mjs';
import { checkAdmin, checkAuth } from '../../middleware/checkAuth.mjs';

const router = express.Router();

// Get all orders
router.get('/orders', checkAuth, checkAdmin, getOrders);

// Update order paid status
router.patch('/paid/:id', checkAuth, checkAdmin, updateOrderPaid);

// Update order delivery status
router.patch('/delivered/:id', checkAuth, checkAdmin, updateOrderDelivered);

export default router;
