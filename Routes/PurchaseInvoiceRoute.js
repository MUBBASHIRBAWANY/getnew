import express from "express";
import { AddPurchaseInvoiceInbulk, createPurchaseInvoice, deletePurchcaseInvoice, getAllPurchaseInvoice, postPurchaseinvoice, updatePurchaseInvoice } from "../Controllar/PurchaseInvoiceControllar.js";

const PurchaseInvoiceRouter = express.Router()


PurchaseInvoiceRouter.post('/', createPurchaseInvoice),
PurchaseInvoiceRouter.get('/', getAllPurchaseInvoice),
PurchaseInvoiceRouter.put('/PurchaseInvoiceUpdate/:id' , updatePurchaseInvoice)
PurchaseInvoiceRouter.delete("/PurchaseInvoiceDelete/:id" , deletePurchcaseInvoice)
PurchaseInvoiceRouter.post('/AddinBulk', AddPurchaseInvoiceInbulk)
PurchaseInvoiceRouter.put('/Changestatus/:id', postPurchaseinvoice)


export default PurchaseInvoiceRouter



