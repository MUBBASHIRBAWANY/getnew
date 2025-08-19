import mongoose from "mongoose";

const CustomerChqRecivedSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    },
    ChqRecivedData: {
        type: Array,
        required: true
    },
    Status :{
        type: String,
        required: true
    }
    
})

const CustomerChqRecivedModal = mongoose.model("CustomerChqRecived", CustomerChqRecivedSchema)

export default CustomerChqRecivedModal