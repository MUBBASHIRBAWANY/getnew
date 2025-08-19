import mongoose from "mongoose";


const InvoiceOpeningSchema = mongoose.Schema({
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
    InvoiceData : {
        type : Object,
        require : true
    }
})

const InvoiceOpeningModal = mongoose.model("Invoice-Opening" , InvoiceOpeningSchema)

export default InvoiceOpeningModal