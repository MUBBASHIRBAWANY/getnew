import express from "express";
import { getSalesInvoiceByDate } from "../Controllar/InventoryReportControllar.js";


const InventoryReportRoute = express.Router()

InventoryReportRoute.get("/GetDataByDate" , getSalesInvoiceByDate)



export default InventoryReportRoute