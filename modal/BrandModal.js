import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    BrandName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    mastercode: {
        type: String,
        required: true
    },
    salesFlowRef: {
        type: String,
    },
    CodeRef : {
        type: String,
        Unique : true
    }
})

const BrandModal = mongoose.model("Product-Brand", BrandSchema)

export default BrandModal