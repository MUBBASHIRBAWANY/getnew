import express from "express";
import { CreateClientOpeningBalance, deleteOpeningBalance, EditOpeningBalance, getAllClientOpeningBalance } from "../Controllar/ClientOpeningBalanceControllar.js";

const ClientOpeningBalanceRouter = express.Router()

ClientOpeningBalanceRouter.get("/" , getAllClientOpeningBalance)
ClientOpeningBalanceRouter.post("/" , CreateClientOpeningBalance)
ClientOpeningBalanceRouter.delete("/deleteOpening/:id" , deleteOpeningBalance)
ClientOpeningBalanceRouter.put("/updateOpening/:id" , EditOpeningBalance)

export default ClientOpeningBalanceRouter