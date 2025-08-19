import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    CityName: {
        type: String,
        required: true
    },
    Region: {
        type: String,
        required: true
    }

})

const CityModal = mongoose.model("City", CitySchema)

export default CityModal