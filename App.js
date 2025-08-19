import express from "express"
import cors from 'cors'
import db from "./db/db.js"
import UserRouter from "./Routes/userRoutes.js"
import UserRoleRouter from "./Routes/userRoleRoute.js"
import { VendorROuter } from "./Routes/VendorRoute.js"
import BrandRouter from "./Routes/BrandRoute.js"
import MasterSkuRouter from "./Routes/MasterSkuRoute.js"
import CategoryRouter from "./Routes/CategoryRoute.js"
import ProductRouter from "./Routes/ProductRoute.js"
import { CustomorROuter } from "./Routes/CustomorRoute.js"
import TerrotoryRouter from "./Routes/TerrotoryRoute.js"
import RegionRouter from "./Routes/RegionRoutes.js"
import TownRouter from "./Routes/TownRoute.js"
import ChannelTypeRouter from "./Routes/ChanneTypelRoute.js"
import ChannelRouter from "./Routes/ChannelRoute.js"
import SubChannelRouter from "./Routes/SubChannelRoute.js"
import CityRouter from "./Routes/CityRoute.js"
import SubLocalityRouter from "./Routes/SubLocalityRoute.js"
import PurchaseInvoiceRouter from './Routes/PurchaseInvoiceRoute.js'
import TotalProductRouter from "./Routes/TotalProductRoute.js"
import SalesInvoiceRouter from "./Routes/SalesInvoiceRoute.js"
import OrderBookerRouter from "./Routes/OrderBookerRoute.js"
import OpeninginventoryRoute from "./Routes/OpeninginventoryRoute.js"
import InventoryReportRoute from "./Routes/InvetoryReportRoute.js"
import StoreRouter from "./Routes/StoreRoutes.js"
import LocationRouter from "./Routes/LocationRoute.js"
import InventoryTransferOutRouter from "./Routes/TransferOutRoutes.js"
import InventoryTransferInRouter from "./Routes/TransferInRoutes.js"
import SalesInvoiceReturnRouter from "./Routes/SalesInvoiceReturnRoute.js"
import PurchaseReturnRouter from "./Routes/PurchaseReturnRoute.js"
import StockReplacementRouter from "./Routes/StockReplacementRoute.js"
import DamageProductRouter from "./Routes/DamagePRoductRoute.js"
import { ChartofAccountsROuter } from "./Routes/ChartofAccountsRoutes.js"
import AdministrativeRouter from "./Routes/AdministrativeRoutes.js"
import ClientOpeningBalanceRouter from "./Routes/ClientOpeningBalance.js"
import VendorOpeningRouter from "./Routes/VendorOpeningRoutes.js"
import AccountOpeningRouter from "./Routes/AccountsOpeningRoutes.js"
import OpeningInvoiceRoutes from "./Routes/OpeningInvoiceRoutes.js"
import VoucherRouter from "./Routes/VoucherRoute.js"
import ChqBookRouter from "./Routes/ChqBookRoutes.js"
import GernalLagerRouter from "./Routes/GernalLagerReportRoutes.js"
import compression from "compression"
import ZoneRouter from "./Routes/ZoneRoute.js"
import SaleOrderRouter from "./Routes/SaleOrderRoutes.js"
import SaleOrderDcRouter from "./Routes/SaleOrderDcRoutes.js"
const Router = express.Router()
const app = express();
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50000mb' }));
app.use(express.urlencoded({ limit: '50000mb', extended: true }));

let dataBase = db()
export const users = app.use('/users', UserRouter)
export const Roles = app.use('/userRole', UserRoleRouter)
export const vendor = app.use('/vendor', VendorROuter)
export const Product = app.use('/Product', ProductRouter)
export const Customer  = app.use('/customer', CustomorROuter)
export const Terrotory= app.use('/Terrotory', TerrotoryRouter)
export const Region = app.use('/Region', RegionRouter)
export const Town = app.use("/Town", TownRouter)
export const ChanelType = app.use("/chanelType", ChannelTypeRouter)
export const Channel = app.use("/Channel", ChannelRouter)
export const SubChannel = app.use("/SubChannel", SubChannelRouter)
export const City = app.use("/City", CityRouter)
export const SubLocality = app.use('/SubLocality', SubLocalityRouter)
export const PurchaseInvoice = app.use("/PurchaseInvoice" , PurchaseInvoiceRouter)
export const TotalProduct = app.use('/TotalProduct', TotalProductRouter)
export const SaleInvoice = app.use('/SaleInvoice' , SalesInvoiceRouter)
export const OrderBooker = app.use("/OrderBooker", OrderBookerRouter)
export const Openinginventory = app.use("/Openinginventory" , OpeninginventoryRoute)
export const InventoryReport = app.use('/InventoryReport', InventoryReportRoute)
export const StoreRouute = app.use('/Store', StoreRouter)
export const LocationRouute = app.use('/Location', LocationRouter)
export const ChartofAccountsROute = app.use("/ChartofAccounts", ChartofAccountsROuter)
export const AdministrativeRoute = app.use("/Administrative", AdministrativeRouter)
export const AccountOpening = app.use("/AccountOpening", AccountOpeningRouter)
export const OpeningInvoiceRoute = app.use('/OpeningInvoice' , OpeningInvoiceRoutes)
export const VoucherRoute  = app.use('/Voucher', VoucherRouter);
export const GernalLager = app.use("/GernalLager" , GernalLagerRouter)
export const ZoneRoute = app.use("/Zone" , ZoneRouter)
export const SaleOrderRoute = app.use("/SaleOrder" , SaleOrderRouter)
export const DcOrderROute = app.use("/DcOrder" , SaleOrderDcRouter)