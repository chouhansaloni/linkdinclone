import mongoose from 'mongoose'; // Mongoose library ko import kiya, jo MongoDB ke saath kaam karne ke liye use hota hai.
import bcrypt from 'bcryptjs'; // Bcrypt library import kiya, jo password hashing ke liye use hota hai.

// User ka schema define kiya.
const UserSchema = new mongoose.Schema({
  name: { 
    type: String, // Name ka data type String rakha.
    required: true // Name field mandatory hai.
  },
  email: { 
    type: String, // Email ka data type String rakha.
    required: true, // Email field mandatory hai.
    unique: true // Email unique hona chahiye, duplicate allowed nahi hai.
  },
  password: {
    type: String, // Password ka data type String rakha.
    required: true // Password field mandatory hai.
  },
});

// Save operation ke pehle password ko hash karte hain.
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Agar password modify kiya gaya hai, tabhi hash karo.
    this.password = await bcrypt.hash(this.password, 10); // Password ko hash karte hain, 10 rounds ke saath.
  }
  next(); // Next middleware ya operation ko call karte hain.
});

// User schema ko Mongoose model mein convert karke export kiya.
export default mongoose.model('User', UserSchema); // UserSchema ka naam "User" rakha.
