import express from "express";
import { deleteUser, getUserById, getUsers, updateUser, userLogin, userProfile, userRegister } from "../Controllar/userControllar.js";
import uploads from "../Midelware/CloudNaryHelper.js";
const app = express()
const UserRouter = express.Router()



UserRouter.post('/', uploads.fields([
    {name: 'image', maxCount: 1},
]),userRegister)

UserRouter.post('/Login', userLogin)
UserRouter.post('/profile', userProfile)
UserRouter.get('/', getUsers)
UserRouter.get('/user/:id', getUserById)
UserRouter.put('/user/:id', updateUser)
UserRouter.delete('/user/:id' , deleteUser)
export default UserRouter