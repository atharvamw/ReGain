import express from 'express'
import { handleRegister, handleGetUsers, handleLogin } from '../controller/auth.js'

const router = express.Router()

router.post("/register", handleRegister)

router.get("/getUsers", handleGetUsers)

router.post("/login", handleLogin)

export default router;