import express from "express";
import { CreateRegion, updateRegion, getAllRegion, deleteRegion, getLastRegionCode,  PushBulkDataInRegion,  } from "../Controllar/RegionControlar.js";
const RegionRouter = express.Router()


RegionRouter.post('/', CreateRegion )
RegionRouter.put('/UpdateRegion/:id', updateRegion)
RegionRouter.get("/", getAllRegion)
RegionRouter.get('/lastCode', getLastRegionCode)
RegionRouter.delete("/deleteRegion/:id", deleteRegion)
RegionRouter.post("/PushBulkData", PushBulkDataInRegion)

export default RegionRouter