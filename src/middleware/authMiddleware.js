/**
*
*   Middleware for authentication and authorization
*   To required Admin role for doing stuff
* 
**/

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * components:
 *   responses:
 *     AccessDenied:
 *       description: Access denied due to missing or invalid token
 *     AdminAccessRequired:
 *       description: Admin access is required for this operation
 */

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

/**
 * @swagger
 * /auth:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Middleware for verifying JWT token
 *     responses:
 *       403:
 *         $ref: '#/components/responses/AccessDenied'
 */

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

/**
 * @swagger
 * /auth/admin:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: Middleware for verifying admin role access
 *     responses:
 *       403:
 *         $ref: '#/components/responses/AdminAccessRequired'
 */

const authorizeAdmin = async (req, res, next) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };

