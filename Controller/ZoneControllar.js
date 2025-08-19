import ZoneModal from "../modal/ZoneModal.js";

export const CreateZone = async (req, res) => {
    try {
        const data = await ZoneModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const updateZone = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ZoneModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}
export const getLastZoneCode = async (req, res) => {
    try {
        const LastZoneCode = await ZoneModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastZoneCode)
        res.send({ status: true, data: LastZoneCode });
    } catch (err) {
        console.log(err)
    }
}

export const getAllZone = async (req, res) => {
    try {
        const data = await ZoneModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const deleteZone = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ZoneModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

