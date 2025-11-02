import express from 'express'
import { getNearestSites, getSites, registerSite } from '../models/site.js'

const router = express.Router()

router.get("/getSites", async (req, res)=>{

    try
    {
        res.json(await getSites())
    }
    catch(error)
    {
        res.json({error: "error", message: "Could not Fetch Sites API Error"});
    }
    
})

router.post("/getNearestSites", async (req, res)=>{

    try
    {
        res.json(await getNearestSites(req.body.userCords))
    }
    catch(error)
    {
        res.json({error: "error", message: "Could not Fetch Sites API Error"});
    }
    
})

router.post("/registerSite", async (req, res)=>{

    try
    {
        res.json(await registerSite(req.body))
    }
    catch(error)
    {
        res.json({error: "error", message: "Could not Register Site API Error"});
    }
    
})

export default router