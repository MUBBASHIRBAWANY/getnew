import OrderBookerModal from "../modal/OrderBookerModal.js";
import VendorModal from "../modal/Vendor_Modal.js"
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
        const LastOrderBookerCode = await OrderBookerModal.findOne().sort({ _id: -1 }).limit(1)
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






