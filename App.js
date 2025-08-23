import express from "express";
import cors from "cors";
import compression from "compression";
import db from "./db/db.js";

// Routers
import { VendorRouter } from "./Routes/VendorRoute.js";
import BrandRouter from "./Routes/BrandRoute.js";
import MasterSkuRouter from "./Routes/MasterSkuRoute.js";
import CategoryRouter from "./Routes/CategoryRoute.js";
import ProductRouter from "./Routes/ProductRoute.js";
import { CustomorROuter } from "./Routes/CustomorRoute.js";
import TerrotoryRouter from "./Routes/TerrotoryRoute.js";
import RegionRouter from "./Routes/RegionRoutes.js";
import TownRouter from "./Routes/TownRoute.js";
import ChannelTypeRouter from "./Routes/ChanneTypelRoute.js";
import ChannelRouter from "./Routes/ChannelRoute.js";
import SubChannelRouter from "./Routes/SubChannelRoute.js";
import CityRouter from "./Routes/CityRoute.js";
import SubLocalityRouter from "./Routes/SubLocalityRoute.js";
import PurchaseInvoiceRouter from "./Routes/PurchaseInvoiceRoute.js";
import TotalProductRouter from "./Routes/TotalProductRoute.js";
import SalesInvoiceRouter from "./Routes/SalesInvoiceRoute.js";
import OrderBookerRouter from "./Routes/OrderBookerRoute.js";
import OpeninginventoryRoute from "./Routes/OpeninginventoryRoute.js";
import InventoryReportRoute from "./Routes/InvetoryReportRoute.js";
import StoreRouter from "./Routes/StoreRoutes.js";
import LocationRouter from "./Routes/LocationRoute.js";
import InventoryTransferOutRouter from "./Routes/TransferOutRoutes.js";
import InventoryTransferInRouter from "./Routes/TransferInRoutes.js";
import SalesInvoiceReturnRouter from "./Routes/SalesInvoiceReturnRoute.js";
import PurchaseReturnRouter from "./Routes/PurchaseReturnRoute.js";
import StockReplacementRouter from "./Routes/StockReplacementRoute.js";
import DamageProductRouter from "./Routes/DamagePRoductRoute.js";
import { ChartofAccountsROuter } from "./Routes/ChartofAccountsRoutes.js";
import AdministrativeRouter from "./Routes/AdministrativeRoutes.js";
import ClientOpeningBalanceRouter from "./Routes/ClientOpeningBalance.js";
import VendorOpeningRouter from "./Routes/VendorOpeningRoutes.js";
import AccountOpeningRouter from "./Routes/AccountsOpeningRoutes.js";
import OpeningInvoiceRoutes from "./Routes/OpeningInvoiceRoutes.js";
import VoucherRouter from "./Routes/VoucherRoute.js";
import ChqBookRouter from "./Routes/ChqBookRoutes.js";
import GernalLagerRouter from "./Routes/GernalLagerReportRoutes.js";
import ZoneRouter from "./Routes/ZoneRoute.js";
import SaleOrderRouter from "./Routes/SaleOrderRoutes.js";
import SaleOrderDcRouter from "./Routes/SaleOrderDcRoutes.js";
import UserRoleRouter from "./Routes/UserRoleRoutes.js";
import UserRouter from "./Routes/UserRouter.js";

const app = express();

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database connect
await db();

// Routers
export const users = app.use("/users", UserRouter)
export const UserRoleRoute = app.use("/userRole", UserRoleRouter)
export const VendorRoute = app.use("/vendor", VendorRouter);
export const ProductRoute = app.use("/product", ProductRouter);
export const CustomorROute = app.use("/Customor", CustomorROuter);
export const TerrotoryRoute = app.use("/terrotory", TerrotoryRouter);
export const RegionRoute = app.use("/region", RegionRouter);
export const TownRoute = app.use("/town", TownRouter);
export const ChannelTypeRoute = app.use("/channelType", ChannelTypeRouter);
export const ChannelRoute = app.use("/channel", ChannelRouter);
export const SubChannelRoute = app.use("/subChannel", SubChannelRouter);
export const CityRoute = app.use("/city", CityRouter);
export const SubLocalityRoute = app.use("/subLocality", SubLocalityRouter);
export const PurchaseInvoiceRoute = app.use("/purchaseInvoice", PurchaseInvoiceRouter);
export const TotalProductRoute = app.use("/totalProduct", TotalProductRouter);
export const SalesInvoiceRoute = app.use("/saleInvoice", SalesInvoiceRouter);
export const OrderBookerRoute = app.use("/orderBooker", OrderBookerRouter);
export const Openinginventory = app.use("/openingInventory", OpeninginventoryRoute);
export const InventoryReportRou =app.use("/inventoryReport", InventoryReportRoute);
export const StoreRoute =app.use("/store", StoreRouter);
export const LocationRoute =app.use("/location", LocationRouter);
export const ChartofAccountsROute =app.use("/chartOfAccounts", ChartofAccountsROuter);
export const AdministrativeRoute = app.use("/administrative", AdministrativeRouter);
export const AccountOpeningRoute = app.use("/accountOpening", AccountOpeningRouter);
export const OpeningInvoiceRoute = app.use("/openingInvoice", OpeningInvoiceRoutes);
export const VoucherRoute = app.use("/voucher", VoucherRouter);
export const GernalLagerRoute = app.use("/generalLedger", GernalLagerRouter);
export const ZoneRoute = app.use("/zone", ZoneRouter);
export const SaleOrderRoute = app.use("/saleOrder", SaleOrderRouter);
export const SaleOrderDcRoute = app.use("/dcOrder", SaleOrderDcRouter);
export const PurchaseReturnRoute = app.use("/purchaseReturn", PurchaseReturnRouter);
export const SalesInvoiceReturnRoute = app.use("/salesInvoiceReturn", SalesInvoiceReturnRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
