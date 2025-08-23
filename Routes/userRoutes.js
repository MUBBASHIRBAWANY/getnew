import express from "express";
import { deleteUser, getUserById, getUsers, updateUser, userLogin, userProfile, userRegister } from "../Controllar/userControllar.js";
const app = express()
const UserRouter = express.Router()



UserRouter.post('/',userRegister)

UserRouter.post('/Login', userLogin)
UserRouter.post('/profile', userProfile)
UserRouter.get('/', getUsers)
UserRouter.get('/user/:id', getUserById)
UserRouter.put('/user/:id', updateUser)
UserRouter.delete('/user/:id' , deleteUser)
export default UserRouter