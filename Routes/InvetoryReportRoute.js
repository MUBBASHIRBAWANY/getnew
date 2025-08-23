import express from "express";
import { getSalesInvoiceByDate } from "../Controllar/InventoryReportControllar.js";
import { allSalesDumpData } from "../Controllar/SalesDataDumpReport.js";


const InventoryReportRoute = express.Router()

InventoryReportRoute.get("/GetDataByDate" , getSalesInvoiceByDate)
InventoryReportRoute.get("/SalesDumpData" , allSalesDumpData)



export default InventoryReportRoute