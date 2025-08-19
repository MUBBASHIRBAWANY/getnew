import mongoose from "mongoose";

const ChartofAccountsSchema = mongoose.Schema({
    AccountCode: {
        type: String,
        required: true,
        unique: true
    },
    AccountName: {
        type: String,
        required: true
    },
    Stage: {
        type: String,
        required: true
    },
    Stage1: {
        type: String,
    },
    Stage2: {
        type: String,
    },
    Stage3: {
        type: String,
    },
    Type: {
        type: String,
    },
    masterCode: {
        type: String,
    },
});

const ChartofAccountsModel = mongoose.model('Chart-of-Accounts', ChartofAccountsSchema);

export default ChartofAccountsModel;
