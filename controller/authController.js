import bcrypt from 'bcryptjs'; // Password ko securely hash karne ke liye bcrypt use hota hai.
import jwt from 'jsonwebtoken'; // JSON Web Token (JWT) generate aur verify karne ke liye use hota hai.
import User from '../models/User.js'; // User ka Mongoose model import kiya.

export const renderSignUp = (req, res) => {
  res.render('sign-up'); // Sign-up page ko render karne ke liye EJS template use kiya.
};

export const handleSignUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body; // Request body se user inputs extract kiye.

  if (password !== confirmPassword) {
    // Agar password aur confirm password match nahi kare, to error dikhaye.
    return res.render('sign-up', { error: 'Passwords do not match!' });
  }

  try {
    // Naya user create kar ke MongoDB mein save karte hain.
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.redirect('/signin'); // Save hone ke baad user ko sign-in page pe redirect karte hain.
  } catch (err) {
    // Agar email already exist kare, to error message dikhaye.
    res.render('sign-up', { error: 'User already exists!' });
  }
};

export const renderSignIn = (req, res) => {
  res.render('sign-in'); // Sign-in page ko render karne ke liye EJS template use kiya.
};

export const handleSignIn = async (req, res) => {
  const { email, password } = req.body; // Request body se email aur password extract kiya.

  try {
    const user = await User.findOne({ email }); // Database se user ko email ke basis pe search kiya.

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Agar user exist na kare ya password galat ho, to error dikhaye.
      return res.render('sign-in', { error: 'Invalid email or password!' });
    }

    // JWT token generate kiya aur user ki information token ke andar store ki.
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Token ko HTTP-only cookie mein set kiya (security ke liye HTTP-only cookie use karte hain).
    res.cookie('token', token, { httpOnly: true });

    // Agar login successful ho, to dashboard pe redirect kare.
    res.redirect('/dashboard');
  } catch (err) {
    // Agar kuch galat ho, to error message dikhaye.
    res.render('sign-in', { error: 'Something went wrong!' });
  }
};

export const renderDashboard = (req, res) => {
  const token = req.cookies.token; // Cookies se JWT token extract kiya.

  if (!token) return res.redirect('/signin'); // Agar token na ho, to user ko sign-in page pe redirect kare.

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token ko verify karke user ki information decode ki.
    res.render('dashboard', { user: decoded }); // Dashboard render kiya aur user ki information pass ki.
  } catch (err) {
    // Agar token invalid ya expire ho, to user ko sign-in page pe redirect kare.
    res.redirect('/signin');
  }
};
