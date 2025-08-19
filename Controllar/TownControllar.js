import TownModal from "../modal/TownModal.js";

export const CreateTown = async (req, res) => {
    try {
        const data = await TownModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const updateTown = async (req, res) => {
    const { id } = req.params
    try {
        const data = await TownModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllTown = async (req, res) => {
    try {
        const data = await TownModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}
export const getLastTownCode = async (req, res) => {
    try {
        const LastTownCode = await TownModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastTownCode)
        res.send({ status: true, data: LastTownCode });
    } catch (err) {
        console.log(err)
    }
}


export const deleteTown = async (req, res) => {
    const { id } = req.params
    try {
        const data = await TownModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const PushBulkDataInTown = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            console.log(item.Region)
           const code = await  TownModal.find().sort({ _id: -1 }).limit(1);
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
            const newCategory = new TownModal({
                TownName: item.TownName,
                code: nextCode,
            });

            const savedItem = await newCategory.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.TownName}`);
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

