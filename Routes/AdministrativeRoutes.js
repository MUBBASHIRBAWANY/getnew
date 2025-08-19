import {updateAdministrative , GetAdministrative} from "../Controller/AdministrativeController.js"
import express from "express"

const AdministrativeRouter = express.Router()

AdministrativeRouter.get('/get/:id' , GetAdministrative)
AdministrativeRouter.put('/update/:id' , updateAdministrative)


export default AdministrativeRouter