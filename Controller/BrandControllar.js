import BrandModal from "../modal/BrandModal.js";

export const CreateBrand = async (req, res) => {
    try {
        const data = await BrandModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const updateBrand = async (req, res) => {
    const { id } = req.params
    try {
        const data = await BrandModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllBrand = async (req, res) => {
    try {
        const data = await BrandModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}
export const getLastBrandCode = async (req, res) => {
    try {
        const LastBrandCode = await BrandModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastBrandCode)
        res.send({ status: true, data: LastBrandCode });
    } catch (err) {
        console.log(err)
    }
}

export const getBrandbyCat = async (req, res) => {
    const { category } = req.params
    try {
        console.log(category)
        const data = await BrandModal.find({ category: category });
        res.status(200).send({
            status: true,
            data: data
        });
    } catch (err) {
        console.error('Error fetching categories by category:', err);
        res.status(500).send({
            status: false,
            message: 'Failed to fetch categories',
            error: err.message
        });
    }
}
export const deleteBrand = async (req, res) => {
    const { id } = req.params
    try {
        const data = await BrandModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const PushBulkDataInBrand = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            const code = await BrandModal.find({ category: item.category }).sort({ _id: -1 }).limit(1)
            console.log(code)
            let nextCode
            if (code.length == 0) {
                const nextNumber = parseInt("00", 10) + 1;
                nextCode = nextNumber.toString().padStart(2, '0')
            }
            else {
                console.log(code)
                const nextNumber = parseInt(code[0].code, 10) + 1;
                nextCode = nextNumber.toString().padStart(2, '0')
            }


            const newCategory = new BrandModal({
                BrandName: item.BrandName,
                category: item.category,
                code: nextCode,
                mastercode: item.mastercode + nextCode,
                salesFlowRef: item.salesFlowRef,
                CodeRef : item.CodeRef
            });

            const savedItem = await newCategory.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.BrandName}`);
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
}