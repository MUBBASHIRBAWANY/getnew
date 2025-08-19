import mongoose from "mongoose";
import  jwt  from "jsonwebtoken";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
   name :{
       type : String,
       required : true
   },
   email : {
       type : String,
       required : true,
       unique : true
   },

   password : {
       type : String,
       required : true,
       select : false
   },
   userType:{
    type : Number,
   },
   imageUrl :{
       type : String,
   },
   Dep : {
    type : String
   }
})

export const  hashPassword = async (password) => {
   return await bcrypt.hash(password, 10)
}

export const comparePassword = (password, password2) =>{
   return bcrypt.compare(password, password2)
}

export const getAuthontication = async function(val){
   
   const token = jwt.sign({val}, "uber-Clone", {expiresIn : "24 h"})
   
   return token
} 



const userModel = mongoose.model('user', userSchema)

export default userModel