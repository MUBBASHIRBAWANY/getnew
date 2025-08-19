import express from "express";


import { createChqBook, getChqBooks,  updateChqBook, deleteChqBook, createChq, getLastChqBook, updateChequeStatus, getOnlyOpenChqBook } from '../Controllar/ChqBookControllar.js';


const ChqBookRouter = express.Router();
ChqBookRouter.post('/', createChqBook);
ChqBookRouter.get('/', getChqBooks);
ChqBookRouter.put('/update/:id', updateChqBook);
ChqBookRouter.delete('/delete/:id', deleteChqBook);
ChqBookRouter.put("/createChq/:id" , createChq)
ChqBookRouter.get("/lastChqBook/:bank" , getLastChqBook)
ChqBookRouter.put("/ChangeStatus/:id" , updateChequeStatus)
ChqBookRouter.get('/OpenChq',  getOnlyOpenChqBook)


export default ChqBookRouter;