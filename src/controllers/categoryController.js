/**
*    
*   The Controller for categories (CRUD)
*
**/



const {PrismaClient}  = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for managing categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: Internal server error
 */


// Get all categories
const getCategories = async (req, res) => {
    try{
        const categories = await prisma.category.findMany()
        res.status(200).json(categories)
    }catch(error){
        console.log("Error fetching categories data: ", error)
        res.status(500).json({ error: "Failed to fetch categories" })
    }
}

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       500:
 *         description: Failed to create category
 */

// Create New Categories
const createCategory = async (req, res) => {
    const { name }  = req.body;
    try{
        const category = await prisma.category.create({
            data: {name}
        })
        res.status(201).json({ message: "Successfully created a category!", category })
    } catch(error){
        console.log("Error while creating category: ", error)
        res.status(500).json({ error: "Failed to create category" })
    }
}

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updateCategory:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       500:
 *         description: Failed to update category
 */

// Update Category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body

    try{
        const updateCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: { name }
        })
        res.status(200).json({ error: "Successfully updated the category", updateCategory })

    }catch (error){
        console.log("Error updating the category: ", error)
        res.status(500).json({ message: "Failed to update category" })
    }
}

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       500:
 *         description: Failed to delete category
 */

// Delete category
const deleteCategory = async (req, res)=> {
    const { id }  = req.params

    try{
        await prisma.category.delete({
            where: { id: parseInt(id) }
        })

        res.status(200).json({ message: "Successfully delete the category" })
    }catch (error){
        console.log("Error deleting category: ", error)
        rest.status(500).json({ error: "Failed to delete category" })
    }
}


module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
