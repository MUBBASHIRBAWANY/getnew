import express from "express";
import { createSalesReturn, createSalesInvoiceReturnBulk, deleteSalesReturn, getAllSalesReturn,  postSalesReturn, updateSalesReturn } from "../Controllar/SalesInvoiceReturnControllar.js";

const SalesInvoiceReturnRouter = express.Router()

SalesInvoiceReturnRouter.post('/', createSalesReturn)
SalesInvoiceReturnRouter.get('/', getAllSalesReturn)
SalesInvoiceReturnRouter.put('/UpdateSalesInvoiceReturn/:id' ,updateSalesReturn)
SalesInvoiceReturnRouter.delete('/SaleInvoiceDelete/:id', deleteSalesReturn)
SalesInvoiceReturnRouter.put('/ChangeStatus/:id', postSalesReturn)
SalesInvoiceReturnRouter.post('/PushinBulk', createSalesInvoiceReturnBulk)

export default SalesInvoiceReturnRouter

