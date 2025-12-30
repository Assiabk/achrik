// api/stats.js
import express from 'express';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { verifyToken } from '../middlewares/verifyToken.js'; // adjust path if needed

const router = express.Router();

// GET all users (Admin only)
router.get('/users', verifyToken, async (req, res) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }
  try {
    const users = await User.find({}, '_id name email phone createdAt');
    res.json({ success: true, users });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

// GET all admins (Admin only)
router.get('/admins', verifyToken, async (req, res) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }
  try {
    const admins = await Admin.find({}, '_id name email role createdAt');
    res.json({ success: true, admins });
  } catch (error) {
    console.error('❌ Error fetching admins:', error);
    res.status(500).json({ success: false, message: 'Error fetching admins' });
  }
});

// Simple stats endpoint
router.get('/simple', verifyToken, async (req, res) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized access' });
  }
  try {
    const [totalUsers, totalAdmins] = await Promise.all([
      User.countDocuments(),
      Admin.countDocuments(),
    ]);

    res.json({
      success: true,
      totalUsers,
      totalAdmins,
      totalAccounts: totalUsers + totalAdmins,
      adminPercentage: totalUsers > 0 ? ((totalAdmins / totalUsers) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching simple statistics' });
  }
});

export default router;
