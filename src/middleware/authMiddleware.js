/**
*
*   Middleware for authentication and authorization
*   To required Admin role for doing stuff
* 
**/

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_TOKEN = process.env.JWT_TOKEN;

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const authorizeAdmin = async (req, res, next) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };

