import mongoose from "mongoose";

const StockReplacementSchema = new mongoose.Schema({
    ReplacementDate: {
        type: String,
        required: true
    },
    ReplacementNumber: {
        type: String,
        required: true
    },
    Customer: {
        type: String,
        required: true
    },
    SalesFlowRef: {
        type: String,
        required: true
    },
    ReplacementData: {
        type: Array, 
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
});

const StockReplacementModal = mongoose.model("StockReplacement", StockReplacementSchema);

export default StockReplacementModal;
