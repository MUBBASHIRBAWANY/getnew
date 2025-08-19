import express from "express";
import { CreateBrand, deleteBrand, getAllBrand, getBrandbyCat, getLastBrandCode, PushBulkDataInBrand, updateBrand } from "../Controllar/BrandControllar.js";
const BrandRouter = express.Router()


BrandRouter.post('/', CreateBrand )
BrandRouter.put('/updateBrand/:id', updateBrand)
BrandRouter.get("/", getAllBrand)
BrandRouter.get("/LastCode", getLastBrandCode)
BrandRouter.delete("/deleteBrand/:id", deleteBrand)
BrandRouter.get("/getBrandByCat/:category" ,getBrandbyCat)
BrandRouter.post('/PushBulkData', PushBulkDataInBrand)


export default BrandRouter