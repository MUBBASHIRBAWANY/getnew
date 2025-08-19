import mongoose from "mongoose";

const SubLocalitySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    SubLocalityName: {
        type: String,
        required: true
    },
    SaleFlowRef: {
        type: String,
        required: true
    },
   
})

const SubLocalityModal = mongoose.model("SubLocality", SubLocalitySchema)

export default SubLocalityModal