import express from 'express'
import mongoose from "mongoose";
import dotenv from 'dotenv'
import { getSites } from './models/site.js';
import {checkUserExistance, getCredentials} from './models/auth.js'

import SiteRouter from './routes/site.js'

const app = express();
app.use(express.json())
dotenv.config();

mongoose.connect(process.env.MONGO_SERVER_URI);

app.listen(5000, ()=>{console.log("Server Started at port 5000: http://localhost:5000")})

app.get("/", (req, res)=>{
    res.send("<h1 style='color: red'> Welcome! </h1>")
})

app.use(SiteRouter)

//console.log(await getSites());
//console.log(await getCredentials());
//console.log(await checkUserExistance("abc@gmail.com"))



