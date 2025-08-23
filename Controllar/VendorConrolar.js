import VendorModal from "../modal/VendorModal.js"
import ChartofAccountsModal from "../modal/ChartofAccountsModal.js"


export const createVendor = async (req, res) => {
    
    try {
        
        const data = await VendorModal.create(req.body)
        res.status(200).send("data Add")
    } catch (e) {
        console.log(e);
        res.status(400).send('Server Error');
    }
}

export const getAllVendor = async (req, res) => {
    try {
        const Vendor = await VendorModal.find();
        res.status(200).send({ status: true, data: Vendor });
    } catch (err) {
        res.status(400).send("some thing went gone wrong")
    }
}

export const getLastVendorCode = async (req, res) => {
    try {
        const lastVendorCode = await VendorModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(lastVendorCode)
        res.send({ status: true, data: lastVendorCode });
    } catch (err) {
        console.log(err)
    }
}

export const updateVendor = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const data = await VendorModal.findByIdAndUpdate(id, req.body)
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went gone wrong")
    }
}

export const deleteVendor = async (req, res) => {
    const { id } = req.params
    try {
        const vendor = await VendorModal.findById(id)
        const deleteAccount = await ChartofAccountsModal.findOne({AccountCode : vendor.AccountCode})
        console.log(deleteAccount)
        await ChartofAccountsModal.findByIdAndDelete(deleteAccount._id)
        const data = await VendorModal.findByIdAndDelete(id)
        res.status(200).send("data daelete");
    } catch (err) {
        res.status(400).send("some thing went gone wrong")
    }
}
export const PushBulkDataInVendor = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            const code = await VendorModal.findOne().sort({ _id: -1 }).limit(1)
            console.log(code)
            let nextCode
            if (code == null) {
                const nextNumber = parseInt("00", 10) + 1;
                nextCode = nextNumber.toString().padStart(2, '0')
            }
            else {
                const nextNumber = parseInt(code.code, 10) + 1;
                nextCode = nextNumber.toString().padStart(2, '0')
            }

            const newVendor = new VendorModal({
                VendorName: item.VendorName,
                phone: item.phone,
                code: nextCode,
                email: item.email,
                salesFlowRef: item.salesFlowRef,
                Address: item.Address,
                NTN: item.NTN,
                STN: item.STN,
                Fax: item.Fax,
                WebSite: item.WebSite,
                ContactPerson: item.ContactPerson,
                PurchaseDate: item.PurchaseDate,
                Zone: item.zone,
                Department: item.Department,
                Transport: item.Transport,
                PriceList: item.PriceList,
                DepPercent: item.DepPercent,
                TargetedDiscountPercent: item.TargetedDiscountPercent,
                TargetedDiscount: item.TargetedDiscount,
                CashDiscountPercent: item.CashDiscountPercent,
                CashDiscountAmount: item.CashDiscountAmount,
                AdvanceDiscountAmount: item.AdvanceDiscountAmount,
                AdvanceDiscountPercent: item.AdvanceDiscountPercent,
                ShortCode: item.ShortCode
            });

            const savedItem = await newVendor.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.VendorName}`);
        }
        res.status(200).send({
            status: true,
            data: insertedIds
        });
        console.log('All documents inserted successfully!');
        return insertedIds;
    } catch (error) {
        console.error('Error inserting documents:', error.message);
        throw error;
    }
};