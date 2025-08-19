import express from "express";
import { getAllProductQty } from "../Controllar/TotalProductControllar.js"


const TotalProductRouter = express.Router()

TotalProductRouter.get('/', getAllProductQty)


export default TotalProductRouter