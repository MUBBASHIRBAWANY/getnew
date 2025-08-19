import express from "express";
import { AddCustomerInBulk, creatCutomer, CustomerByVendor, deletCutomer, getAllCutomer, getLastCutomer, updatCutomer } from "../Controllar/CostomerControllar.js";


const CustomorRouter = express.Router()

CustomorRouter.post('/', creatCutomer)
CustomorRouter.get('/', getAllCutomer)
CustomorRouter.get('/lastCustomor', getLastCutomer)
CustomorRouter.put('/updatCustomer/:id', updatCutomer)
CustomorRouter.delete('/deletCustomer/:id', deletCutomer)
CustomorRouter.get("/CustomerByVendor/:Vendor" , CustomerByVendor)
CustomorRouter.post("/AddInBulk", AddCustomerInBulk)

export default CustomorRouter