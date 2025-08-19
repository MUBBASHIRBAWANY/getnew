import mongoose from "mongoose";


const purchchaseInvoiceSchema = mongoose.Schema({
    invoiceCode: {
        type: String,
        Unique: true
    },
    PurchaseInvoice: {
        type: String,
        Unique: true
    },
    PurchaseData: {
        type: Array,
        required: true
    },
    Vendor: {
        type: String,
        required: true
    },
    PurchaseInvoiceDate: {
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
    },
    TotalAmount: {
        type: Number,
        default: 0
    },
    VoucherRef: {
        type: String,
    },
})

const PurchaseInvoiceModal = mongoose.model('PurchaseInvoice', purchchaseInvoiceSchema)

export default PurchaseInvoiceModal