import express from "express";
import { AddCustomerInBulk, creatCutomer, CustomerByVendor, deletCutomer, getAllCutomer, getLastCutomer, updatCutomer } from "../Controllar/CostomerControllar.js";


export  const CustomorROuter = express.Router()

CustomorROuter.post('/', creatCutomer)
CustomorROuter.get('/', getAllCutomer)
CustomorROuter.get('/lastCustomor', getLastCutomer)
CustomorROuter.put('/updatCustomer/:id', updatCutomer)
CustomorROuter.delete('/deletCustomer/:id', deletCutomer)
CustomorROuter.get("/CustomerByVendor/:Vendor" , CustomerByVendor)
CustomorROuter.post("/AddInBulk", AddCustomerInBulk)

