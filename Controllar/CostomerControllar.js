import CutomerModal from "../modal/CutomerModal.js"
import ChartofAccountsModal from "../modal/ChartofAccountsModal.js"


export const creatCutomer = async (req, res) => {
    console.log(req.body)
    try {
        const data = await CutomerModal.create(req.body)
        res.status(200).send("data Add")
    } catch (e) {
        console.log(e);
        res.status(400).send('Server Error');
    }
}

export const getAllCutomer = async (req, res) => {
    try {
        const Vendor = await CutomerModal.find();
        res.status(200).send({ status: true, data: Vendor });
    } catch (err) {
        res.status(400).send("some thing went gone wrong")
    }
}

export const getLastCutomer = async (req, res) => {
    try {
        const lastCutomer = await CutomerModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(lastCutomer)
        res.send({ status: true, data: lastCutomer });
    } catch (err) {
        console.log(err)
    }
}

export const updatCutomer = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const data = await CutomerModal.findByIdAndUpdate(id, req.body)
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went gone wrong")
    }
}

export const deletCutomer = async (req, res) => {
    const { id } = req.params
    try {
        const customer = await CutomerModal.findById(id)
        const deleteAccount = await ChartofAccountsModal.findOne({ AccountCode: customer.AccountCode })
        console.log(deleteAccount)
        await ChartofAccountsModal.findByIdAndDelete(deleteAccount._id)
        const data = await CutomerModal.findByIdAndDelete(id)

        res.status(200).send("data daelete");
    } catch (err) {
        res.status(400).send("some thing went gone wrong")
    }
}

export const CustomerByVendor = async (req, res) => {
    const { vendor } = req.params
    try {
        console.log(vendor)
        const data = await CutomerModal.find({ Vendor: vendor });
        res.status(200).send({
            status: true,
            data: data
        });
    } catch (err) {
        console.error('Error fetching categories by vendor:', err);
        res.status(500).send({
            status: false,
            message: 'Failed to fetch categories',
            error: err.message
        });
    }
}


export const AddCustomerInBulk = async (req, res) => {
    try {
        const insertedIds = [];

        for (const item of req.body) {
            const code = await CutomerModal.find().sort({ _id: -1 }).limit(1)
            console.log(code)
            let nextCode
            if (code.length == 0) {
                const nextNumber = parseInt("00000", 10) + 1;
                nextCode = nextNumber.toString().padStart(5, '0')
            }
            else {
                const nextNumber = parseInt(code[0].code, 10) + 1;
                nextCode = nextNumber.toString().padStart(5, '0')
            }

            if (nextCode == "100") {
                res.status(500).send({
                    status: false,
                    message: 'Failed to fetch categories',
                    error: err.message
                });
            }
            const newChannel = new CutomerModal({
                Address: item.Address,
                code: nextCode,
                mastercode: item.mastercode + nextCode,
                Chanel: item.Chanel,
                ChannelType: item.ChannelType,
                CutomerName: item.CutomerName,
                Fax: item.Fax,
                Filler: item.Filler,
                JBP: item.JBP,
                NTN: item.NTN,
                OwnerCnic: item.OwnerCnic,
                Region: item.Region,
                Registered: item.Registered,
                STN: item.STN,
                SalesFlowRef: item.SalesFlowRef,
                ShopOwner: item.ShopOwner,
                ShopRegisterDate: item.ShopRegisterDate,
                Status: item.Status,
                SubChannel: item.SubChannel,
                TTS: item.TTS,
                TradeActivity: item.TradeActivity,
                TradeOffer: item.Tradeoffer,
                VDS: item.VDS,
                Vendor: item.Vendor,
                WebSite: item.WebSite,
                Terrotory: item.Terrotory,
                email: item.email,
                phone: item.phone,
                Town: item.Town,
                AdvanceTaxApply: item.AdvanceTaxApply

            });
            const savedItem = await newChannel.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.ChannelName}`);
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
}


export const UpdateCustomerLocalityInBulk = async (req, res) => {
    try {
        const updatedResults = [];

        for (const item of req.body) {
            const updated = await CutomerModal.findOneAndUpdate(
                { code: item.code },
                { $set: { Locality: item.Locality } },
                { new: true }
            );

            if (updated) {
                updatedResults.push({ id: updated._id, status: 'updated' });
            } else {
                updatedResults.push({ code: item.code, status: 'not found' });
            }
        }

        res.status(200).send({
            status: true,
            data: updatedResults
        });

    } catch (error) {
        console.error('Error updating locality:', error.message);
        res.status(500).send({
            status: false,
            message: 'Failed to update Locality in bulk',
            error: error.message
        });
    }
};
