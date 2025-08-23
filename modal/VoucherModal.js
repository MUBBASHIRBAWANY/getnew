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
    DebitAccount: {
        type: String,
    },
    CreditAccount: {
        type: String,
    },
    VoucharData: {
        type: Array,
        required: true,
    },
    status: {
        type: String,
        
    },
   
    Cheque: {
        type: String,
    },
    Remarks :  {
        type: String,
    },
   
    TotalDebit: {
        type: String,

    },
    TotalCredit: {
        type: String,

    },


})


const VoucherModal = mongoose.model("Voucher", voucherSchema);
export default VoucherModal;



