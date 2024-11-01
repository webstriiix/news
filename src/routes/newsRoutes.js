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
router.get('/news', getAllNews);
router.get('/news/:id', getNewsDetails);
router.get('/search', searchNews);

// Admin routes
router.post('/news', authenticate, authorizeAdmin, upload.single('thumbnail'), createNews); // Upload thumbnail
router.put('/news/:id', authenticate, authorizeAdmin, upload.single('thumbnail'), updateNews);
router.delete('/news/:id', authenticate, authorizeAdmin, deleteNews);

module.exports = router;
