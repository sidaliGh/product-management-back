import asyncHandler from 'express-async-handler'
import Order from '../models/order.mjs'

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, shippingPrice, totalPrice } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

const getMyOrders = async (req, res) => {
  try {
    // Get the user ID from the request
    const userId = req.user._id

    // Query the database for orders belonging to the user
    const orders = await Order.find({ user: userId })

    res.status(200).json({ orders })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get a specific order from the user's orders by ID
const getMyOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id

  // Find the order by ID and user
  const order = await Order.findOne({ _id: orderId, user: req.user._id })

  if (!order) {
    return res.status(404).json({ message: 'Order not found' })
  }

  res.status(200).json({ order })
})

export { addOrderItems, getMyOrders, getMyOrder }
