import express from "express";
import { createRole, DeleteRole, getAllUserRoleByID, getAllUserRoles, RoleUpdate } from "../Controllar/userRoleControllar.js";
import CheckRights from "../Midelware/CheckRights.js";
const app = express()
const UserRoleRouter = express.Router()


UserRoleRouter.post('/',  createRole )
UserRoleRouter.get('/',  getAllUserRoles )
UserRoleRouter.get('/role/:id',  getAllUserRoleByID )
UserRoleRouter.put('/rolesUpdaate/:id' , RoleUpdate)
UserRoleRouter.delete('/DeleteRole/:id', DeleteRole)





export default UserRoleRouter

