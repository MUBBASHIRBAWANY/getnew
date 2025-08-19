
import { CreateOpeningInvoice, getAllOpeningInvoices, updateOpeningInvoice,deleteOpeningInvoice} from "../Controllar/OpeningInvoiceControllar.js";
import { Router } from "express";


const OpeningInvoiceRoutes = Router();  

OpeningInvoiceRoutes.get('/' , getAllOpeningInvoices)
OpeningInvoiceRoutes.post("/" , CreateOpeningInvoice)
OpeningInvoiceRoutes.put('/updateOpening/:id' , updateOpeningInvoice)
OpeningInvoiceRoutes.delete("/Deleteopening/:id" , deleteOpeningInvoice)


export default OpeningInvoiceRoutes