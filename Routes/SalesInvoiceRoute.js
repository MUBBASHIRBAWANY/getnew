import express from "express";
import { BulkpostSalesinvoice, createSalesInvoice, createSalesInvoiceBulk, deleteSaleInvoice, getAllSaleInvoice,  getInvoiceByClient,  getLimitedSaleInvoice,  getOnlyRemain,  postSalesinvoice, UpdateSalesInvoice } from "../Controllar/SalesInvoiceControllar.js";

const SalesInvoiceRouter = express.Router()

SalesInvoiceRouter.post('/', createSalesInvoice)
SalesInvoiceRouter.get('/', getAllSaleInvoice)
SalesInvoiceRouter.put('/UpdateSalesInvoice/:id' ,UpdateSalesInvoice)
SalesInvoiceRouter.delete('/SaleInvoiceDelete/:id', deleteSaleInvoice)
SalesInvoiceRouter.put('/ChangeStatus/:id', postSalesinvoice)
SalesInvoiceRouter.post('/PushinBulk', createSalesInvoiceBulk)
SalesInvoiceRouter.put('/BulkpostSalesinvoice' , BulkpostSalesinvoice)
SalesInvoiceRouter.get("/getLimitedSaleInvoice" ,  getLimitedSaleInvoice)
SalesInvoiceRouter.get('/getOnlyRemain' , getOnlyRemain)
SalesInvoiceRouter.get("/invoiceClient/:Client" , getInvoiceByClient)
export default SalesInvoiceRouter

