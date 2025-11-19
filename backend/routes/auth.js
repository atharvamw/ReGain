import express from 'express'
import { handleRegister, handleGetUsers, handleLogin, handleAuth } from '../controller/auth.js'

const router = express.Router()

router.post("/register", handleRegister)

router.get("/getUsers", handleGetUsers)

router.post("/login", handleLogin)

router.get("/auth", handleAuth)

router.get("/ab", (req, res) => {res.json("Done!")})

export default router;