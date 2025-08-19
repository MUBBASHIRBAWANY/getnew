import express from "express";
import { changeStatusOnly, createOpennigBalance, deleteOpeningInvetory, genrateNewYear, getAllOpeningInventory, UpdateOpeningInvetory } from "../Controllar/OpeningControllar.js";

const OpeninginventoryRoute = express.Router()

OpeninginventoryRoute.post('/', createOpennigBalance)
OpeninginventoryRoute.get('/' , getAllOpeningInventory)
OpeninginventoryRoute.put('/updateOpningInventory/:id', UpdateOpeningInvetory)
OpeninginventoryRoute.delete("/DeleteOpeningInventory/:id" , deleteOpeningInvetory)
OpeninginventoryRoute.put('/ChnageStatusOnly/:id', changeStatusOnly)
OpeninginventoryRoute.post("/genrateNewYear" , genrateNewYear)



export default OpeninginventoryRoute