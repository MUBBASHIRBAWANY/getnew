import express from 'express';
import { Router } from 'express';
import { DepartmentRoute, users } from './App.js';
import cors from 'cors'

const app = express();
const port = process.env.PORT
app.use(cors())
app.use(express.json())


app.use('/', users)
app.get('/', (req,res)=>{
    res.send(`Server Runing at ${port}`)
})




app.listen(port,console.log(port))