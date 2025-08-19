import express from "express";
import { createStockReplacement, createStockReplacementBulk, deleteStockReplacement, getAllStockReplacement,  postStockReplacement, UpdateStockReplacement } from "../Controller/StockReplacementControllar.js";
import { BulkpostSalesinvoice } from "../Controller/SalesInvoiceControllar.js";

const StockReplacementRouter = express.Router()

StockReplacementRouter.post('/', createStockReplacement)
StockReplacementRouter.get('/', getAllStockReplacement)
StockReplacementRouter.put('/UpdateStockReplacement/:id' ,UpdateStockReplacement)
StockReplacementRouter.delete('/StockReplacementDelete/:id', deleteStockReplacement)
StockReplacementRouter.put('/ChangeStatus/:id', postStockReplacement)
StockReplacementRouter.post('/PushinBulk', createStockReplacementBulk)

export default StockReplacementRouter

