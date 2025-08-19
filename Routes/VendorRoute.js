import express from "express";
import { createVendor, deleteVendor, getAllVendor, getLastVendorCode, PushBulkDataInVendor, updateVendor } from "../Controllar/VendorConrolar.js";


export  const VendorROuter = express.Router()

VendorROuter.post('/', createVendor)
VendorROuter.get('/', getAllVendor)
VendorROuter.get('/lastVendor', getLastVendorCode)
VendorROuter.put('/updateVendor/:id', updateVendor)
VendorROuter.delete('/deleteVendor/:id', deleteVendor)
VendorROuter.post('/AddBulkVendor', PushBulkDataInVendor)

