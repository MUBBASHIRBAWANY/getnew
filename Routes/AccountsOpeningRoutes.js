import express from 'express';
import { getAllAccountOpening, createAccountOpening, updateAccountOpening, deleteAccountOpening } from '../Controllar/AccountOpeningBalanceControllar.js';

const AccountOpeningRouter = express.Router();


    AccountOpeningRouter.get('/', getAllAccountOpening);
    AccountOpeningRouter.post('/' , createAccountOpening);
    AccountOpeningRouter.put('/updateAccountOpening/:id', updateAccountOpening);
    AccountOpeningRouter.delete('/deleteAccountOpening/:id', deleteAccountOpening);

    export default AccountOpeningRouter;

