import express from "express";
import { getSalesInvoiceByDate } from "../Controller/InventoryReportControllar.js";


const InventoryReportRoute = express.Router()

InventoryReportRoute.get("/GetDataByDate" , getSalesInvoiceByDate)



export default InventoryReportRoute