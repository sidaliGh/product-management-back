import express from 'express';
import { addOrderItems, getMyOrder, getMyOrders } from '../controllers/orderController.mjs';
import {checkAuth} from '../middleware/checkAuth.mjs';

const router = express.Router();


router.post('/add', checkAuth, addOrderItems);
router.get('/myorders', checkAuth, getMyOrders);
router.get('/:id', checkAuth, getMyOrder);

export default router;
