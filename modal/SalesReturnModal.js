import mongoose from "mongoose";


const SalesInvoiceReturnSchema = mongoose.Schema({
    SalesReturnNumber: {
        type: String,
        Unique: true
    },
    OrderBooker : {
        type: String,       
    },
    SalesReturnData: {
        type: Array,
        required: true
    },
    Client: {
        type: String,
        required: true
    },
    SalesInvoiceReturnDate: {
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
    Condition : {
        type: String,
        required: true
    }
 
})

const SalesInvoiceRetunModal = mongoose.model('SalesInvoiceReturn', SalesInvoiceReturnSchema)

export default SalesInvoiceRetunModal