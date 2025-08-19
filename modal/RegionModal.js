import mongoose from "mongoose";

const RegionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    RegionName: {
        type: String,
        required: true
    },
    Zone : {
        type: String,
        required: true
    }
    
})

const RegionModal = mongoose.model("Region", RegionSchema)

export default RegionModal