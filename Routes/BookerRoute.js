import express from "express";
import { CreateOrderBooker, deleteOrderBooker, getAllOrderBooker, getOrderBookerByVendor, getLastOrderBookerCode, PushBulkData, updateOrderBooker } from "../Controllar/BookerControllar.js";
const BookerRouter = express.Router()


BookerRouter.post('/', CreateOrderBooker )
BookerRouter.put('/updateOrderBooker/:id', updateOrderBooker)
BookerRouter.get("/", getAllOrderBooker)
BookerRouter.get("/lastcode", getLastOrderBookerCode)
BookerRouter.delete("/deleteOrderBooker/:id", deleteOrderBooker)
BookerRouter.get("/OrderByvendor/:vendor", getOrderBookerByVendor);
BookerRouter.post("/PushBulkData" , PushBulkData)

export default BookerRouter