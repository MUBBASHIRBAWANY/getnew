import AccountOpeningBalanceModal from "../modal/AccountsOpeningModal.js";

export const createAccountOpening = async (req, res) => {
    try {
        const data = await AccountOpeningBalanceModal.create(req.body);
        res.status(200).send("Account Opening data added successfully");
    } catch (e) {
        console.log(e);
        res.status(400).send('Server Error');
    }
}

export const getAllAccountOpening = async (req, res) => {
    try {
        const AccountOpenings = await AccountOpeningBalanceModal.find();
        res.status(200).send({ status: true, data: AccountOpenings });
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}

export const updateAccountOpening = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await AccountOpeningBalanceModal.findByIdAndUpdate(id, req.body);
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}

export const deleteAccountOpening = async (req, res) => {
    const { id } = req.params;
    try {
        await AccountOpeningBalanceModal.findByIdAndDelete(id);
        res.status(200).send("Account Opening data deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
}       

