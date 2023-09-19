import Product from '../../models/product.mjs';
import { validationResult } from 'express-validator';

const addProduct = async (req, res) => {
  try {
    // Create a new product
    const { name, category, price, availability } = req.body;
    const product = new Product({
      name,
      category,
      price,
      availability,
      user: req.user.id, // Reference to the admin user
    });

    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    // Check if the product exists
    const product = await Product.findById(productId).populate(
      'user',
      'name email'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' })
  }
}

const getAllProducts = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 10 // Number of products per page

    // Get the current page from the query parameters, default to 1 if not provided
    const page = parseInt(req.query.page) || 1

    // Validate request query
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Calculate the number of products to skip based on the page number
    const skip = (page - 1) * ITEMS_PER_PAGE

    // Query the database for products with pagination
    const products = await Product.find()
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .populate('user', 'name email') // Populate the user field with name and email

    // Get the total count of products (for pagination)
    const totalProducts = await Product.countDocuments()

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update a product
const updateProduct = async (req, res) => {
  try {
    // Validate request body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Extract product ID from the request parameters
    const productId = req.params.pid

    // Find the product by ID
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Update the product fields based on the request body
    if (req.body.name) {
      product.name = req.body.name
    }
    if (req.body.category) {
      product.category = req.body.category
    }
    if (req.body.price) {
      product.price = req.body.price
    }
    if (req.body.availability) {
      product.availability = req.body.availability
    }

    // Set the lastUpdatedBy field with the user ID of the admin
    product.lastUpdatedBy = req.user._id

    // Save the updated product
    await product.save()

    res.status(200).json({ message: 'Product updated successfully', product })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' })
    }

    // Find the product by ID and delete it
    const productId = req.params.pid
    const product = await Product.findOneAndDelete({ _id: productId })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

export { addProduct, getProduct, getAllProducts, updateProduct, deleteProduct }
