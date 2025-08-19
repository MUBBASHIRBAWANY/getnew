import express from "express";
import { CreateChannelType, deleteChannelType, getAllChannelType, getChannelTypeByVendor, getLastChannelTypeCode, PushBulkData, updateChannelType } from "../Controllar/ChannelTypeControllar.js";
const ChannelTypeRouter = express.Router()


ChannelTypeRouter.post('/', CreateChannelType )
ChannelTypeRouter.put('/updateChannelType/:id', updateChannelType)
ChannelTypeRouter.get("/", getAllChannelType)
ChannelTypeRouter.get("/lastcode", getLastChannelTypeCode)
ChannelTypeRouter.delete("/deleteChannelType/:id", deleteChannelType)
ChannelTypeRouter.get("/ChannelTypeByvendor/:vendor", getChannelTypeByVendor);
ChannelTypeRouter.post("/PushBulkData" , PushBulkData)

export default ChannelTypeRouter