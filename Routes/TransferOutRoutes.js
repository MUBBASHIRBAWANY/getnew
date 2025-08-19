import express from "express";
import { createTransferOut, createTransferOutBulk, deleteTransferOut, getAllTransferOuts,  postTransferOut, updateTransferOut } from "../Controllar/InventoryTransferOutControllar.js";

const InventoryTransferOutRouter = express.Router()

InventoryTransferOutRouter.post('/', createTransferOut)
InventoryTransferOutRouter.get('/', getAllTransferOuts)
InventoryTransferOutRouter.put('/UpdateInventoryTransferOut/:id' ,updateTransferOut)
InventoryTransferOutRouter.delete('/InventoryTransferOut/:id', deleteTransferOut)
InventoryTransferOutRouter.put('/ChangeStatus/:id', postTransferOut)
InventoryTransferOutRouter.post('/PushinBulk', createTransferOutBulk)

export default InventoryTransferOutRouter

