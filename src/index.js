/**
*
*   This is the main file for the NEWS API

    *   Dont Delete this creadit !!!
    *   Develop by @webstriiix
    *   github: https://github.com/webstriiix
*
* */

const express = require('express')
const dotenv = require("dotenv")
const newsRoutes = require('./routes/newsRoutes')
const authRoutes = require('./routes/authRoutes')
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config()

const app = express()
const port = process.env.PORT;

// middleware
app.use(express.json())

// use the routes
app.use('/auth',authRoutes)
app.use('/api', newsRoutes)
app.use('/api', categoryRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
