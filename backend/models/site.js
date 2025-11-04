import mongoose from "mongoose";

const siteSchema = mongoose.Schema({
    name: {type: String, required: true},
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

export default Site;