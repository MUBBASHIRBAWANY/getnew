import express from "express";
import { createBeneficiary, deleteBeneficiary, getAllBeneficiary, getBeneficiaryByDep, getBeneficiaryById, getBeneficiaryBycnic, lastToken, updateBeneficiary } from "../Controllar/BenifichryControllar.js";

const BenifichryRouter = express.Router();

BenifichryRouter.get('/', getAllBeneficiary)
BenifichryRouter.post('/', createBeneficiary)
BenifichryRouter.get('/BeneficiaryByDep/:dep', getBeneficiaryByDep)
BenifichryRouter.get('/Beneficiary/:id', getBeneficiaryById)
BenifichryRouter.put('/Beneficiary/:id', updateBeneficiary )
BenifichryRouter.delete('/Beneficiary/:id', deleteBeneficiary)
BenifichryRouter.get('/lasttoken', lastToken)
BenifichryRouter.get('/BeneficiaryCnic/:BeneficiaryCnic' , getBeneficiaryBycnic)
export default BenifichryRouter;
