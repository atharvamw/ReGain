import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const loginSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    adharCard: {type: String}
}, {collection: "credentials"})

const Login = mongoose.model("Credential", loginSchema)

export async function getCredentials()
{
    try
    {
        const creds = await Login.find({});
        return {status: "success", data: creds}
    }
    catch(error)
    {
        return {status: "error", message: "Failed to Fetch Credentials"}
    }
}

export async function checkUserExistance(email)
{
    try
    {
        const creds = await Login.findOne({email});

        if(creds)
        {
            return {exists: true, message: "User Already Exists"}
        }
        else
        {
            return {exists: false, message: "User Does not Exist"}
        }
    }
    catch(error)
    {

    }
}

export async function register()
{
    try
    {
        
    }
    catch(error)
    {
        
    }
}