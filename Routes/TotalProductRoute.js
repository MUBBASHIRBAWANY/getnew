import express from "express";
import { getAllProductQty } from "../Controller/TotalProductControllar.js"


const TotalProductRouter = express.Router()

TotalProductRouter.get('/', getAllProductQty)


export default TotalProductRouter