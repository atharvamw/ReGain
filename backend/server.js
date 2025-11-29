import express from 'express'
import mongoose from "mongoose";
import dotenv from 'dotenv'

import SiteRouter from './routes/site.js'
import AuthRouter from './routes/auth.js'
import { checkUserExistance } from './models/auth.js';
import OrderRouter from './routes/order.js';
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express();
app.use(cookieParser())
app.use(express.json())
dotenv.config();

if (process.env.NODE_ENV === 'development') 
{
        app.use(cors({ origin: true, credentials: true }));
}
else
{   
        app.use(cors({
    
            origin: (origin, callback)=>{
    
                if(process.env.ALLOWED_ORIGINS.includes(origin))
                {
                    callback(null, true)
                }
                else
                {
                    callback(new Error("Request From this Origin is not allowed"))
                }
            },
    
            methods: ['GET', 'POST', 'OPTIONS'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
}

mongoose.connect(process.env.MONGO_SERVER_URI);

app.listen(5000, ()=>{console.log("Server Started at port 5000: http://localhost:5000")})

app.get("/", (req, res)=>{
    res.send("<h1 style='color: red'> Welcome! </h1>")
})

app.use(SiteRouter)
app.use(AuthRouter)
app.use(OrderRouter);


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



