import express from "express";
import { CreateChannel, deleteChannel, getAllChannel, getChannelByType, getLastChannelCode, PushBulkData, updateChannel } from "../Controllar/ChannelControllar.js";
const ChannelRouter = express.Router()


ChannelRouter.post('/', CreateChannel )
ChannelRouter.put('/updateChannel/:id', updateChannel)
ChannelRouter.get("/", getAllChannel)
ChannelRouter.get("/lastcode", getLastChannelCode)
ChannelRouter.delete("/deleteChannel/:id", deleteChannel)
ChannelRouter.post("/PushBulkData" , PushBulkData)

export default ChannelRouter