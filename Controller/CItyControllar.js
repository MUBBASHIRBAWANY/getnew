import CutomerModal from "../modal/CutomerModal.js";
import CityModal from "../modal/CityModal.js";

export const CreateCity = async (req, res) => {
    try {
        const data = await CityModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const updateCity = async (req, res) => {
    const { id } = req.params
    try {
        const data = await CityModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllCity = async (req, res) => {
    try {
        const data = await CityModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}
export const getLastCityCodeByVendor = async (req, res) => {
    const {vendor} = req.params
    try {
        const LastCityCode = await  CityModal.find().sort({ _id: -1 }).limit(1)
        console.log(LastCityCode)
        res.send({ status: true, data: LastCityCode });
    } catch (err) {
        console.log(err)
    }
}


export const deleteCity = async (req, res) => {
    const { id } = req.params
    try {
        const data = await CityModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const PushBulkDataInCity = async (req, res) => {
    console.log(req.body)
    try {
        const insertedIds = [];

        for (const item of req.body) {
           const code = await CityModal.find().sort({ _id: -1 }).limit(1)
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


            const newCategory = new CityModal({
                CityName: item.CityName,
                code: nextCode,
                SaleFlowRef: item.salesFlowRef,
            });

            const savedItem = await newCategory.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.CityName}`);
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


export const getCityByVendor = async (req, res) => {
    const { vendor } = req.params
    try {
        console.log(vendor)
        const data = await CityModal.find();
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
