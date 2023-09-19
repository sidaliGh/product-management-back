import express from 'express';
import { getAllProducts, getMostOrderedProducts, getProduct } from '../controllers/productController.mjs';

const router = express.Router();

// GET all products 
router.get('/products', getAllProducts);

// GET most ordered products
router.get('/most-ordered', getMostOrderedProducts);

// GET a single product by ID
router.get('/:pid', getProduct);



export default router;
