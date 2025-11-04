import express from 'express'
import { handleGetNearbySites, handleGetSites, handleRegisterSite } from '../controller/site.js'

const router = express.Router()

router.get("/getSites", handleGetSites)

router.post("/getNearestSites", handleGetNearbySites)

router.post("/registerSite", handleRegisterSite)

export default router