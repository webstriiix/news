/**
*    
*   The Controller for categories (CRUD)
*
**/

const {PrismaClient}  = require('@prisma/client')
const prisma = new PrismaClient()


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
