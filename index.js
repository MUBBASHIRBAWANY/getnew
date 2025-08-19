import express from 'express';
import { Router } from 'express';
import { users } from './App.js';
import cors from 'cors'
import { configDotenv } from 'dotenv';
configDotenv()
const app = express();
const port = process.env.PORT
app.use(cors())
app.use(express.json())


console.log(port)
app.use('/', users)
app.get('/', (req,res)=>{
    res.send(`Server Runing at ${port}`)
})




app.listen(port)