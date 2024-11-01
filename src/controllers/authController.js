/** 
    The Controller for Authentication with JWT and hashing password
    JWT_TOKEN intialized at the .env using random string generator
* **/

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
const JWT_TOKEN = process.env.JWT_TOKEN

/** 
    User Registration Function    
* **/

const register = async (req, res)=> {
    const { email, username, password } = req.body;
    let user = null

    try {
        const hashPassword = await bcrypt.hash(password, 10);

        // check user existence
        const userExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        
        if( !userExist  ){
             user = await prisma.user.create({
                data: {
                    email,
                    name: username,
                    password: hashPassword,
                    profile: {
                        create: {}
                    }
                },
                include: {
                    profile: true
                }
            })   
        }else {
            res.status(400).json({ message: "User already exist!" })
        }
        
        res.status(201).json({ message: "Successfully register!" ,
                user:{
                    username: user.name, 
                    email: user.email
                }})
    } catch (error){
        //error only display at terminal
     console.log("error register user : ", error)
     res.status(500).json({ error: "User registration failed! " })
    }
}


/** 
    Login Function
**/

const login = async (req, res) => {
    const { email, password } = req.body

    try{
        const user = await prisma.user.findUnique({ where: {email} })
        if (!user || !(await bcrypt.compare(password, user.password))){
            return res.status(401).json({ error: "Invalid Password or Email !" })
        }

        const token = jwt.sign({ id: user.id }, JWT_TOKEN, { expiresIn: '1h' })
        res.status(200).json({ message: 'Login succesfull!',
    
                user:{
                    username: user.name, 
                    email: user.email
                }, 
                token })
    
    }catch(error){
        console.log("error: " + error)
        res.status(500).json({ error: 'Login Failed' })
    }
}    

// Export functions
module.exports = {
    register,
    login
}
