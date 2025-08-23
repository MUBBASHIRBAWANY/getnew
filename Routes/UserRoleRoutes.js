import express from "express";
import { CreateRole, DeleteRole, GetAllUserRoleByID, GetAllUserRoles, RoleUpdate } from "../controllar/UserRoleControllar.js";
import CheckRights from "../Midelware/CheckRights.js";
const app = express()
const UserRoleRouter = express.Router()


UserRoleRouter.post('/',  CreateRole )
UserRoleRouter.get('/',  GetAllUserRoles )
UserRoleRouter.get('/role/:id',  GetAllUserRoleByID )
UserRoleRouter.put('/rolesUpdaate/:id' , RoleUpdate)
UserRoleRouter.delete('/DeleteRole/:id', DeleteRole)





export default UserRoleRouter