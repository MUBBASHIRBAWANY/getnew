
import { CloudinaryStorage } from "multer-storage-cloudinary";
import BeneficiaryModal from "../modal/BeneficiaryModal.js"

export const getAllBeneficiary = async (req, res) => {
    try {

        const Beneficiary = await BeneficiaryModal.find({})
        console.log(Beneficiary)
        res.status(200).json(Beneficiary);

    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
}
export const createBeneficiary = async (req, res) => {

    const { DepatmentName, date,TOken, BeneficiaryName, BeneficiaryAddress,BeneficiaryPhoneNumber, BeneficiaryEmail, BeneficiaryCnic } = req.body;
    try {
        const newDep = new BeneficiaryModal({ DepatmentName, BeneficiaryAddress,BeneficiaryName, BeneficiaryPhoneNumber, BeneficiaryEmail, BeneficiaryCnic, TOken, date });
        await newDep.save();
        res.status(201).json(newDep);
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
}

export const lastToken = async (req, res) =>{
    try{
        const lastToken = await BeneficiaryModal.findOne().sort({_id:-1}).limit(1)
        res.send(lastToken)
    }catch(err){
        res.send(err)
    }
}
export const updateBeneficiary = async (req, res) => {
    const { id } = req.params;
    const { date,TOken, BeneficiaryName, BeneficiaryAddress,BeneficiaryPhoneNumber, BeneficiaryEmail, BeneficiaryCnic, data } = req.body;
console.log(data)
    try {
        const dep = await BeneficiaryModal.findByIdAndUpdate(id, { date, BeneficiaryName, BeneficiaryAddress,BeneficiaryPhoneNumber, BeneficiaryEmail, BeneficiaryCnic, data }, { new: true });
        if (!dep) {
            return res.status(404).send("Department not found");
        }
        res.json(dep);
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
}

export const deleteBeneficiary = async (req, res) => {
    const { id } = req.params;
    try {
        const dep = await BeneficiaryModal.findByIdAndDelete(id);
        if (!dep) {
            return res.status(404).send("Department not found");
        }
        res.json({ message: "Department deleted successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).send('Server Error');
    }
}

export const getBeneficiaryByDep = async (req, res) => {
    console.log(req.params)
    const { dep } = req.params;
    const Department = await BeneficiaryModal.find({ DepatmentName: dep })
    res.json(Department);
}   

export const getBeneficiaryById = async (req, res) => {
    const { id } = req.params;
    try {
        const Beneficiary = await BeneficiaryModal.findById(id);
        if (!Beneficiary) {
            return res.status(404).send("Beneficiary not found");
        }
        else {
            res.status(200).send({ status: true, data: Beneficiary });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}

export const getBeneficiaryBycnic = async (req,res) => {
        const {BeneficiaryCnic} = req.params
    try{
        const Beneficiary = await BeneficiaryModal.find({ BeneficiaryCnic });
        if (!Beneficiary) {
            return res.status(404).send("Beneficiary not found");
        }
        else {
            res.status(200).send({ status: true, data: Beneficiary });
        }
    }catch(err){
        console.error(err);
        res.status(500).send(`Server Error: ${err.message}`);
    }
}