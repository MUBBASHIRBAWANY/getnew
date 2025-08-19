import express from "express";
import { AddPurchaseReturnInBulk, createPurchaseReturn, deletePurchaseReturn, getAllPurchaseReturns, postPurchaseReturn, updatePurchaseReturn } from "../Controllar/PurchaseReturnControllar.js";

const PurchaseReturnRouter = express.Router()


PurchaseReturnRouter.post('/', createPurchaseReturn),
PurchaseReturnRouter.get('/', getAllPurchaseReturns),
PurchaseReturnRouter.put('/PurchaseReturnUpdate/:id' , updatePurchaseReturn)
PurchaseReturnRouter.delete("/PurchaseReturnDelete/:id" , deletePurchaseReturn)
PurchaseReturnRouter.post('/AddinBulk', AddPurchaseReturnInBulk)
PurchaseReturnRouter.put('/Changestatus/:id', postPurchaseReturn)


export default PurchaseReturnRouter



