import mongoose from "mongoose";

 const CutomerSchema = new mongoose.Schema({
   code :{
        type : String,
        required : true
    },
   
    CutomerName : {
        type: String,
        required : true,    
    },
 
    phone :{
        type : String
    },
    email : {
        type : String
    },
    
    Address : {
        type : String
    },
    NTN : {
        type : String
    },
    STN : {
        type : String
    }, 
    Fax : {
        type : String
    },
    WebSite : {
        type : String
    }, 
    ShopOwner : {
        type : String
    },
    ShopRegisterDate : {
        type : String
    },
    Zone  : {
        type : String
    },
    Region : {
        type : String
    },
    City : {
        type : String
    },
    Terrotory  : {
        type : String
    },
    AdvanceTaxApply : {
        type : String
    },
    Filler : {
        type : String
    },
    Registered : {
        type : String
    },
    Status : {
        type : String
    },
     OwnerCnic : {
        type : String
    },
    AccountCode :{
        type : String
    }

 })


 const CutomerModal = mongoose.model('Cutomer', CutomerSchema)

 export default CutomerModal