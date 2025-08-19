
import express from "express";
import GernalLager from "../Controllar/GernalLagerControllar.js";

const GernalLagerRouter = express.Router()

GernalLagerRouter.get("/", GernalLager)


export default GernalLagerRouter