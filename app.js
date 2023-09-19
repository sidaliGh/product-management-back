import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes.mjs';
import productRoutes from './routes/productRoutes.mjs';
import orderRoutes from './routes/orderRoutes.mjs';
import adminProductRoutes from './routes/admin/productRoutes.mjs'
import adminOrderRoutes from './routes/admin/orderRoutes.mjs'
import dotenv from 'dotenv';
import connectDB from './config/db.mjs'; 

const app = express();

// Load environment variables from the .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);

//Admin Routes
app.use('/api/admin/product', adminProductRoutes)
app.use('/api/admin/order', adminOrderRoutes)

// Start the server on port 5000
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app //for test
