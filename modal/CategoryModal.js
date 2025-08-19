import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    CategoryName: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    mastercode: {
        type: String,
        required: true
    },
    salesFlowRef: {
        type: String,
    },
    CodeRef: {
        type: String,
        unique: true,
    }
})

const CategoryModal = mongoose.model("Product-Category", CategorySchema)

export default CategoryModal