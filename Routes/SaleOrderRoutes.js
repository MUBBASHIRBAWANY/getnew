import express from "express";
import { CreateSaleOrder, deleteSaleOrder, getAllSaleOrder, getLastSaleOrderCode, updateOrderStatus, updateSaleOrder } from "../Controllar/SaleOrderControllar.js";
const SaleOrderRouter = express.Router()


SaleOrderRouter.post('/', CreateSaleOrder )
SaleOrderRouter.put('/updateSaleOrder/:id', updateSaleOrder)
SaleOrderRouter.get("/", getAllSaleOrder)
SaleOrderRouter.get("/lastcode", getLastSaleOrderCode)
SaleOrderRouter.delete("/deleteSaleOrder/:id", deleteSaleOrder)
SaleOrderRouter.put("/ChangeStatus/:id" , updateOrderStatus)


export default SaleOrderRouter