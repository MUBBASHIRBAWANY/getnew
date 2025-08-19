import mongoose from "mongoose";


const PurchaseReturnSchema = mongoose.Schema({
    returnCode: {
        type: String,
        Unique: true
    },
    PurchaseReturn: {
        type: String,
        Unique: true
    },
    PurchaseReturnData: {
        type: Array,
        required: true
    },
    Vendor: {
        type: String,
        required: true
    },
    PurchaseReturnDate: {
        type: String,
        required: true
    },
    SalesFlowRef: {
        type: String,
        required: true
    },
    PostStatus: {
        type: Boolean,
        required: true
    },
    Store: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    }
})

const PurchaseReturnModal = mongoose.model('PurchaseReturn', PurchaseReturnSchema)

export default PurchaseReturnModal