import Product from '../models/product.mjs';
import { validationResult } from 'express-validator';
import Order from '../models/order.mjs';



const getAllProducts = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 10;
    const page = parseInt(req.query.page) || 1;
    const keyword = req.query.keyword || ''; 

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const skip = (page - 1) * ITEMS_PER_PAGE;

    const filter = {
      name: {
        $regex: keyword,
        $options: 'i',
      },
    };

    const products = await Product.find(filter)
      .skip(skip)
      .limit(ITEMS_PER_PAGE);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getProduct = async (req, res) => {
  try {
    const productId = req.params.pid;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMostOrderedProducts = async (req, res) => {
  try {
    const ITEMS_PER_PAGE = 10;
    const page = parseInt(req.query.page) || 1;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Count the number of times each product has been ordered.
    const productOrderCounts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          count: { $sum: '$orderItems.qty' },
        },
      },
    ]);

    // Sort products by order count in descending order.
    productOrderCounts.sort((a, b) => b.count - a.count);

    // Apply pagination and get most ordered products.
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const mostOrderedProducts = await Product.find({
      _id: { $in: productOrderCounts.map((item) => item._id) },
    })
      .skip(skip)
      .limit(ITEMS_PER_PAGE);

    const totalProducts = productOrderCounts.length;

    res.status(200).json({
      products: mostOrderedProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getAllProducts, getProduct, getMostOrderedProducts };
