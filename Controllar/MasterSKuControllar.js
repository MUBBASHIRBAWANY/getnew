import MasterSKuModal from "../modal/MasterSku.js";

export const CreateMasterSKu = async (req, res) => {
    try {
        const data = await MasterSKuModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const updateMasterSKu = async (req, res) => {
    const { id } = req.params
    try {
        const data = await MasterSKuModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}
export const getLastMasterSKuCode = async (req, res) => {
    try {
        const LastMasterSKuCode = await MasterSKuModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastMasterSKuCode)
        res.send({ status: true, data: LastMasterSKuCode });
    } catch (err) {
        console.log(err)
    }
}

export const getAllMasterSKu = async (req, res) => {
    try {
        const data = await MasterSKuModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const deleteMasterSKu = async (req, res) => {
    const { id } = req.params
    try {
        const data = await MasterSKuModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getMskuByBrand = async (req, res) => {
    const { brand } = req.params
    try {
        console.log(brand)
        const data = await MasterSKuModal.find({ Brand: brand });
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

export const PushBulkDataInMaster = async (req, res) => {
console.log(req.body)
    try {
        const insertedIds = [];

        for (const item of req.body) {
            const code = await MasterSKuModal.find({ Brand: item.Brand }).sort({ _id: -1 }).limit(1)
            console.log(code)
            let nextCode
            if (code.length == 0) {
                const nextNumber = parseInt("000", 10) + 1;
                nextCode = nextNumber.toString().padStart(3, '0')
            }
            else {
                const nextNumber = parseInt(code[0].code, 10) + 1;
                nextCode = nextNumber.toString().padStart(3, '0')
            }

            if (nextCode == "1000") {
                res.status(500).send({
                    status: false,
                    message: 'Failed to fetch categories',
                    error: message
                });
            }

            const newMsku = new MasterSKuModal({
                MasterSkuName: item.MasterSkuName,
                Brand: item.Brand,
                code: nextCode,
                mastercode: item.mastercode + nextCode,
                salesFlowRef: item.salesFlowRef,
                CodeRef : item.CodeRef
            });

            const savedItem = await newMsku.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.MasterSkuName}`);
        }
        res.status(200).send({
            status: true,
            data: "Data Add"
        });
        console.log('All documents inserted successfully!');
        return insertedIds;
    } catch (error) {
        console.error('Error inserting documents:', error.message);
        throw error;
    }
};