import express from "express";
import { CreateOrderBooker, deleteOrderBooker, getAllOrderBooker, getOrderBookerByVendor, getLastOrderBookerCode, PushBulkData, updateOrderBooker } from "../Controllar/OrderBookerControllar.js";
const OrderBookerRouter = express.Router()


OrderBookerRouter.post('/', CreateOrderBooker )
OrderBookerRouter.put('/updateOrderBooker/:id', updateOrderBooker)
OrderBookerRouter.get("/", getAllOrderBooker)
OrderBookerRouter.get("/lastcode", getLastOrderBookerCode)
OrderBookerRouter.delete("/deleteOrderBooker/:id", deleteOrderBooker)
OrderBookerRouter.get("/OrderByvendor/:vendor", getOrderBookerByVendor);
OrderBookerRouter.post("/PushBulkData" , PushBulkData)

export default OrderBookerRouter