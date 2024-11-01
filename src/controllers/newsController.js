/***
* 
*   Controller for manipulation news data (CRUD)
*
*/

/**
 * @swagger
 * tags:
 *   name: News
 *   description: CRUD operations for news articles
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

/**
 * @swagger
 * /news/search:
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
 *               type: object
 *               properties:
 *                 news:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       categories:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *       500:
 *         description: Failed to search for news items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed search news"
 */

// Search for News
const searchNews = async (req, res) => {
    const { keyword, categoryId, authorId } = req.query;

    try{
        const news = await prisma.news.findMany({
          where: {
            AND: [
              keyword ? { OR: [
                { title: { contains: keyword, mode: 'insensitive' } },
                { content: { contains: keyword, mode: 'insensitive' } }
              ] } : {},
              categoryId ? { categories: { some: { id: parseInt(categoryId) } } } : {},
              authorId ? { authorId: parseInt(authorId) } : {},
            ]
          },
          include: {
            categories: true,
            author: true,
          }
        })        

        res.status(200).json({ news })

    }catch (error){
        console.log("Error while search news: ", error)
        res.status(500).json({ message: "Failed search news" })
    }
}

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Retrieve a list of news articles
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of news articles
 *       500:
 *         description: Internal server error
 */


// Get all news and their author
const getAllNews = async (req, res) => {

    try{
        const newsList = await prisma.news.findMany({
            include: { categories:true, author: { select: {name:true} } }
        })
        if(!newsList) return res.status(404).json({ message: "No news found" })

        // Convert image binary to base64 String if its exist
        const thumbnailString = newsList.thumbnail ? Buffer.from(newsList.thumbnail).toString('base64'):null

        return res.status(200).json({
            ...newsList,
            thumbnail: thumbnailString
        })
    }catch (error){
        console.log("Error getting news list: ", error)
        return res.status(500).json({ message: "Failed to get the news list" })
    }
}

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Get details of a news article
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The news article ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the news article
 *       404:
 *         description: News article not found
 *       500:
 *         description: Internal server error
 */

// Get news details
const getNewsDetails = async (req, res) => {
    const { id } = req.params

    try{
        const newsItem = await prisma.news.findUnique({
            where: { id: parseInt(id) },
            include: { categories:true, author: { select: { name: true } } }
        })
        if (!newsItem) return res.status(404).json({ message:"News not found!" })
        
        // Convert image binary to base64 String if its exist
        const thumbnailString = newsItem.thumbnail ? Buffer.from(newsItem.thumbnail).toString('base64'):null

        return res.status(200).json({
            ...newsItem,
            thumbnail: thumbnailString
        });
    }catch(error){
        console.log("Error fetching news details: ", error)
        return res.status(500).json({ error: "Failed to fetch news details" })
    }
}

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news article
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *               published:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: News article created successfully
 *       500:
 *         description: Failed to create news article
 */

// Create News
const createNews = async (req, res) => {
    const { title, content, categories, published } = req.body
    let thumbnail = null;

    // Check if a file is uploaded
    if (req.file){
        thumbnail = fs.readFileSync(req.file.path) // convert image to binary
        fs.unlinkSync(req.file.path) // delete temporary file
    }else {
        res.status(404).json({ message: "Image not found!! Please input the image thumbnail" })
    }

    // make publish to boolean
    const isPublished = published === 'true';

    try {
        const news = await prisma.news.create({
            data: {
                title,
                content,
                thumbnail,
                authorId: parseInt(req.user.id),
                categories: {
                  connect: categories.map((id) => ({ id: parseInt(id) })),
                },
                published: isPublished
            }
        })
        return res.status(201).json({ message: "Successfully create news", news })
    } catch(error){
        console.log("Error creating news: ", error)
        return res.status(500).json({ error: "Failed to create news" })
    }
}

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Update an existing news article
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The news article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: News article updated successfully
 *       500:
 *         description: Failed to update news article
 */

// Update News
const updateNews = async (req, res) => {
    const { id }  = req.params
    const { title, content, categories, published } = req.body

    const isPublished = published === 'true';

    let updateData = { title, content, categories, published: isPublished }
    let thumbnail = null

    // Check if a file is uploaded
    if (req.file){
        thumbnail = fs.readFileSync(req.file.path) // convert image to binary
        updateData.thumbnail = thumbnail
        fs.unlinkSync(req.file.path) // delete temporary file
    }

    // convert the array of string to array of integer
    if(categories && Array.isArray(categories)){
        updateData.categories = {
            connect: categories.map(id => ({ id: parseInt(id) })) // Map category IDs to connect format
        };
    }

    try{
        const news = await prisma.news.update({
            where: { id: parseInt(id) },
            data: updateData,
        })

        return res.status(200).json({ message: "Successfully update the news", news })
    }catch (error){
        console.log("Error updating the news: ",error)
        return res.status(500).json({ error: "Failed to update News" })
    }
}

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Delete a news item
 *     tags: [News]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully deleting news"
 *       500:
 *         description: Failed to delete news item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete news"
 */

// Deleting news
const deleteNews = async (req, res) => {
    const { id } = req.params

    try{
        await prisma.news.delete({ where: { id: parseInt(id) } })
        return res.status(200).json({ message: "Successfully deleting news" })

    } catch(error){
        console.log("Error deleting news: ", error)
        return res.status(500).json({ message: "Failed to delete news" })
    }
}

module.exports = {
    searchNews,
    getAllNews,
    getNewsDetails,
    createNews,
    updateNews,
    deleteNews,
}
