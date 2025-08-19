import express from "express";
import { AddProductInbulk, createProduct, deleteProduct, getAllProduct, getLastProduct, getProductbyMsku, updateProduct } from "../Controller/ProductControllar.js";
const ProductRouter = express.Router()


ProductRouter.post('/', createProduct )
ProductRouter.put('/updateProduct/:id', updateProduct)
ProductRouter.get("/", getAllProduct)
ProductRouter.get("/lastcode", getLastProduct)
ProductRouter.delete("/deleteProduct/:id", deleteProduct)
ProductRouter.get("/getProductByMsku/:MasterSKu" , getProductbyMsku)
ProductRouter.post("/AddinBulk", express.json({ limit: '50mb' }),AddProductInbulk)


export default ProductRouter