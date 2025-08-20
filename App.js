import express from "express"
import db from "./db/db.js"
import UserRouter from "./Routes/UserRouter.js"
import cors from 'cors'
import DeparmentRouter from "./Routes/DeparmentRouter.js"
import BenifichryRouter from "./Routes/BenifichryRouter.js"
import TownRouter from "./Routes/TownRoute.js"
import RegionRouter from "./Routes/RegionRoutes.js"
import ZoneRouter from "./Routes/ZoneRoute.js"
import CustomorRouter from "./Routes/CustomorRoute.js"
import UserRoleRouter from "./Routes/userRoleRoute.js"
import ChartofAccountsROuter from "./Routes/ChartofAccountsRoutes.js"
import StoreRouter from "./Routes/StoreRoutes.js"
import LocationRouter from "./Routes/LocationRoute.js"
import ProductRouter from "./Routes/ProductRoute.js"
import VendorROuter from "./Routes/VendorRoute.js"
import BookerRouter from "./Routes/BookerRoute.js"
import OpeninginventoryRoute from "./Routes/OpeninginventoryRoute.js"
import SaleOrderRouter from "./Routes/SaleOrderRoutes.js";
import SaleOrderDcRouter from "./Routes/SaleOrderDcRoutes.js";
import PurchaseInvoiceRouter from "./Routes/PurchaseInvoiceRoute.js";
import TotalProductRouter from "./Routes/TotalProductRoute.js";
import SalesInvoiceRouter from "./Routes/SalesInvoiceRoute.js";
import PurchaseReturnRouter from "./Routes/PurchaseReturnRoute.js"
import SalesInvoiceReturnRouter from "./Routes/SalesInvoiceReturnRoute.js"
import AccountOpeningRouter from "./Routes/AccountsOpeningRoutes.js"
import InventoryReportRoute from "./Routes/InvetoryReportRoute.js"
import AdministrativeRouter from "./Routes/AdministrativeRoutes.js"
import VoucherRouter from "./Routes/VoucherRoute.js"

const Router = express.Router()
const app = express()
app.use(cors());

let dataBase = db
dataBase()

export const users = app.use('/users', UserRouter)
export const Roles = app.use("/UserRole" , UserRoleRouter)
export const Store = app.use("/store", StoreRouter)
export const Location = app.use("/Location", LocationRouter)
export const Accounts = app.use("/ChartOfAccounts", ChartofAccountsROuter)
export const Product = app.use("/Product" , ProductRouter)
export const Vendor = app.use("/Vendor", VendorROuter)
export const Town = app.use("/Town", TownRouter)
export const Region = app.use("/Region", RegionRouter)
export const Zone = app.use("/Zone", ZoneRouter)
export const Customer  = app.use("/Customor" , CustomorRouter)
export const OrderBooker = app.use("/OrderBooker" , BookerRouter)
export const OpeningInventory = app.use("/Openinginventory" , OpeninginventoryRoute)
export const AccountOpeningRout = app.use("/AccountOpening", AccountOpeningRouter)
export const PurchaseInvoiceRoute = app.use("/purchaseInvoice", PurchaseInvoiceRouter);
export const TotalProductRoute = app.use("/totalProduct", TotalProductRouter);
export const SaleOrderRoute = app.use("/saleOrder", SaleOrderRouter);
export const SaleOrderDcRoute = app.use("/dcOrder", SaleOrderDcRouter);
export const PurchaseReturnRoute = app.use("/purchaseReturn", PurchaseReturnRouter);
export const SalesInvoiceReturnRoute = app.use("/salesInvoiceReturn", SalesInvoiceReturnRouter);
export const SalesInvoiceRoute = app.use("/saleInvoice", SalesInvoiceRouter);
export const InventoryReportRou =app.use("/inventoryReport", InventoryReportRoute);
export const AdministrativeRoute = app.use("/administrative", AdministrativeRouter);
export const VoucherRoute = app.use("/voucher", VoucherRouter);