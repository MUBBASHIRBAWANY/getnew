import locationModal from "../modal/locationModal.js"

export const Createlocation = async (req, res) => {
    try {
        const data = await locationModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}


export const updatelocation = async (req, res) => {
    const { id } = req.params
    try {
        const data = await locationModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAlllocation = async (req, res) => {
    try {
        const data = await locationModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const getLastlocationCode = async (req, res) => {
    try {
        const LastlocationCode = await locationModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastlocationCode)
        res.send({ status: true, data: LastlocationCode });
    } catch (err) {
        console.log(err)
    }
}

export const deletelocation = async (req, res) => {
    const { id } = req.params
    try {
        const data = await locationModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const PushBulkDataInlocation = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            console.log(item.Region)
           const code = await  locationModal.find().sort({ _id: -1 }).limit(1);
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
            const Newlocation = new locationModal({
                locationName: item.locationName,
                code: nextCode,
            });

            const savedItem = await Newlocation.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.locationName}`);
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

