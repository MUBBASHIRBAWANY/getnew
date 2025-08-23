import express from "express";
import { DeleteUser, GetUserById, GetUsers, UpdateUser, UserLogin, UserProfile, UserRegister } from "../Controllar/UserControllar.js";
const app = express()
const UserRouter = express.Router()



UserRouter.post('/',UserRegister)

UserRouter.post('/Login', UserLogin)
UserRouter.post('/profile', UserProfile)
UserRouter.get('/', GetUsers)
UserRouter.get('/user/:id', GetUserById)
UserRouter.put('/user/:id', UpdateUser)
UserRouter.delete('/user/:id' , DeleteUser)
export default UserRouter