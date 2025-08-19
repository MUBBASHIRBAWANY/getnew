import express from "express";
import { createRole, deleteRole, getAllUserRoleByID, getAllUserRoles, roleUpdate } from "../Controllar/userRoleControllar.js";
const app = express()
const UserRoleRouter = express.Router()


UserRoleRouter.post('/',  createRole )
UserRoleRouter.get('/',  getAllUserRoles )
UserRoleRouter.get('/role/:id',  getAllUserRoleByID )
UserRoleRouter.put('/rolesUpdaate/:id' , roleUpdate)
UserRoleRouter.delete('/DeleteRole/:id', deleteRole)





export default UserRoleRouter

