import ProductModal from "../modal/ProductModal.js"


export const createProduct = async (req, res) => {
    try {
        const data = await ProductModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const data = await ProductModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getLastProduct = async (req, res) => {
    try {
        const LastProduct = await ProductModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastProduct)
        res.send({ status: true, data: LastProduct });
    } catch (err) {
        console.log(err)
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const data = await ProductModal.find()
        console.log(data)
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ProductModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getProductbyMsku = async (req, res) => {
    const { MasterSKu } = req.params
    try {
        const data = await ProductModal.find({ MasterSKu: MasterSKu });
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

export const AddProductInbulk = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            const code = await ProductModal.find({ MasterSKu: item.MasterSKu }).sort({ _id: -1 }).limit(1)
            console.log(code)
            let nextCode
            if (code.length == 0) {
                const nextNumber = parseInt("00", 10) + 1;
                nextCode = nextNumber.toString().padStart(4, '0')
            }
            else {
                const nextNumber = parseInt(code[0].code, 10) + 1;
                nextCode = nextNumber.toString().padStart(4, '0')
            }

            if (nextCode == "100") {
                res.status(500).send({
                    status: false,
                    message: 'Failed to fetch categories',
                    error: err.message
                });
            }

            const newMsku = new ProductModal({
                ProductName: item.ProductName,
                MasterSKu: item.MasterSKu,
                code: nextCode,
                mastercode: item.mastercode + nextCode,
                salesFlowRef: item.salesFlowRef,
                OpeningRate: item.OpeningRate,
                TPPurchase: item.TPPurchase,
                TPSale: item.TPSale,
                SaleTaxAmount: item.SaleTaxAmount,
                SaleTaxPercent: item.SaleTaxPercent,
                BoxinCarton: item.BoxinCarton,
                PcsinBox: item.PcsinBox,
                SaleTaxBy: item.SaleTaxBy,
                RetailPrice: item.RetailPrice,
                CodeRef: item.CodeRef
            });

            const savedItem = await newMsku.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.MasterSkuName}`);
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