import mongoose from "mongoose";


const Depatmentschema = new mongoose.Schema({
   DepatmentName :{
       type : String,
       required : true
   }
})

const DepatmentModal = mongoose.model('depart', Depatmentschema)
export default DepatmentModal