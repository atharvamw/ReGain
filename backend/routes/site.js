import express from 'express'
import { handleGetNearbySites, handleGetSites, handleRegisterSite, handleGetMySites, handleUpdateMySite, handleAddMySite } from '../controller/site.js'

const router = express.Router()

router.get("/getSites", handleGetSites)

router.post("/getNearestSites", handleGetNearbySites)

router.post("/registerSite", handleRegisterSite)

router.get("/getMySites", handleGetMySites)

router.post("/updateMySite", handleUpdateMySite)

router.post("/addMySite", handleAddMySite)

export default router