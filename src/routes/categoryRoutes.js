/**
*
*   Routes for Categories
*
**/

const express = require('express');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route to view categories
router.get('/categories', getCategories);

// Admin-only routes for managing categories
router.post('/categories', authenticate, authorizeAdmin, createCategory);
router.put('/categories/:id', authenticate, authorizeAdmin, updateCategory);
router.delete('/categories/:id', authenticate, authorizeAdmin, deleteCategory);

module.exports = router;

