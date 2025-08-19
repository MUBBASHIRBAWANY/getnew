import mongoose, { Types } from "mongoose";

const DamageProductModalSchema = mongoose.Schema({
    ProductName : {
        type : String,
        required : true
    },
    TotalQuantity : {
        type : Number,
        required : true
    },
    Location :{
        type : String,
        required : true
    },
    Store : {
        type : String,
        required : true
    },
    AvgRate :{
        type : String,
        required : true
    },
    Amount :{
        type : Number,
        required : true
    }
})

const DamageProductModal = mongoose.model("DamageProduct", DamageProductModalSchema)
export default DamageProductModal