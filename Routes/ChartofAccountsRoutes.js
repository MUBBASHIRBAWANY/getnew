import express from "express";
import { CreateChartofAccounts,  deleteChartofAccounts, getAllChartofAccounts,  getONlyStage4,  updateChartofAccounts } from "../Controllar/ChartofAccountsControllars.js";


export  const ChartofAccountsROuter = express.Router()

ChartofAccountsROuter.post('/', CreateChartofAccounts)
ChartofAccountsROuter.get('/', getAllChartofAccounts)
ChartofAccountsROuter.put('/updatChartofAccounts/:id', updateChartofAccounts)
ChartofAccountsROuter.delete('/deletChartofAccounts/:id', deleteChartofAccounts)
ChartofAccountsROuter.get("/Stage4", getONlyStage4)