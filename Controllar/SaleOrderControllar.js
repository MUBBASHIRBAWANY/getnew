import SaleOrderModal from "../modal/SaleOrderModal.js"
import SaleOrderDcModal from "../modal/SaleOrderDcModal.js"
export const CreateSaleOrder = async (req, res) => {
    try {

        const data = await SaleOrderModal.create(req.body)
        res.status(200).send(data)
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
    const { id } = req.params;
    
    try {
        // 1️⃣ Get the sale order to check its order number
        const saleOrder = await SaleOrderModal.findById(id);
        if (!saleOrder) {
            return res.status(404).send({ status: false, message: "Sale order not found" });
        }

        // Assuming your sale order has a field like SaleOrderNumber
        const orderNumber = saleOrder.SaleOrderNumber;

        // 2️⃣ Check in DC collection if this order number exists
        const existsInDC = await SaleOrderDcModal.findOne({
            "DcData.Order": orderNumber
        });

        if (existsInDC) {
            return res.status(400).send({
                status: false,
                message: `Cannot delete. Order ${orderNumber} is already used in DC ${existsInDC.DcNumber}.`
            });
        }

        // 3️⃣ If not found, delete it
        const deleted = await SaleOrderModal.findByIdAndDelete(id);
        res.status(200).send({ status: true, data: "deleted" });

    } catch (err) {
        console.error(err);
        res.status(500).send({ status: false, message: "Something went wrong" });
    }
};


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