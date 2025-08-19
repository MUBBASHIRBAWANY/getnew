import express from "express";
import { createDep, deleteDep, getAllDep, updateDep } from "../Controllar/DepControllar.js";

const app = express()
const DeparmentRouter = express.Router()


DeparmentRouter.get('/', getAllDep )
DeparmentRouter.post('/', createDep)
DeparmentRouter.put('/update/:id', updateDep)
DeparmentRouter.delete('/delete/:id', deleteDep)
export default DeparmentRouter;


