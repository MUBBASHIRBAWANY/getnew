import mongoose from "mongoose";


const OpeningInventorySchema = mongoose.Schema({
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
    InvoetoryData : {
        type : Object,
        require : true
    },
    Status : {
        type : String,
        require : true
    }
})

const OpeningInventoryModal = mongoose.model("opening-Inventory" , OpeningInventorySchema)

export default OpeningInventoryModal