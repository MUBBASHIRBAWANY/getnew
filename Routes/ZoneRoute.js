import express from "express";
import { CreateZone, deleteZone, getAllZone, getLastZoneCode, updateZone } from "../Controllar/ZoneControllar.js";

const ZoneRouter = express.Router()


ZoneRouter.post('/', CreateZone )
ZoneRouter.put('/updateZone/:id', updateZone)
ZoneRouter.get("/", getAllZone)
ZoneRouter.get('/lastCode', getLastZoneCode)
ZoneRouter.delete("/deleteZone/:id", deleteZone)

export default ZoneRouter