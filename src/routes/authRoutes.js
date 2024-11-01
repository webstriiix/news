/***
*
*  Routes for Auth with JWT 
* 
* ***/

const express = require('express')
const { register, login } = require('../controllers/authController')

const router = express.Router()

// define routes
router.post('/register', register)
router.post('/login', login)

module.exports = router
