import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const URL = process.env.URL

const db = () => {
 mongoose.connect("mongodb+srv://Mubbashir123:Mubbashir1234@airbnb1.873o2.mongodb.net/Batch-11-Hackathon").then(()=>{
    console.log("DataBase Conected")
})
}

export default db