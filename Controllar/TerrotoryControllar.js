import TerrotoryModal from "../modal/TerrotoryModal.js";
import { v4 as uuidv4 } from 'uuid';
export const CreateTerrotory = async (req, res) => {
    try {
        const data = await TerrotoryModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const updateTerrotory = async (req, res) => {
    const { id } = req.params
    try {
        const data = await TerrotoryModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllTerrotory = async (req, res) => {
    try {
        const data = await TerrotoryModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}
export const getLastTerrotoryCode = async (req, res) => {
    try {
        const LastTerrotoryCode = await TerrotoryModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastTerrotoryCode)
        res.send({ status: true, data: LastTerrotoryCode });
    } catch (err) {
        console.log(err)
    }
}


export const deleteTerrotory = async (req, res) => {
    const { id } = req.params
    try {
        const data = await TerrotoryModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const PushBulkDataInTerrotory = async (req, res) => {

    try {
        const insertedIds = [];
        console.log(req.body)
        for (const item of req.body) {
            const code = await TerrotoryModal.find().sort({ _id: -1 }).limit(1)
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

            const newTerrotory = new TerrotoryModal({
                TerrotoryName: item.TerrotoryName,
                code: nextCode,
            });

            const savedItem = await newTerrotory.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.TerrotoryName}`);
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


