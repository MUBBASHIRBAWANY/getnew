import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const URL = process.env.URL2

const db = () => {
 mongoose.connect(URL).then(()=>{
    console.log("DataBase Conected");
})
}

export default db