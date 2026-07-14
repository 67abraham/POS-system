import express, {type Application, type Response, type Request } from "express";
import cor from 'cors'
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv"
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { menu } from "./routes/apiRoute";

dotenv.config();
const app:Application = express();
const port = process.env.PORT

//API Handler
app.use(cor({
    origin: process.env.CLIENT_URL,
    methods:["POST", "GET", "DELETE","PUT"],
    credentials: true
}));

app.use(helmet({
    crossOriginOpenerPolicy: {policy:"same-origin"}
}))

//Authentication Route(Better-Auth)
app.all("/api/auth/*splat", toNodeHandler(auth))

//Parser
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.json())

if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'))
}

//All Route
app.get("/", (req:Request, res:Response)=>{
   return  res.status(200).json({message: "Backend is Ready"})
})

//resources route
app.use("/api/menu", menu)

//globalError
app.use((error:Error, req:Request, res:Response)=>{
    console.log(error.stack)
    res.status(500).json({message: "Something Went Wrong"})
})


//Running
app.listen(port, ()=>{
    console.log(`Backend is Running on Port: ${port}`)
})