import express from "express";
import userModel, { comparePassword, getAuthontication, hashPassword } from "../modal/UserModal.js";
import jwt from "jsonwebtoken";

const User = userModel
export const userRegister = async (req, res) => {
    console.log(req.body)
    try {
        const { firstname, email, password, Cpassword, lastname, phoneNumber, createdBy, createDate, selectRole, Location, Store, Vendor , userType } = req.body;
        if (!firstname || !password || !Cpassword || !lastname || !phoneNumber) {
            return res.status(400).send("All fields are required");
        }

        const hashPassword1 = await hashPassword(password);
        console.log(hashPassword1)
        const newUser = await User.create({
            firstname: firstname,
            email,
            password: hashPassword1,
            Cpassword: hashPassword1,
            lastname: lastname,
            phoneNumber: phoneNumber,
            createdBy: createdBy,
            createDate: createDate,
            selectRole: selectRole,
            Location: Location,
            Store: Store,
            Vendor: Vendor,
            userType : userType,


        });

        const token = await getAuthontication(newUser);
        res.status(201).send({ message: "Registration successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}


export const userLogin = async (req, res) => {
    try {
        const { firstname, password } = req.body;
        console.log(req.body)
        console.log(firstname, password)
        if (!firstname || !password) {
            return res.status(400).send("All fields are required");
        }

        const user = await User.findOne({ firstname }).select("+password");
        if (!user) {
            return res.status(400).send("Invalid UserName or password");
        }

        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(400).send("Invalid email or password");
        }

        const token = await getAuthontication(user);
        res.cookie("token", token);
        res.send({
            data: {
                status: "success",
                token: token
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};
export const userProfile = async (req, res) => {

    try {
        const token = req.body.authorization

        if (!token) {
            return res.status(403).send("Invalid Token");

        }

        jwt.verify(token, "peral-Dynamic", (err, decoded) => {
            if (err) {

                return res.status(403).send("Invalid Token");

            }
            res.status(200).send({ status: true, data: decoded });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};


export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        else {
            res.status(200).send({ status: true, data: user });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params
    console.log(req.body)
    const { firstname, email, lastname, phoneNumber, password, Cpassword, updatedBy, updateDate, selectRole, Location, Store, Vendor } = req.body

    try {
        const updateFields = {
            firstname,
            lastname,
            phoneNumber,
            updatedBy,
            updateDate,
            selectRole,
            Location,
            Store,
            Vendor,


        };

        // Only add password fields if they're provided
        if (password && password !== "") {
            updateFields.password = await hashPassword(password);
        }

        if (Cpassword && Cpassword !== "") {
            updateFields.Cpassword = await hashPassword(Cpassword);
        }

        const user = await User.findByIdAndUpdate(id, updateFields)
        if (!user) {
            return res.status(404).send("User not found");
        }
        else {
            res.status(200).send({ status: true, data: user });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        else {
            res.status(200).send({ status: true, data: user });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({ status: true, data: users });
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}