import express from 'express'

const app = express();

app.listen(5000, ()=>{console.log("Server Started at port 5000: http://localhost:5000")})

app.get("/", (req, res)=>{
    res.send("<h1 style='color: red'> Welcome! </h1>")
})

