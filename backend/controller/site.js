import { getNearestSites, getSites, registerSite } from '../models/site.js'

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
        res.json(await getNearestSites(req.body.userCords))
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
        materials: {"bricks": 10, "wood_planks: 10"},
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