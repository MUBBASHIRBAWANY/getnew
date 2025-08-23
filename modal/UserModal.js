import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        unique: true,
        required: true,

    },

    password: {
        type: String,
        required: true,
        select: false
    },

    Cpassword: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String
    },
    lastname: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    selectRole: {
        type: String
    },
    createdBy: {
        type: String
    },
    updatedBy: {
        type: String
    },
    createDate: {
        type: String
    },
    updateDate: {
        type: String
    },
    Location: {
        type: Array,
        required: true,
    },
    Store: {
        type: Array,
        required: true,
    },
    Vendor: {
        type: Array,
        required: true,
    },
    userType : {
        type: String,
        required: true,
    },
    

})

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

export const comparePassword = (password, password2) => {
    return bcrypt.compare(password, password2)
}

export const getAuthontication = async function (val) {

    const token = jwt.sign({ val }, "peral-Dynamic", { expiresIn: "10 h" })

    return token
}



const userModel = mongoose.model('user', userSchema)

export default userModel