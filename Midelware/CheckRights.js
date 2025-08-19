import mongoose from "mongoose"
import userRoleModel from '../modal/userRoleModal.js'
const CheckRights = async (req, res, next) => {
    console.log(req.query)
    try {
        const { role, pageName } = req.query;

        if (!pageName) {
            return res.status(400).json({ error: 'Page name not provided' });
        }

        if (!role) {
            return res.status(400).json({ error: 'Role not provided' });
        }

        // Fetch user roles from DB
        const data = await userRoleModel.find({ _id: role });
        console.log(data)
        if (data) {
            const allow = data[0].Roles.find((item) => item == pageName)
            
            if (allow) {
                next()
            } else {
                res.status(403).send(data[0].Roles)
            }

        }

        // All good — proceed to next middleware or route
        
    } catch (err) {
        console.error('Page check error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default CheckRights
