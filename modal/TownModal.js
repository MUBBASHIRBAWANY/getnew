import mongoose from "mongoose";

const TownSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    TownName: {
        type: String,
        required: true
    },
  
})

const TownModal = mongoose.model("Town", TownSchema)

export default TownModal