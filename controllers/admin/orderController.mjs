import asyncHandler from 'express-async-handler';
import Order from '../../models/order.mjs';

// Get all orders 
const getOrders = asyncHandler(async (req, res) => {
  try {

    // Find all orders
    const orders = await Order.find({});

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


//update user order to paid
const updateOrderPaid = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the isPaid status based on the request body
    if (req.body.isPaid !== undefined) {
      order.isPaid = req.body.isPaid;
    }

    const updatedOrder = await order.save();

    res.status(200).json({ message: 'Order updated', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order delivery status
const updateOrderDelivered = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the isDelivered status based on the request body
    if (req.body.isDelivered !== undefined) {
      order.isDelivered = req.body.isDelivered;
    }

    const updatedOrder = await order.save();

    res.status(200).json({ message: 'Order delivery status updated', order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


export { getOrders, updateOrderPaid, updateOrderDelivered };
