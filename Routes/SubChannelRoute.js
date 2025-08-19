import express from "express";
import { CreateSubChannel, deleteSubChannel, getAllSubChannel, getSubChannelByChannel, getLastSubChannelCode,  PushBulkData, updateSubChannel } from "../Controllar/SubChannelControllar.js";
const SubChannelRouter = express.Router()


SubChannelRouter.post('/', CreateSubChannel )
SubChannelRouter.put('/updateSubChannel/:id', updateSubChannel)
SubChannelRouter.get("/", getAllSubChannel)
SubChannelRouter.get("/lastcode", getLastSubChannelCode)
SubChannelRouter.delete("/deleteSubChannel/:id", deleteSubChannel)
SubChannelRouter.get("/SubChannelByType/:ChanneType", getSubChannelByChannel);
SubChannelRouter.post("/PushBulkData" , PushBulkData)

export default SubChannelRouter