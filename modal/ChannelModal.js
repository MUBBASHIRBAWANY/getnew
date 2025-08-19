import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    ChanneName: {
        type: String,
        required: true
    },
    ChanneType: {
        type: String,
        required: true
    },
})

const ChannelModal = mongoose.model("Channel", ChannelSchema)

export default ChannelModal