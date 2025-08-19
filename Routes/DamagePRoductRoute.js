import express from "express";
import { getAllDamageProductQty } from "../Controller/DamageProductControllar.js";


const DamageProductRouter = express.Router()

DamageProductRouter.get('/', getAllDamageProductQty)


export default DamageProductRouter