import mongoose from "mongoose";

const SaleOrderDcSchema = new mongoose.Schema({
    DcNumber: {
        type: String,
        required: true
    },
    Customer: {
        type: String,
        required: true
    },
    DcData: {
        type: Array,
        required: true
    },
    DcDate: {
        type: String,
        required: true
    },
   
    Location: {
        type: String,
        required: true
    },
    Store: {
        type: String,
        required: true
    },
    Remarks: {
        type: String,
    },
    Status: {
        type: String,
        default: false
    }
})

const SaleOrderDcModal = mongoose.model("SaleOrderDc", SaleOrderDcSchema)

export default SaleOrderDcModal