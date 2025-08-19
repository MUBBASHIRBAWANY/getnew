import SubChannelModal from "../modal/SubChannelModal.js";
export const CreateSubChannel = async (req, res) => {
    try {
        const data = await SubChannelModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}
export const getLastSubChannelCode = async (req, res) => {
    try {
        const LastChannelCode = await SubChannelModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastChannelCode)
        res.send({ status: true, data: LastChannelCode });
    } catch (err) {
        console.log(err)
    }
}
export const updateSubChannel = async (req, res) => {
    const { id } = req.params
    try {
        const data = await SubChannelModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllSubChannel = async (req, res) => {
    try {
        const data = await SubChannelModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const deleteSubChannel = async (req, res) => {
    const { id } = req.params
    try {
        const data = await SubChannelModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getSubChannelByChannel = async (req, res) => {
    const { Channel } = req.params
    try {
        const data = await SubChannelModal.find({ Channel: Channel });
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
            const code = await SubChannelModal.find().sort({ _id: -1 }).limit(1)
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

            const newChannel = new SubChannelModal({
                SubChanneName: item.SubChanneName,
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