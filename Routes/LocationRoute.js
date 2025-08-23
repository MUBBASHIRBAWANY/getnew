import express from 'express'
import {Createlocation, deletelocation, getAlllocation, getLastlocationCode, PushBulkDataInlocation, updatelocation , } from '../Controllar/LocationControllar.js'
const LocationRouter = express.Router()

LocationRouter.get('/', getAlllocation),
LocationRouter.post('/', Createlocation),
LocationRouter.put('/Updatelocation/:id',updatelocation ),
LocationRouter.post('/AddInBulk', PushBulkDataInlocation ),
LocationRouter.delete('/deletelocation/:id', deletelocation),
LocationRouter.get('/lastCode', getLastlocationCode)


export default LocationRouter