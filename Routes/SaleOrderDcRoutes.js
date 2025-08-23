import express from "express";
import { CreateSaleOrderDC, DeleteSaleOrderDC, GetAllSaleOrderDC, LastSaleOrderDC, updateOrderStatusDC, UpdateSaleOrderDC } from "../Controllar/SaleOrderDcControllar.js";
const SaleOrderDcRouter = express.Router()


SaleOrderDcRouter.post('/', CreateSaleOrderDC )
SaleOrderDcRouter.put('/updateSaleOrder/:id', UpdateSaleOrderDC)
SaleOrderDcRouter.get("/", GetAllSaleOrderDC)
SaleOrderDcRouter.get("/lastcode", LastSaleOrderDC)
SaleOrderDcRouter.delete("/deleteSaleOrder/:id", DeleteSaleOrderDC)
SaleOrderDcRouter.put("/ChangeStatus/:id" , updateOrderStatusDC)


export default SaleOrderDcRouter