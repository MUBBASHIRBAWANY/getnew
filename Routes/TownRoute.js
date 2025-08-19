import express from "express";
import { CreateTown, updateTown, getAllTown, deleteTown, getLastTownCode,  PushBulkDataInTown,  } from "../Controllar/TownControllar.js";
const TownRouter = express.Router()


TownRouter.post('/', CreateTown )
TownRouter.put('/UpdateTown/:id', updateTown)
TownRouter.get("/", getAllTown)
TownRouter.get('/lastCode', getLastTownCode)
TownRouter.delete("/deleteTown/:id", deleteTown)
TownRouter.post("/PushBulkData", PushBulkDataInTown)

export default TownRouter