import express from "express";
import { CreateCategory, deleteCategory, getAllCategory, getCategoryByVendor, getLastCategoryCode, PushBulkData, updateCategory } from "../Controllar/CategoryControllar.js";
const CategoryRouter = express.Router()


CategoryRouter.post('/', CreateCategory )
CategoryRouter.put('/updateCategory/:id', updateCategory)
CategoryRouter.get("/", getAllCategory)
CategoryRouter.get("/lastcode", getLastCategoryCode)
CategoryRouter.delete("/deleteCategory/:id", deleteCategory)
CategoryRouter.get("/catByvendor/:vendor", getCategoryByVendor);
CategoryRouter.post("/PushBulkData" , PushBulkData)

export default CategoryRouter