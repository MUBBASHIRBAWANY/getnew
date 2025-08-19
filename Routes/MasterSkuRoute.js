import express from "express";
import { CreateMasterSKu, updateMasterSKu, getAllMasterSKu, deleteMasterSKu, getLastMasterSKuCode, getMskuByBrand, PushBulkDataInMaster } from "../Controllar/MasterSKuControllar.js";
const MasterSkuRouter = express.Router()


MasterSkuRouter.post('/', CreateMasterSKu )
MasterSkuRouter.put('/updateMasterSku/:id', updateMasterSKu)
MasterSkuRouter.get("/", getAllMasterSKu)
MasterSkuRouter.get('/lastCode', getLastMasterSKuCode)
MasterSkuRouter.delete("/deleteMasterSku/:id", deleteMasterSKu)
MasterSkuRouter.get("/mskubybrand/:brand", getMskuByBrand)
MasterSkuRouter.post("/PushBulkData", PushBulkDataInMaster)

export default MasterSkuRouter