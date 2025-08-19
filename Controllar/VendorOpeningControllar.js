import VendorOpeningModal from "../modal/VendorOpeningModal.js";

export const createVendorOpening = async (req, res) => {
    try {
        const data = await VendorOpeningModal.create(req.body);
        res.status(200).send("Vendor Opening data added successfully");
    } catch (e) {
        console.log(e);
        res.status(400).send('Server Error');
    }
}

export const getAllVendorOpening = async (req, res) => {
    try {
        const vendorOpenings = await VendorOpeningModal.find();
        res.status(200).send({ status: true, data: vendorOpenings });
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}

export const updateVendorOpening = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await VendorOpeningModal.findByIdAndUpdate(id, req.body);
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}

export const deleteVendorOpening = async (req, res) => {
    const { id } = req.params;
    try {
        await VendorOpeningModal.findByIdAndDelete(id);
        res.status(200).send("Vendor Opening data deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}       

