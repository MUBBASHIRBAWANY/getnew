import mongoose from "mongoose";

const AdministrativeSchema = new mongoose.Schema({
    CashAccountFrom: {
        type: String,
        required: true
    },
    CashAccountTo: {
        type: String,
        required: true
    },
    BankAccountFrom: {
        type: String,
        required: true
    },
    BankAccountTo: {
        type: String,
        required: true
    },
    finishedGoods: {
        type: String,
    },
    Client: {
        type: String,
    },
    VendorFrom: {
        type: String,
    },
    VendorTo: {
        type: String,
    },
    CustomerFrom: {
        type: String,
    },
    CustomerTo: {
        type: String,
    },
    Gst: {
        type: String,
    },
    AdvanceTax: {
        type: String,
    },
    PurchaseDiscount: {
        type: String,
    },
    TradeDiscount: {
        type: String,
    },
    SaleDiscount: {
        type: String,
    },
    DitributerDiscount: {
        type: String,
    },
    salesRevenue: {
        type: String,
    },
    WithholdingTax: {
        type: String,
    },
    COSTOFSALES : {
        type: String,
    },
    DAMAGEEXPIRECLAIM : {
        type: String,

    }
})


const AdministrativeModal = mongoose.model("Administrative", AdministrativeSchema)

export default AdministrativeModal