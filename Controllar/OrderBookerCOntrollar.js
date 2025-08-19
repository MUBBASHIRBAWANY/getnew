import OrderBookerModal from "../modal/OrderBookerModal.js";
import VendorModal from "../modal/VendorModal.js"
export const CreateOrderBooker = async (req, res) => {
    try {


        const data = await OrderBookerModal.create(req.body)
        res.status(200).send("data Add")


    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}
export const getLastOrderBookerCode = async (req, res) => {
    try {
        const LastOrderBookerCode = await OrderBookerModal.findOne({}).sort({ _id: -1 }).limit(1)
        console.log(LastOrderBookerCode)
        res.send({ status: true, data: LastOrderBookerCode });
    } catch (err) {
        console.log(err)
    }
}
export const updateOrderBooker = async (req, res) => {
    const { id } = req.params
    try {
        const data = await OrderBookerModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllOrderBooker = async (req, res) => {
    try {
        const data = await OrderBookerModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const deleteOrderBooker = async (req, res) => {
    const { id } = req.params
    try {
        const data = await OrderBookerModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getOrderBookerByVendor = async (req, res) => {
    const { vendor } = req.params
    try {
        console.log(vendor)
        const data = await OrderBookerModal.find({ Vendor: vendor }).sort({ _id: -1 }).limit(1)
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
    console.log(req.body)
    try {
        const insertedIds = [];

        for (const item of req.body) {
            const code = await OrderBookerModal.find({ Vendor: item.Vendor }).sort({ _id: -1 }).limit(1)
            console.log(code)
            let nextCode
            if (code.length == 0) {
                const nextNumber = parseInt("000", 10) + 1;
                nextCode = nextNumber.toString().padStart(3, '0')
            }
            else {
                const nextNumber = parseInt(code[0].code, 10) + 1;
                nextCode = nextNumber.toString().padStart(3, '0')
            }

            if (nextCode == "100") {
                res.status(500).send({
                    status: false,
                    message: 'Failed to fetch categories',
                    error: err.message
                });
            }
            const newOrderBooker = new OrderBookerModal({
                OrderBookerName: item.OrderBookerName,
                Vendor: item.Vendor,
                code: nextCode,
                masterCode: item.vendorCode + nextCode,
                salesFlowRef: item.SalesFLowRef,
                // Add other fields if needed
            });

            const savedItem = await newOrderBooker.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.OrderBookerName}`);
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



