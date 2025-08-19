import express from "express";
import { CreateTerrotory, updateTerrotory, getAllTerrotory, deleteTerrotory, getLastTerrotoryCode,  PushBulkDataInTerrotory,  } from "../Controllar/TerrotoryControllar.js";
const TerrotoryRouter = express.Router()


TerrotoryRouter.post('/', CreateTerrotory )
TerrotoryRouter.put('/UpdateTerrotory/:id', updateTerrotory)
TerrotoryRouter.get("/", getAllTerrotory)
TerrotoryRouter.get('/lastCode', getLastTerrotoryCode)
TerrotoryRouter.delete("/deleteTerrotory/:id", deleteTerrotory)
TerrotoryRouter.post("/PushBulkData", PushBulkDataInTerrotory)

export default TerrotoryRouter