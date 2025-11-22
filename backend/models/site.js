import mongoose from "mongoose";

const siteSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    isActive: {type: Boolean, default: true},
    materials: {type: Object},
    location: {
        type: {type: String, enum: ["Point"], required: true},
        coordinates: {type: [Number], required: true}
    }
})

siteSchema.index({location: "2dsphere"})

const Site = mongoose.model("Site", siteSchema)

export async function getSites()
{
    try
    {
        const site = await Site.find({});
        return {status: "success", data: site};
    }
    catch(err)
    {
        return {status: "error", message: "Failed to Fetch Sites from database!"}
    }
}

export async function getNearestSites(userCords)
{
    try
    {
        const nearestSites = await Site.find({
            location:{
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: userCords 
                    },
                    $maxDistance: 15000
                },
            }
        }).limit(20)

        return {status: "success", data: nearestSites}
    }
    catch(error)
    {
        return {status: "error", data: "Could not Fetch Nearby Sites " + error}
    }
}

export async function registerSite({name, phone, isActive, materials, location})
{
    try
    {
        const res = await Site.create({name, phone, isActive, materials, location});
        return {status: "success", data: res};
    }
    catch(err)
    {
        return {status: "error", message: "Failed to register the site, please fill all the fields!\n" + err}
    }
}

export async function getMySites(email)
{
    try
    {
        const data = await Site.find({email});
        return {status: "success", data: data};
    }
    catch(err)
    {
        return {status: "error", message: err};
    }
}

export async function updateMySite(siteId, email, updateObj)
{
    try
    {
        const data = await Site.findOneAndUpdate(
        {
        _id: siteId,
        email: email  
        }
        , 
        {
            $set: updateObj
        }, {new: true})

        if(data)
        {
            return {status: "success", data: data};
        }
        else
        {
            return {status: "failed", message: "Invalid ID"};
        }
    }
    catch(err)
    {
        if(err.name == "CastError")
        {
            return {status: "error", message: "Invalid ID"};
        }
        else
        {
            return {status: "error", message: err.toString()};
        }
    }
}

export async function addMySite(siteId, email, addObj)
{
    try
    {
        const data = await Site.create(addObj)

        if(data)
        {
            return {status: "success", data: data};
        }
        else
        {
            return {status: "failed", message: "Invalid ID"};
        }
    }
    catch(err)
    {
        if(err.name == "CastError")
        {
            return {status: "error", message: "Invalid ID"};
        }
        else
        {
            return {status: "error", message: err.toString()};
        }
    }
}

export default Site;