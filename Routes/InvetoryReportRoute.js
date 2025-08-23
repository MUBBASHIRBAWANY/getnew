import express from "express";
import { getSalesInvoiceByDate } from "../Controllar/InventoryReportControllar.js";
import { allSalesDumpData } from "../Controllar/SalesDataDumpReport.js";
import { allPurchaseDumpData } from "../Controllar/PurchaseDumpData.js";



const InventoryReportRoute = express.Router()

InventoryReportRoute.get("/GetDataByDate" , getSalesInvoiceByDate)
InventoryReportRoute.get("/SalesDumpData" , allSalesDumpData)
InventoryReportRoute.get("/PurchaseDumpData" , allPurchaseDumpData)




export default InventoryReportRoute