import mongoose from "mongoose";

 const RoleSchema = new mongoose.Schema({
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


 const RoleModel = mongoose.model('Role', RoleSchema)
  
  export default RoleModel