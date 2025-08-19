import InvoiceOpeningModal from "../modal/OpeningInvoicesModal.js";


export const CreateOpeningInvoice = async (req,res) => {
    try {
        const { DateStart, DateEnd, InvoiceData} = req.body;
        if (!DateStart || !DateEnd || !Array.isArray(InvoiceData)) {
            return res.status(400).send("Missing DateStart, DateEnd or InvoiceData");
        }
        const existingRecord = await InvoiceOpeningModal.findOne({ DateStart, DateEnd });
        if (existingRecord) {
            existingRecord.InvoiceData = existingRecord.InvoiceData.concat(InvoiceData);
            await existingRecord.save();
            return res.status(200).send("Inventory updated on existing date record.");
        } else {
            const data = await InvoiceOpeningModal.create(req.body);
            res.status(200).send("Account Opening data added successfully");
        }
    } catch (e) {
        console.log(e);
        res.status(400).send('Server Error');
    }
}

export const getAllOpeningInvoices = async (req, res) => {
    try {
        const OpeningInvoices = await InvoiceOpeningModal.find();
        res.status(200).send({ status: true, data: OpeningInvoices });
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}
export const updateOpeningInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await InvoiceOpeningModal.findByIdAndUpdate(id, req.body);
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}

export const deleteOpeningInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        await InvoiceOpeningModal.findByIdAndDelete(id);
        res.status(200).send("Account Opening data deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}

