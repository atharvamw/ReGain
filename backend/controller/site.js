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
            res.json({status: "failed", message: "Please Provide Site Id as id"});
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

                const phoneRegex = /^[7-9][0-9]{9}$/
                
                if(name && name.length < 6 )
                {
                    res.json({status: "failed", message: "Invalid Name"});
                }
                else if(phone && !phoneRegex.test(phone))
                {
                    res.json({status: "failed", message: "Invalid Phone"});
                }
                else if(isActive && typeof isActive != "boolean" )
                {
                    res.json({status: "failed", message: "Invalid isActive"});
                }
                else if(materials && typeof materials != "object" )
                {
                    res.json({status: "failed", message: "Invalid Materials"});
                }
                else if(location && (typeof location.coordinates != "object" || !location.coordinates[0] || !location.coordinates[1] || typeof location.coordinates[0] != "number" || typeof location.coordinates[1] != "number" || location.coordinates?.length!=2))
                {
                    res.json({status: "failed", message: "Provide Type: Number - Coordinates In the Coordinates Array and Length of coordinates array must be 2"});
                }
                else if(location && (typeof location != "object" || location?.type!="Point"))
                {
                    res.json({status: "failed", message: "Invalid Locations"});
                }
                
                const updateData = {name, phone, isActive, materials, location}

                /* Not Necessary all of them just any one or more.
                    {
                        name: String,
                        phone: String,
                        isActive: Boolean,
                        materials: {type: Object},
                        location: 
                        {
                            type: {type: String, enum: ["Point"], required: true},
                            coordinates: {type: [Number], required: true}
                        }
                    }
                */
                
                const data = await updateMySite(id, token.email,updateData);
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
        res.json({status:"failed", message: err.toString()})
        console.log(err);
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

                const phoneRegex = /^[7-9][0-9]{9}$/
                
                if(name.length < 6 )
                {
                    res.json({status: "failed", message: "Invalid Name"});
                }
                else if(!phoneRegex.test(phone))
                {
                    res.json({status: "failed", message: "Invalid Phone"});
                }
                else if(typeof isActive != "boolean" )
                {
                    res.json({status: "failed", message: "Invalid isActive"});
                }
                else if(typeof materials != "object" )
                {
                    res.json({status: "failed", message: "Invalid Materials"});
                }
                else if((typeof location.coordinates != "object" || !location.coordinates[0] || !location.coordinates[1] || typeof location.coordinates[0] != "number" || typeof location.coordinates[1] != "number" || location.coordinates?.length!=2))
                {
                    res.json({status: "failed", message: "Provide Type: Number - Coordinates In the Coordinates Array and Length of coordinates array must be 2"});
                }
                else if((typeof location != "object" || location?.type!="Point"))
                {
                    res.json({status: "failed", message: "Invalid Locations"});
                }
                
                const addData = {name, email: token.email, phone, isActive, materials, location}

                /* Necessary all of them just any one or more.
                    {
                        name: String,
                        phone: String,
                        isActive: Boolean,
                        materials: {type: Object},
                        location: 
                        {
                            type: {type: String, enum: ["Point"], required: true},
                            coordinates: {type: [Number], required: true}
                        }
                    }
                */
                
                const data = await addMySite(token.email, addData);
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
        res.json({status:"failed", message: err.toString()})
        console.log(err);
    }
}