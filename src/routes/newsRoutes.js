/**
*
*   Routes for news Controller
*
**/

const express = require('express')
const multer = require('multer')
const { searchNews, createNews, updateNews, getAllNews, getNewsDetails, deleteNews } = require('../controllers/newsController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' }); // Stores files temporarily in the "uploads" directory

// Public routes
/**
 * @swagger
 * tags:
 *   name: News
 *   description: API endpoints for managing news items
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Retrieve all news items
 *     tags: [News]
 *     responses:
 *       200:
 *         description: A list of news items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */

router.get('/news', getAllNews);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Retrieve a specific news item by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the news item to retrieve
 *     responses:
 *       200:
 *         description: Details of the news item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: News item not found
 */

router.get('/news/:id', getNewsDetails);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for news items
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in the title or content of the news
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: ID of the category to filter news by
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: integer
 *         description: ID of the author to filter news by
 *     responses:
 *       200:
 *         description: News items retrieved successfully based on search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/search', searchNews);

// Admin routes

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news item (Admin only)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: News item created successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Admin access required
 */

router.post('/news', authenticate, authorizeAdmin, upload.single('thumbnail'), createNews);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Update a news item by ID (Admin only)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the news item to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: News item updated successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: News item not found
 */
router.put('/news/:id', authenticate, authorizeAdmin, upload.single('thumbnail'), updateNews);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news item by ID (Admin only)
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the news item to delete
 *     responses:
 *       200:
 *         description: News item deleted successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: News item not found
 */
router.delete('/news/:id', authenticate, authorizeAdmin, deleteNews);

module.exports = router;
