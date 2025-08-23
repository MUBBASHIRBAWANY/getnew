import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    VendorName: {
        type: String,
        required: true,
    },

    phone: {
        type: String
    },
    email: {
        type: String
    },
    Address: {
        type: String
    },
    NTN: {
        type: String
    },
    STN: {
        type: String
    },
    Fax: {
        type: String
    },
    WebSite: {
        type: String
    },
    ContactPerson: {
        type: String
    },
    PurchaseDate: {
        type: String
    },
    Zone: {
        type: String
    },
    Department: {
        type: String
    },
    Transport: {
        type: String
    },
    PriceList: {
        type: String
    },
    Transport: {
        type: String
    },
    DepPercent: {
        type: String
    },
    TargetedDiscountPercent: {
        type: String
    },
    TargetedDiscount: {
        type: String
    },
    CashDiscountPercent: {
        type: String
    },
    CashDiscountAmount: {
        type: String

    },
    AdvanceDiscountAmount: {
        type: String
    },
    AdvanceDiscountPercent: {
        type: String
    },
    salesFlowRef: {
        type: String,
        unique: true,

    },
    ShortCode : {
        type: String,
        unique: true,
    },
    Store : {
        type: Array
    },
      AccountCode : {
        type: String,
        unique: true,

    },
})


const VendorModel = mongoose.model('Vendor', VendorSchema)

export default VendorModel