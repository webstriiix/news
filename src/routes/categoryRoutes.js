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

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints for managing categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Internal server error
 */
router.get('/categories', getCategories);

// Admin routes for managing categories

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created
 *       403:
 *         $ref: '#/components/responses/AdminAccessRequired'
 */
router.post('/categories', authenticate, authorizeAdmin, createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category updated
 *       403:
 *         $ref: '#/components/responses/AdminAccessRequired'
 *       500:
 *         description: Internal server error
 */
router.put('/categories/:id', authenticate, authorizeAdmin, updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       403:
 *         $ref: '#/components/responses/AdminAccessRequired'
 *       500:
 *         description: Internal server error
 */
router.delete('/categories/:id', authenticate, authorizeAdmin, deleteCategory);

module.exports = router;

