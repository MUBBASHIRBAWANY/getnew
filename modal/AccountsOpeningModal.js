import mongoose from "mongoose";


const AccountOpeningBalanceSchema = mongoose.Schema({
    DateStart :{
        type : String,
        Unique : true,
        require : true
    },
    DateEnd :{
        type : String,
        Unique : true,  
        require : true
    },
    AccountsData : {
        type : Object,
        require : true
    },
    Status : {
        type : String,
        require : true
    }
})

const AccountOpeningBalanceModal = mongoose.model("Account-Opening" , AccountOpeningBalanceSchema)

export default AccountOpeningBalanceModal