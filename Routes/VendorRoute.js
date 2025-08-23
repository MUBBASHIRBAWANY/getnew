import express from "express";
import { createVendor, deleteVendor, getAllVendor, getLastVendorCode, PushBulkDataInVendor, updateVendor } from "../Controllar/VendorControllar.js";


export  const VendorRouter = express.Router()

VendorRouter.post('/', createVendor)
VendorRouter.get('/', getAllVendor)
VendorRouter.get('/lastVendor', getLastVendorCode)
VendorRouter.put('/updateVendor/:id', updateVendor)
VendorRouter.delete('/deleteVendor/:id', deleteVendor)
VendorRouter.post('/AddBulkVendor', PushBulkDataInVendor)

