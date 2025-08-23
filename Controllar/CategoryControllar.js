import CategoryModal from "../modal/CategoryModal.js";
import VendorModal from "../modal/VendorModal.js"
export const CreateCategory = async (req, res) => {
    try {
        const data = await CategoryModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}
export const getLastCategoryCode = async (req, res) => {
    try {
        const LastCategoryCode = await CategoryModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastCategoryCode)
        res.send({ status: true, data: LastCategoryCode });
    } catch (err) {
        console.log(err)
    }
}
export const updateCategory = async (req, res) => {
    const { id } = req.params
    try {
        const data = await CategoryModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllCategory = async (req, res) => {
    try {
        const data = await CategoryModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const deleteCategory = async (req, res) => {
    const { id } = req.params
    try {
        const data = await CategoryModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getCategoryByVendor = async (req, res) => {
    const { vendor } = req.params
    try {
        console.log(vendor)
        const data = await CategoryModal.find({ vendor: vendor });
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
            const code = await CategoryModal.find({ vendor: item.vendor }).sort({ _id: -1 }).limit(1)
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
            const newCategory = new CategoryModal({
                CategoryName: item.CategoryName,
                vendor: item.vendor,
                code: nextCode,
                mastercode: item.vendorCode + nextCode,
                salesFlowRef: item.salesFlowRef,
                CodeRef : item.CodeRef
                // Add other fields if needed
            });

            const savedItem = await newCategory.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.CategoryName}`);
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



