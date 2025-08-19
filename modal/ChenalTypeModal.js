import mongoose from "mongoose";

const ChannelTypeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    ChanneTypeName: {
        type: String,
        required: true
    },

   
})

const ChannelTypeModal = mongoose.model("Channel-Type", ChannelTypeSchema)

export default ChannelTypeModal