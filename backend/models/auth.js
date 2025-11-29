import mongoose from 'mongoose'

const loginSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phone: {type: String, required: true, match: /[0-9]{10}$/},
    adharNo: {type: String}
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

export async function getPassword(email)
{
    try
    {
        const creds = await Login.findOne({email});

        if(creds?.password)
            return {status: "success", password: creds.password, firstName: creds.firstName, lastName: creds.lastName, message: "Success!"}
        else
            return {status: "failed", password: null, message: "User doesnt exist!"}
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
        //console.log(creds?true:false)

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
        return {exists: null, message: "Error"}
    }
}

export async function addUser(email, password, firstName, lastName, phone)
{
    try
    {   
        const res = await Login.create({email, password, firstName, lastName, phone})
        return {status: "success", data: res};
    }
    catch(error)
    {
        if(error.message.includes("duplicate key"))
        {
            return {status: "error", message: "User Already Exists! (Duplicate Email)"};
        }
        
        return {status: "error", message: error.toString()};
    }
}

export async function getUsers()
{
    try
    {
        const res = await Login.find().select("email firstName lastName").limit(100);

        if(res)
        {
            return {status: "success", data: res};
        }
        else
        {
            return {status: "failed", message: "Failed to Fetch Users"};
        }
        
        
    }
    catch(error)
    {
        return {status: "error", message: error};
    }
}


export async function getName(email)
{
    try
    {
        const creds = await Login.findOne({email});

        if(creds)
            return {status: "success", firstName: creds.firstName, lastName: creds.lastName, phone: creds.phone, message: "Success!"}
        else
            return {status: "failed", password: null, message: "User doesnt exist!"}
    }
    catch(error)
    {
        return {status: "error", message: "Failed to Fetch Credentials"}
    }
}