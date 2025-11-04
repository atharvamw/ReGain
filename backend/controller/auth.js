import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { addUser, getUsers } from '../models/auth.js';

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