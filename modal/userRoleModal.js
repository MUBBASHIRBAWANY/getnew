import mongoose from "mongoose";

 const userRoleSchema = new mongoose.Schema({
    RoleName :{
        type : String,
        required : true
    },
    Roles : {
        type: Object,
        required : true,    
    },
 
    createdBy : {
        type : String
    },
    updatedBy : {
        type : String
    },
    createDate : {
        type : String
    },
    updateDate : {
        type : String
    }

 })


 const userRoleModel = mongoose.model('userRole', userRoleSchema)
  
  export default userRoleModel