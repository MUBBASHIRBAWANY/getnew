import express from 'express';
import { getAllVendorOpening, createVendorOpening, updateVendorOpening, deleteVendorOpening } from '../Controllar/VendorOpeningControllar.js';

const VendorOpeningRouter = express.Router();


    VendorOpeningRouter.get('/', getAllVendorOpening);
    VendorOpeningRouter.post('/' , createVendorOpening);
    VendorOpeningRouter.put('/updateVendorOpening/:id', updateVendorOpening);
    VendorOpeningRouter.delete('/deleteVendorOpening/:id', deleteVendorOpening);

    export default VendorOpeningRouter;

