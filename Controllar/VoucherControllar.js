import VoucherModal from "../modal/VoucherModal.js";


export const createVoucher = async (req, res) => {
    try {
        const { VoucherNumber, ChequeNumber, VoucherMainAccount } = req.body;
        console.log(ChequeNumber)
        const existingChq = await VoucherModal.findOne({ ChequeNumber: ChequeNumber })
        console.log(existingChq)
        if (existingChq) {

            return res.status(401).json({ message: `Chq All ready in used in ${existingChq.VoucherNumber}` });
        }
        const existingVoucher = await VoucherModal.findOne({ VoucherNumber: VoucherNumber });
        if (existingVoucher) {
            return res.status(400).json({ message: "Voucher number already exists" });
        }
        // Create a new voucher
        const voucherData = req.body;
        const newVoucher = new VoucherModal(voucherData);
        await newVoucher.save();
        res.status(201).json({ message: "Voucher created successfully", voucher: newVoucher });
    } catch (error) {
        res.status(500).json({ message: "Error creating voucher", error: error.message });
    }
}



export const createSystemVoucher = async (req, res) => {
    try {
        const { VoucherType, VoucherDate, VoucharData, status, VoucherNumber } = req.body

        // Create a new voucher
        // const voucherNumber = await VoucherModal.find({ VoucherType: VoucherType }).sort({ _id: -1 }).limit(1)
        // let nextNumber;
        // if (voucherNumber.length === 0) {
        //     nextNumber = `${VoucherType}000001`
        // } else {
        //     let nextVoucherNumber = (parseInt(voucherNumber[0].VoucherNumber.slice('2', "9"))) + 1
        //     nextNumber = `${VoucherType}${nextVoucherNumber.toString().padStart(7, '0')}`;
        // }
        const data = {
            VoucherType,
            VoucherDate,
            VoucherNumber,
            VoucharData,
            status,
        }

        const newVoucher = await VoucherModal.create(data)
        console.log(newVoucher)
        res.status(201).json({ message: "Voucher created successfully", voucher: newVoucher });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error creating voucher", error: error.message });
    }
}


export const getVoucherById = async (req, res) => {
    const { id } = req.params
    try {
        const data = await VoucherModal.findById(id)
        res.status(200).json({ status: true, data: data });
    } catch (err) {
        res.status(500).json({ message: "Error fetching vouchers", error: error.message });

    }
}

export const getVouchers = async (req, res) => {
    try {
        const { VoucherType } = req.query;
        console.log(VoucherType)
        const vouchers = await VoucherModal.find({ VoucherType: VoucherType })
        res.status(200).json({ status: true, data: vouchers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching vouchers", error: error.message });
    }
}
export const getVoucherByCode = async (req, res) => {
    try {
        const { VoucherType } = req.params;
        const voucher = await VoucherModal.find({ VoucherType: VoucherType }).sort({ _id: -1 }).limit(1)
        if (!voucher) {
            return res.status(404).json({ message: "Voucher not found" });
        }
        res.status(200).json(voucher);
    } catch (error) {
        res.status(500).json({ message: "Error fetching voucher", error: error.message });
    }
}
export const updateVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const voucherData = req.body;
        const updatedVoucher = await VoucherModal.findByIdAndUpdate(id, voucherData, { new: true });
        if (!updatedVoucher) {
            return res.status(404).json({ message: "Voucher not found" });
        }
        res.status(200).json({ message: "Voucher updated successfully", voucher: updatedVoucher });
    } catch (error) {
        res.status(500).json({ message: "Error updating voucher", error: error.message });
    }
}
export const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVoucher = await VoucherModal.findByIdAndDelete(id);
        if (!deletedVoucher) {
            return res.status(404).json({ message: "Voucher not found" });
        }
        res.status(200).json({ message: "Voucher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting voucher", error: error.message });
    }
}

export const PushVoucherBulkData = async (req, res) => {
    try {
        const insertedIds = [];
        for (const item of req.body) {
            const voucher = await VoucherModal.find({ VoucherType: VoucherType }).sort({ _id: -1 }).limit(1)
            console.log(voucher);
            if (voucher.length > 0) {
                let nextVoucherNumber = parseInt(voucher[0].VoucherNumber) + 1;
                item.VoucherNumber = nextVoucherNumber.toString().padStart(7, '0');
            }
            else {
                item.VoucherNumber = "0000001"; // Start with 1 if no vouchers exist
            }
            const newVoucher = new VoucherModal({
                VoucherType: item.VoucherType,
                VoucherNumber: item.VoucherNumber,
                VoucherDate: item.VoucherDate,
                VoucherMainAccount: item.VoucherMainAccount,
                VoucharData: item.VoucharData,
            });
            const savedItem = await newVoucher.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.VoucherType}`);
        }
        res.status(200).send({
            status: true,
            data: "Data Added"
        });
        console.log('All vouchers inserted successfully!');
        return insertedIds;
    } catch (error) {
        console.error('Error inserting vouchers:', error.message);
        throw error;
    }
}

export const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const Voucher = await VoucherModal.findById(id);
        if (!Voucher) {
            return res.status(404).json({ message: "Voucher not found" });
        }
        else if (Voucher.status === status) {
            return res.status(400).json({ message: "Voucher status is already set to this value" });
        }
        else {
            Voucher.status = status;
            await Voucher.save();
            res.status(200).json({ message: "Voucher status updated successfully", voucher: Voucher });
        }
    } catch (error) {

        res.status(500).json({ message: "Error updating voucher status", error: error.message });
    }
}


export const getVoucherByNumber = async (req, res) => {
    const { VoucherNumber } = req.params
    try {
        const data = await VoucherModal.find({ VoucherNumber: VoucherNumber })
        res.status(200).send({ status: true, data: data })
    }
    catch (err) {
        res.status(500).json({ message: "Error voucher", error: error.message });

    }
}


export const deleteVoucherByNumber = async (req, res) => {
    try {
        const { VoucherNumber } = req.params;
        const deletedVoucher = await VoucherModal.deleteOne({VoucherNumber : VoucherNumber});
        if (!deletedVoucher) {
            return res.status(404).json({ message: "Voucher not found" });
        }
        res.status(200).json({ message: "Voucher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting voucher", error: error.message });
    }
}