import express from "express";
import { CreateOrderBooker, deleteOrderBooker, getAllOrderBooker, getOrderBookerByVendor, getLastOrderBookerCode,  updateOrderBooker } from "../Controllar/OrderBookerController.js";
const OrderBookerRouter = express.Router()


OrderBookerRouter.post('/', CreateOrderBooker )
OrderBookerRouter.put('/updateOrderBooker/:id', updateOrderBooker)
OrderBookerRouter.get("/", getAllOrderBooker)
OrderBookerRouter.get("/lastcode", getLastOrderBookerCode)
OrderBookerRouter.delete("/deleteOrderBooker/:id", deleteOrderBooker)
OrderBookerRouter.get("/OrderByvendor/:vendor", getOrderBookerByVendor);

export default OrderBookerRouter