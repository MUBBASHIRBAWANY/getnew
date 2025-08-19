import ChannelModal from "../modal/ChannelModal.js";
export const CreateChannel = async (req, res) => {
    try {
        const data = await ChannelModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}
export const getLastChannelCode = async (req, res) => {
    try {
        const LastChannelCode = await ChannelModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastChannelCode)
        res.send({ status: true, data: LastChannelCode });
    } catch (err) {
        console.log(err)
    }
}
export const updateChannel = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ChannelModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllChannel = async (req, res) => {
    try {
        const data = await ChannelModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const deleteChannel = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ChannelModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getChannelByType = async (req, res) => {
    const { ChanneType } = req.params
    try {
        const data = await ChannelModal.find({ ChanneType: ChanneType });
        res.status(200).send({
            status: true,
            data: data
        });
    } catch (err) {
        console.error('Error fetching Channel by ChanneType:', err);
        res.status(500).send({
            status: false,
            message: 'Failed to fetch ChanneType',
            error: err.message
        });
    }
}


export const PushBulkData = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            const code = await ChannelModal.find({ ChanneType: item.ChanneType }).sort({ _id: -1 }).limit(1)
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
            const newChannel = new ChannelModal({
                ChanneName: item.ChanneName,
                ChanneType: item.ChanneType,
                code: nextCode,
                // Add other fields if needed
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