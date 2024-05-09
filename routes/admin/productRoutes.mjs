import express from 'express'
import { body, check } from 'express-validator'
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../../controllers/admin/productController.mjs'
import { checkAuth, checkAdmin } from '../../middleware/checkAuth.mjs'

const router = express.Router()

// Add a new product
router.post(
  '/add',
  [
    body('name').notEmpty(),
    body('category').notEmpty(),
    body('price').notEmpty(),
    body('availability').notEmpty().isBoolean(),
  ],
  checkAuth,
  checkAdmin,
  addProduct
)
router.patch(
  '/:pid',
  [
    body('name').notEmpty(),
    body('category').notEmpty(),
    body('price').notEmpty(),
    body('availability').notEmpty().isBoolean(),
  ],
  checkAuth,
  checkAdmin,
  updateProduct
)
// Get all products (with pagination)
router.get(
  '/products',
  [check('page', 'Invalid page number').isInt({ min: 1 })],
  checkAuth,
  checkAdmin,
  getAllProducts
)
// Get a product by ID
router.get('/:pid', checkAuth, checkAdmin, getProduct)

// Delete a product by ID
router.delete('/:pid', checkAuth, checkAdmin, deleteProduct)

export default router
