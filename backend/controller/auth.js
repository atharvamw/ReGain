import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { addUser, getUsers, getPassword } from '../models/auth.js';

const saltRounds = 10;

export async function handleRegister(req, res)
{
    try
    {   
        /*
        JSON Request Body
        {
            email: "String",
            password: "String",
            firstName: "String",
            lastName: "String"
            phone: "987654321"
        }
        */
        const data = req.body;

        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        
        const result = await addUser(data.email, hashedPassword, data.firstName, data.lastName);
        
        res.json(result);
    }
    catch(error)
    {
        res.json({status: "error", message: error.toString()});
    }
}

export async function handleGetUsers(req, res)
{
    try
    {   
        const result = await getUsers();
        
        res.json(result);
    }
    catch(error)
    {
        res.json({status: "error", message: error.toString()});
    }
}

export async function handleLogin(req, res)
{
    try
    {
        /*
        JSON Request Body
        {
            email: "String"
            password: "String"
        }
        */
        const email = req.body.email

        if(email && req?.body?.password)
        {
            const creds = await getPassword(email);
            const password = creds.password;

            if(password && await bcrypt.compare(req.body.password, password))
            {
                const token = jwt.sign({"email": email}, process.env.JWT_SECRET, {expiresIn: '30d'})

                res.cookie("token", {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    secure: false,
                    sameSite: 'strict'
                })

                res.json({status: "success", token: token, message: "Login successful!"});
            }
            else
            {
                res.json({status: "failed", message: "Credentials Dont Match"});
            }

        }
        else
        {
            res.json({status: "failed", message: "Please enter email and password in the body!"});
        }

    }
    catch(error)
    {
        res.json({status: "error", message: error.toString()});
    }
}