import mongoose, { Types } from "mongoose";


const InventoryTransferOutSchema = ({
    TransferCode: {
        type: String,
        required: true

    },
    TransferOutDate: {
        type: String,
        required: true
    },
    LocationFrom: {
        type: String,
        required: true
    },
    LocationTo: {
        type: String,
        required: true
    },
    StoreFrom: {
        type: String,
        required: true
    },
    StoreTo: {
        type: String,
        required: true
    },
    PostStatus: {
        type: String,
        required: true
    },
    TransferData: {
        type: Array,
        required: true
    },
    SalesFlowRef: {
        type: String,
        required: true
    }

})

const InventoryTransferOutModal = mongoose.model('InventoryTransferOut', InventoryTransferOutSchema)
export default InventoryTransferOutModal