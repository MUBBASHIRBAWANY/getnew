import InventoryTransferOutModal from "../modal/InventoryTransferOutModal.js"
import OpeningInventoryModal from "../modal/OpeningInventoryModal.js"
import PurchaseInvoiceModal from "../modal/PurchaseInvoiceModal.js"
import SalesInvoiceModal from "../modal/SalesInvoiceModal.js"
import StoreModal from "../modal/StoreModal.js"
import InventoryTransferInModal from "../modal/TransferInModal.js"

export const CreateStore = async (req, res) => {
    try {
        const data = await StoreModal.create(req.body)
        res.status(200).send("data Add")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}


export const updateStore = async (req, res) => {
    const { id } = req.params
    try {
        const data = await StoreModal.findByIdAndUpdate(id, req.body)
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllStore = async (req, res) => {
    try {
        const data = await StoreModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const getLastStoreCode = async (req, res) => {
    try {
        const LastStoreCode = await StoreModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(LastStoreCode)
        res.send({ status: true, data: LastStoreCode });
    } catch (err) {
        console.log(err)
    }
}

export const deleteStore = async (req, res) => {
    const { id } = req.params
    try {
        // Find the store by ID and delete it
        const Openinginventory = await OpeningInventoryModal.find({
            'InvoetoryData.Store': id
        });
        const PurchaseInvoice = await PurchaseInvoiceModal.findOne({ Store: id }) || [];
        const SaleInvoice = await SalesInvoiceModal.findOne({ Store: id }) || [];
        const TransferIn = await InventoryTransferInModal.findOne({ StoreTo: id } || { StoreFrom: id }) || [];
        const TramsferOut = await InventoryTransferOutModal.findOne({ StoreFrom: id } || { StoreTo: id }) || [];
        const concatArr = Openinginventory.concat(PurchaseInvoice).concat(SaleInvoice).concat(TransferIn).concat(TramsferOut); 
        console.log(concatArr)
        if (concatArr.length === 0) {
            const data = await StoreModal.findByIdAndDelete(id);
            return res.status(200).send({ status: true, data: data });
        }
        else {
            res.send({ status: false, data: concat, message: "This Store is used in other module" });
        }
        
    }
    catch (err) {
        res.status(400).send("It used in Sale or Purchase or Transfer or Opening")
    }
}

export const PushBulkDataInStore = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            console.log(item.Region)
            const code = await StoreModal.find().sort({ _id: -1 }).limit(1);
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
            const NewStore = new StoreModal({
                StoreName: item.StoreName,
                Location: item.Location,
                code: nextCode,

            });

            const savedItem = await NewStore.save();
            insertedIds.push(savedItem._id);
            console.log(`Inserted: ${item.StoreName}`);
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

export const getStoreByLocation = async (req, res) => {
    const { Location } = req.params
    try {
        const data = await StoreModal.find({ Location: Location })
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")
    }
}   