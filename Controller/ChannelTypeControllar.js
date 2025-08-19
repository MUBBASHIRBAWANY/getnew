import ChannelTypeModal from "../modal/ChenalTypeModal.js";
export const CreateChannelType = async (req, res) => {
    try {
        const data = await ChannelTypeModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}
export const getLastChannelTypeCode = async (req, res) => {
    try {
        const LastChannelCode = await ChannelTypeModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastChannelCode)
        res.send({ status: true, data: LastChannelCode });
    } catch (err) {
        console.log(err)
    }
}
export const updateChannelType = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ChannelTypeModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllChannelType = async (req, res) => {
    try {
        const data = await ChannelTypeModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const deleteChannelType = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ChannelTypeModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getChannelTypeByVendor = async (req, res) => {
    const { vendor } = req.params
    try {
        console.log(vendor)
        const data = await ChannelTypeModal.find();
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


export const PushBulkData = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            const code = await ChannelTypeModal.find().sort({ _id: -1 }).limit(1)
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

            if (nextCode == "100") {
                res.status(500).send({
                    status: false,
                    message: 'Failed to fetch categories',
                    error: err.message
                });
            }
            const newChannel = new ChannelTypeModal({
                ChanneTypeName: item.ChanneTypeName,
                code: nextCode,
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
};



