import mongoose from "mongoose";

const OrderBookerSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    OrderBookerName: {
        type: String,
        required: true
    },
    Region: {
        type: String,
        required: true
    },

    PhoneNumber: {
        type: String,
    },
    Cnic: {
        type: String,
    },
    Address: {
        type: String,
    },
    masterCode: {
        type: String,
        required: true

    },
    OrderBooker :{
        type: String
    }

})

const OrderBookerModal = mongoose.model("Product-OrderBooker", OrderBookerSchema)

export default OrderBookerModal