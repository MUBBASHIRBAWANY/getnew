import express from "express"
import db from "./db/db.js"
import UserRouter from "./Routes/UserRouter.js"
import cors from 'cors'
import DeparmentRouter from "./Routes/DeparmentRouter.js"
import BenifichryRouter from "./Routes/BenifichryRouter.js"
import TownRouter from "./Routes/TownRoute.js"
import RegionRouter from "./Routes/RegionRoutes.js"
import ZoneRouter from "./Routes/ZoneRoute.js"
import CustomorRouter from "./Routes/CustomorRoute.js"

const Router = express.Router()
const app = express()
app.use(cors());

let dataBase = db
dataBase()

export const users = app.use('/users', UserRouter)
export const DepartmentRoute = app.use('/dep', DeparmentRouter)
export const BenifichryRoute = app.use('/Benifichry', BenifichryRouter)
export const Town = app.use("/Town", TownRouter)
export const Region = app.use("/Region", RegionRouter)
export const Zone = app.use("/Zone", ZoneRouter)
export const Customer  = app.use("/Customor" , CustomorRouter)

