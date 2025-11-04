import express from 'express'
import { handleRegister, handleGetUsers } from '../controller/auth.js'

const router = express.Router()

router.post("/register", handleRegister)

router.get("/getUsers", handleGetUsers)

export default router;