import mongoose from "mongoose";

const SubChannelSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    SubChanneName: {
        type: String,
        required: true
    },

})

const SubChannelModal = mongoose.model("SubChannel", SubChannelSchema)

export default SubChannelModal