import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
    code : {
        type : String,
        requied : true
    },
    LocationName : {
        type : String,
        requied : true,
        unique : true
    }
})

const LocationModal = mongoose.model('location' , locationSchema)

export default LocationModal