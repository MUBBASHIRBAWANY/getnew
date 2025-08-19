import SubLocalityModal from "../modal/SubLocalityModal.js";

export const CreateSubLocality = async (req, res) => {
    try {
        const data = await SubLocalityModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const updateSubLocality = async (req, res) => {
    const { id } = req.params
    try {
        const data = await SubLocalityModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllSubLocality = async (req, res) => {
    try {
        const data = await SubLocalityModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}
export const getLastSubLocalityCodeByVendor = async (req, res) => {
    const {Locality} = req.params
    try {
        const LastSubLocalityCode = await  SubLocalityModal.find({ Locality: Locality }).sort({ _id: -1 }).limit(1)
        console.log(LastSubLocalityCode)
        res.send({ status: true, data: LastSubLocalityCode });
    } catch (err) {
        console.log(err)
    }
}


export const deleteSubLocality = async (req, res) => {
    const { id } = req.params
    try {
        const data = await SubLocalityModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const PushBulkDataInSubLocality = async (req, res) => {
    console.log(req.body)
    try {
        const insertedIds = [];

        for (const item of req.body) {
           const code = await SubLocalityModal.find().sort({ _id: -1 }).limit(1)
           console.log(code)
            let nextCode
            if (code.length == 0) {
                const nextNumber = parseInt("00", 10) + 1;
                nextCode = nextNumber.toString().padStart(2, '0')
            }
            else {
                const nextNumber = parseInt(code[0].code, 10) + 1;
                nextCode = nextNumber.toString().padStart(2, '0')
            }


            const newCategory = new SubLocalityModal({
                SubLocalityName: item.SubLocalityName,
                code: nextCode,
                SaleFlowRef: item.SaleFlowRef,
            });

            const savedItem = await newCategory.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.SubLocalityName}`);
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


export const getSubLocalityByLocality = async (req, res) => {
    const { Locality } = req.params
    try {
        console.log(Locality)
        const data = await SubLocalityModal.find({ Locality: Locality });
        res.status(200).send({
            status: true,
            data: data
        });
    } catch (err) {
        console.error('Error fetching SubLocality by Locality:', err);
        res.status(500).send({
            status: false,
            message: 'Failed to fetch SubLocality',
            error: err.message
        });
    }
}
