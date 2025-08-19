import mongoose from "mongoose";


const SalesInvoiceSchema = mongoose.Schema({
    SalesInvoice: {
        type: String,
        Unique: true
    },
    OrderBooker: {
        type: String,
    },
    SalesData: {
        type: Array,
        required: true
    },
    Client: {
        type: String,
        required: true
    },
    SalesInvoiceDate: {
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
    },
    RemainingAmount: {
        type: Number,
        default: 0
    },
    RecivedAmount: {
        type: Number,
        default: 0
    },
    TotalAmount: {
        type: Number,
        default: 0
    },
})

const SalesInvoiceModal = mongoose.model('SalesInvoice', SalesInvoiceSchema)

export default SalesInvoiceModal