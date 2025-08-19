import express from "express";
import { getAllTransferIn, postTransferIn } from "../Controllar/InventoryTransferInControllar.js";
const InventoryTransferInRouter = express.Router();

InventoryTransferInRouter.get('/', getAllTransferIn);
InventoryTransferInRouter.put('/ChangeStatus/:id', postTransferIn);


export default InventoryTransferInRouter;