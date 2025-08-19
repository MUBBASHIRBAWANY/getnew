import {updateAdministrative , GetAdministrative} from "../Controllar/AdministrativeControllar.js"
import express from "express"

const AdministrativeRouter = express.Router()

AdministrativeRouter.get('/get/:id' , GetAdministrative)
AdministrativeRouter.put('/update/:id' , updateAdministrative)


export default AdministrativeRouter