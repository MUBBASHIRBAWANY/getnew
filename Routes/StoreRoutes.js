import express from 'express'
import {CreateStore , updateStore , getAllStore , getLastStoreCode , deleteStore , PushBulkDataInStore, getStoreByLocation} from '../Controllar/StoreControllar.js'
const StoreRouter = express.Router()

StoreRouter.get('/', getAllStore),
StoreRouter.post('/', CreateStore),
StoreRouter.put('/UpdateStore/:id',updateStore ),
StoreRouter.post('/AddInBulk', PushBulkDataInStore ),
StoreRouter.delete('/deleteStore/:id', deleteStore),
StoreRouter.get('/lastCode', getLastStoreCode)
StoreRouter.get('/getStoreByLocation/:Location', getStoreByLocation)


export default StoreRouter