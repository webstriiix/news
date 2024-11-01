/***
* 
*   Controller for manipulation news data (CRUD)
*
*/

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

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
