import mongoose from "mongoose";

const VendorOpeningSchema = new mongoose.Schema({
    DateStart: {
        type: String,
        unique: true,
        required: true
    },
    DateEnd: {
        type: String,
        unique: true,
        required: true
    },
    VendorData: {
        type: Object,
        required: true
    },
    Status: {
        type: String,
        required: true
    }
})
const VendorOpeningModal = mongoose.model("Vendor-Opening", VendorOpeningSchema)
export default VendorOpeningModal;
