import mongoose from 'mongoose';


const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product', // Reference to the Product model
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      country: { type: String, required: true },
      wilaya: { type: String, required: true },
      commune: { type: String, required: true },
      address: { type: String, required: true }, 
      phone: { type: String, required: true },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date, 
    },
  },
  {
    timestamps: true, 
  }
);


const Order = mongoose.model('Order', orderSchema);

export default Order;
