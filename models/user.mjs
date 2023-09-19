import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Possible values
    default: 'user', // Default value
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordTokenExpiry: Date,
});



const User = mongoose.model('User', userSchema);

export default User;
