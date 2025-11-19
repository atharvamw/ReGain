import mongoose from 'mongoose'

const loginSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    phoneNo: {type: String, required: true, match: /[0-9]{10}$/},
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

export async function addUser(email, password, firstName, lastName)
{
    try
    {   
        const doc = await checkUserExistance(email)
        if(!doc.exists)
        {
            const res = await Login.create({email, password, firstName, lastName, phoneNo})
            return {status: "success", data: res};
        }
        else
        {
            return {status: "failed", message: "User Already exists!"};
        }
        
    }
    catch(error)
    {
        return {status: "error", message: error};
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

        if(creds?.firstName)
            return {status: "success", firstName: creds.firstName, lastName: creds.lastName, message: "Success!"}
        else
            return {status: "failed", password: null, message: "User doesnt exist!"}
    }
    catch(error)
    {
        return {status: "error", message: "Failed to Fetch Credentials"}
    }
}