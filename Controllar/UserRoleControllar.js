import userRoleModel from "../modal/userRoleModal.js";


const UserRoles = userRoleModel
export const createRole = async (req,res)=>{

console.log(req.body)
    const { RoleName, Roles,createdBy,  updatedBy, createDate} = req.body;
    try {
       const data = await UserRoles.create({ RoleName, Roles,createdBy,  updatedBy,  createDate})
       res.send("data Add")
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
}

export const getAllUserRoles = async (req,res) =>{
    console.log(req)
    try{
        const Roles = await UserRoles.find();
        res.status(200).send({status: true, data: Roles });
    }catch(err){
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}

export const getAllUserRoleByID = async (req,res) =>{
    const {id} = req.params
    try{
        const Roles = await UserRoles.findById(id);
        res.status(200).send({status: true, data: Roles });
    }catch(err){
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}

export const RoleUpdate = async (req, res) =>{
    const {id} = req.params
    try{ 
        console.log(req.body)
        const Roles = await UserRoles.findByIdAndUpdate(id, req.body);
        res.status(200).send({status: true, data: Roles });
    }catch(err){
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}

export const DeleteRole = async (req, res) =>{
    const {id} = req.params
    console.log(id)
    try{
        const Roles = await UserRoles.findByIdAndDelete(id);
        res.status(200).send({status: true, data: Roles });
    }catch(err){
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}