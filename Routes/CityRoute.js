import express from "express";
import { CreateCity, deleteCity, getAllCity, getLastCityCodeByVendor, PushBulkDataInCity, updateCity } from "../Controllar/CItyControllar.js";

const CityRouter = express.Router()


CityRouter.get("/", getAllCity)
CityRouter.post("/" , CreateCity)
CityRouter.put("/updateCity/:id", updateCity)
CityRouter.get("/getLastByVendor/:vendor", getLastCityCodeByVendor)
CityRouter.delete("/deleteCity/:id", deleteCity)
CityRouter.post("/AddInBulk", PushBulkDataInCity)



export default CityRouter
