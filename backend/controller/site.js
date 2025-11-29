import { getNearestSites, getSites, registerSite, getMySites, updateMySite, addMySite } from '../models/site.js'
import jwt from 'jsonwebtoken'

export async function handleGetSites(req, res){

    try
    {
        res.json(await getSites())
    }
    catch(error)
    {
        res.json({error: "error", message: "Could not Fetch Sites API Error"});
    }
    
}

export async function handleGetNearbySites(req, res){

    try
    {
        /*
            JSON Body format:
            {
                radius: num
                userCords: [lat, lng]
            }
        */
        
            if(req.cookies?.token)
            {
                const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

                if(token)
                { 
                    const radius = req.body.radius || 15
                    
                    res.json(await getNearestSites(req.body.userCords, radius))
                }
                else
                {
                    res.json({status: "failed", message: "Not Authenticated"})
                }
            }

    }
    catch(error)
    {
        res.json({error: "error", message: "Could not Fetch Sites API Error"});
    }
    
}

export async function handleRegisterSite(req, res){

    /*
    JSON Body format:
    {
        name: "String",
        phone: "String",
        isActive: true/false,
        materials: {"bricks": {"price": 100, "stock": 20}, "wood_planks: {"price": 100, "stock": 20}"},
        location: {type: "Point", coordinates: [lat, lng]}
    }
    */

    try
    {
        res.json(await registerSite(req.body))
    }
    catch(error)
    {
        res.json({error: "error", message: "Could not Register Site API Error"});
    }
    
}

export async function handleGetMySites(req, res)
{
    try
    {   
        if(req.cookies?.token)
        {
            const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            
            if(token)
            {
                const data = await getMySites(token.email);
                res.json(data)
            }
            else
            {
                res.json({status: "failed", message: "You are not Authenticated"});
            }
        }
        else
        {
            res.json({status: "failed", message: "Please Login First!"});
        }
        
    }
    catch(err)
    {
        res.json({"status": "failed", message: err})
        console.log(err);
    }
}

export async function handleUpdateMySite(req, res)
{
    try
    {
        if(!req.body?.id)
        {
            return res.json({status: "failed", message: "Please Provide Site Id as id"});
        }
        
        if(req.cookies?.token)
        {
            const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            
            if(token)
            {
                const id = req.body.id;
                const name = req.body.name;
                const phone = req.body.phone;
                const isActive = req.body.isActive;
                const materials = req.body.materials;
                const location = req.body.location;

                const phoneRegex = /^[0-9]{10}$/
                
                if(name && name.length < 6 )
                {
                    return res.json({status: "failed", message: "Invalid Name"});
                }
                else if(phone && !phoneRegex.test(phone.replace(/[^0-9]/g, '')))
                {
                    return res.json({status: "failed", message: "Invalid Phone"});
                }
                else if(isActive !== undefined && typeof isActive != "boolean" )
                {
                    return res.json({status: "failed", message: "Invalid isActive"});
                }
                else if(materials && typeof materials != "object" )
                {
                    return res.json({status: "failed", message: "Invalid Materials"});
                }
                else if(location && (typeof location.coordinates != "object" || !location.coordinates[0] || !location.coordinates[1] || typeof location.coordinates[0] != "number" || typeof location.coordinates[1] != "number" || location.coordinates?.length!=2))
                {
                    return res.json({status: "failed", message: "Provide Type: Number - Coordinates In the Coordinates Array and Length of coordinates array must be 2"});
                }
                else if(location && (typeof location != "object" || location?.type!="Point"))
                {
                    return res.json({status: "failed", message: "Invalid Locations"});
                }
                
                const updateData = {};
                if(name) updateData.name = name;
                if(phone) updateData.phone = phone.replace(/[^0-9]/g, '');
                if(isActive !== undefined) updateData.isActive = isActive;
                if(materials) updateData.materials = materials;
                if(location) updateData.location = location;
                
                const data = await updateMySite(id, token.email, updateData);
                return res.json(data)
            }
            else
            {
                return res.json({status: "failed", message: "You are not Authenticated"});
            }
        }
        else
        {
            return res.json({status: "failed", message: "Please Login First!"});
        }
    }
    catch(err)
    {
        console.error("Update Site Error:", err);
        return res.json({status:"failed", message: err.toString()})
    }
}

export async function handleAddMySite(req, res)
{
    try
    {
        if(req.cookies?.token)
        {
            const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            
            if(token)
            {
                const name = req.body.name;
                const phone = req.body.phone;
                const isActive = req.body.isActive;
                const materials = req.body.materials;
                const location = req.body.location;
                const phoneRegex = /^[0-9]{10}$/
                
                if(!name || name.length < 6 )
                {
                    return res.json({status: "failed", message: "Site name must be at least 6 characters"});
                }
                else if(!phone || !phoneRegex.test(phone.replace(/[^0-9]/g, '')))
                {
                    return res.json({status: "failed", message: "Phone must be 10 digits"});
                }
                else if(typeof isActive != "boolean" )
                {
                    return res.json({status: "failed", message: "Invalid isActive field"});
                }
                else if(!materials || typeof materials != "object" || Object.keys(materials).length === 0)
                {
                    return res.json({status: "failed", message: "At least one material is required"});
                }
                else if(!location || typeof location.coordinates != "object" || !location.coordinates[0] || !location.coordinates[1] || typeof location.coordinates[0] != "number" || typeof location.coordinates[1] != "number" || location.coordinates?.length!=2)
                {
                    return res.json({status: "failed", message: "Valid location coordinates required (latitude, longitude)"});
                }
                else if(location.coordinates[0] === 0 && location.coordinates[1] === 0)
                {
                    return res.json({status: "failed", message: "Please set a valid location"});
                }
                else if(location?.type!="Point")
                {
                    return res.json({status: "failed", message: "Location type must be 'Point'"});
                }
                
                const addData = {
                    name, 
                    email: token.email, 
                    phone: phone.replace(/[^0-9]/g, ''), 
                    isActive, 
                    materials, 
                    location
                }
                
                const data = await addMySite(token.email, addData);
                return res.json(data)
            }
            else
            {
                return res.json({status: "failed", message: "Authentication failed"});
            }
        }
        else
        {
            return res.json({status: "failed", message: "Please login first"});
        }
    }
    catch(err)
    {
        console.error("Add Site Error:", err);
        return res.json({status:"failed", message: "Server error: " + err.toString()})
    }
}