import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    VoucherType: {
        type: String,
        required: true,
    },

    VoucherNumber: {
        type: String,
        required: true,
        Unique: true,
    },
    VoucherDate: {
        type: String,
        required: true,
    },
    VoucherMainAccount: {
        type: String,
    },
    VoucharData: {
        type: Array,
        required: true,
    },
    status: {
        type: String,
        default: false,
    },
    PaidFor: {
        type: String,
    },
    ChequeNumber: {
        type: String,
    },
    ChequeBook :{
        type: String,
    },
    TotalDebit: {
        type: String,

    },
    TotalCredit: {
        type: String,

    },
    PaidTo: {
        type: String,
    },


})


const VoucherModal = mongoose.model("Voucher", voucherSchema);
export default VoucherModal;



