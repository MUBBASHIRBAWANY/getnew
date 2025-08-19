import mongoose from "mongoose";

const storeSchema = mongoose.Schema({
    code: {
        type: String,
        requied: true
    },
    StoreName: {
        type: String,
        requied: true
    },
    Location: {
        type: String,
        requied: true
    }
})

const StoreModal = mongoose.model('store', storeSchema)

export default StoreModal