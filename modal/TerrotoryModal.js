import mongoose from "mongoose";

const TerrotorySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    TerrotoryName: {
        type: String,
        required: true,
        unique : true
    },
    City: {
        type: String,
        required: true,
        unique : true
    },
})

const TerrotoryModal = mongoose.model("Terrotory", TerrotorySchema)

export default TerrotoryModal