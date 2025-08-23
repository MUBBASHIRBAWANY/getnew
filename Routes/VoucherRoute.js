import {createVoucher, getVouchers, getVoucherByCode, updateVoucher, deleteVoucher, createSystemVoucher, getVoucherById, getVoucherByNumber, deleteVoucherByNumber, getOnlyCreditSide, AdjustVoucherInvoice} from '../Controllar/VoucherControllar.js';


import express from 'express';
const VoucherRouter = express.Router();

VoucherRouter.post('/', createVoucher);
VoucherRouter.get('/', getVouchers);
VoucherRouter.get('/GetLastVouher/:VoucherType', getVoucherByCode);
VoucherRouter.put('/update/:id', updateVoucher);
VoucherRouter.delete('/delete/:id', deleteVoucher);
VoucherRouter.post("/createSystemVoucher" , createSystemVoucher)
VoucherRouter.get("/getVoucherById/:id", getVoucherById)
VoucherRouter.get("/getVoucherByNumber/:VoucherNumber" , getVoucherByNumber)
VoucherRouter.delete('/deleteVoucher/:VoucherNumber' , deleteVoucherByNumber)
VoucherRouter.get("/getOnlyCredit/:Account" , getOnlyCreditSide)
VoucherRouter.put("/AdjustVoucher" , AdjustVoucherInvoice)
export default VoucherRouter;
