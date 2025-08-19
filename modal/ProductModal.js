import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true

    },
    ProductName: {
        type: String,
        required: true

    },
    OpeningRate: {
        type: String,
        required: true
    },
    TPPurchase: {
        type: String,
        required: true
    },
    TPSale: {
        type: String,
        required: true
    },
    SaleTaxAmount: {
        type: String,
    },
    SaleTaxPercent: {
        type: String,
    },
    BoxinCarton: {
        type: String,
        required: true
    },
    PcsinBox: {
        type: String,
        required: true
    },
    SaleTaxBy: {
        type: String,
        required: true
    },
    RetailPrice: {
        type: String,
    },
    
    CodeRef: {
        type: String,
        Unique : true
    }


})

const ProductModal = mongoose.model("Product", productSchema)

export default ProductModal