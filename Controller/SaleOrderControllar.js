import SaleOrderModal from "../modal/SaleOrderModal.js"

export const CreateSaleOrder = async (req, res) => {
    try {

        const data = await SaleOrderModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}

export const updateSaleOrder = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const data = await SaleOrderModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllSaleOrder = async (req, res) => {
    try {
        const data = await SaleOrderModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}
export const getLastSaleOrderCode = async (req, res) => {
    try {
        const LastSaleOrderCode = await SaleOrderModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastSaleOrderCode)
        res.send({ status: true, data: LastSaleOrderCode });
    } catch (err) {
        console.log(err)
    }
}


export const deleteSaleOrder = async (req, res) => {
    const { id } = req.params
    try {
        const data = await SaleOrderModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}


export const updateOrderStatus = async (req, res) => {
    const { id } = req.params
    const { Status } = req.body
    try {
        const data = await SaleOrderModal.findByIdAndUpdate(id, {Status : Status})
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }

}