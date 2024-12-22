import express from 'express';
import {renderSignUp,handleSignUp,renderSignIn,handleSignIn,renderDashboard,} from '../controller/authController.js';

const router = express.Router();

// Sign-Up Routes
router.get('/signup', renderSignUp);
router.post('/signup', handleSignUp);

// Sign-In Routes
router.get('/signin', renderSignIn);
router.post('/signin', handleSignIn);

// Dashboard Route
router.get('/dashboard', renderDashboard);

export default router;
