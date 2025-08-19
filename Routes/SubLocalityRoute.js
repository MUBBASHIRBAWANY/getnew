import express from "express";
import { CreateSubLocality, deleteSubLocality, getAllSubLocality,  getSubLocalityByLocality, PushBulkDataInSubLocality, updateSubLocality } from "../Controllar/SubLocalityControllar.js";

const SubLocalityRouter = express.Router()


SubLocalityRouter.get("/", getAllSubLocality)
SubLocalityRouter.post("/" , CreateSubLocality)
SubLocalityRouter.put("/updateSubLocality/:id", updateSubLocality)
SubLocalityRouter.get("/getLastByLocality/:Locality", getSubLocalityByLocality)
SubLocalityRouter.delete("/deleteSubLocality/:id", deleteSubLocality)
SubLocalityRouter.post("/AddInBulk", PushBulkDataInSubLocality)



export default SubLocalityRouter
