import express from 'express'
import mongoose from "mongoose";
import dotenv from 'dotenv'

import SiteRouter from './routes/site.js'
import AuthRouter from './routes/auth.js'
import { checkUserExistance } from './models/auth.js';

const app = express();
app.use(express.json())
dotenv.config();

mongoose.connect(process.env.MONGO_SERVER_URI);

app.listen(5000, ()=>{console.log("Server Started at port 5000: http://localhost:5000")})

app.get("/", (req, res)=>{
    res.send("<h1 style='color: red'> Welcome! </h1>")
})

app.use(SiteRouter)
app.use(AuthRouter)


app.use((err, req, res, next) => 
{
    if(err instanceof SyntaxError && err.status === 400 && "body" in err)
    {
        return res.status(400).json({error: "Provide a valid JSON body"});
    }
    next();
})

//console.log(await getSites());
//console.log(await getCredentials());
//console.log(await checkUserExistance("abc@gmail.com"))



