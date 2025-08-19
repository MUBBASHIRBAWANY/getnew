import PurchaseInvoiceModal from "../modal/PurchaseInvoiceModal.js"
import TotalProductModal from "../modal/TotalProductModal.js";
import { CounterModel } from '../modal/CounterModel .js';
export const createPurchaseInvoice = async (req, res) => {
    const { Vendor, PurchaseData, VendorCode, PurchaseInvoiceDate, SalesFlowRef, Store, Location } = req.body
    try {
        const code = await PurchaseInvoiceModal.find({ Vendor: Vendor }).sort({ _id: -1 }).limit(1)
        console.log(code)
        let nextCode
        if (code.length == 0) {
            const nextNumber = parseInt("000000", 10) + 1;
            nextCode = nextNumber.toString().padStart(6, '0')
        }
        else {
            const nextNumber = parseInt(code[0].invoiceCode, 10) + 1;
            console.log(nextNumber)
            nextCode = nextNumber.toString().padStart(6, '0')
        }

        const data = await PurchaseInvoiceModal.create({
            invoiceCode: nextCode,
            PurchaseInvoice: VendorCode + nextCode,
            PurchaseData,
            Vendor,
            PurchaseInvoiceDate,
            SalesFlowRef,
            PostStatus: false,
            Store,
            Location,

        })

        res.status(200).send(data)

    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

const getNextInvoiceNumber = async (vendorId) => {
    const counter = await CounterModel.findByIdAndUpdate(
        vendorId,
        { $inc: { seq: 1 } },
        { upsert: true, new: true }
    );
    return counter.seq.toString().padStart(6, '0');
}

export const updatePurchaseInvoice = async (req, res) => {
    const { id } = req.params
    const { PurchaseData, PurchaseInvoiceDate, SalesFlowRef } = req.body
    console.log(id)
    try {
        const data = await PurchaseInvoiceModal.findByIdAndUpdate(id, {
            PurchaseData,
            PurchaseInvoiceDate,
            SalesFlowRef
        })
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

// export const getLastProduct = async (req, res) => {
//     try {
//         const LastProduct = await PurchaseInvoiceModal.findOne().sort({ _id: -1 }).limit(1)
//         console.log(LastProduct)
//         res.send({ status: true, data: LastProduct });
//     } catch (err) {
//         console.log(err)
//     }
// }

export const getAllPurchaseInvoice = async (req, res) => {
    try {
        const data = await PurchaseInvoiceModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}

export const deletePurchcaseInvoice = async (req, res) => {
    const { id } = req.params
    try {
        const data = await PurchaseInvoiceModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getProductbyMsku = async (req, res) => {
    const { MasterSKu } = req.params
    try {
        const data = await PurchaseInvoiceModal.find({ MasterSKu: MasterSKu });
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

export const AddPurchaseInvoiceInbulk = async (req, res) => {

    try {
        const insertedIds = [];

        for (const item of req.body) {
            const nextCode = await getNextInvoiceNumber(item.Vendor);

            const newMsku = new PurchaseInvoiceModal({
                invoiceCode: nextCode,
                PurchaseInvoice: item.VendorCode + nextCode,
                PurchaseData: item.PurchaseData,
                Vendor: item.Vendor,
                PurchaseInvoiceDate: item.PurchaseInvoiceDate,
                SalesFlowRef: item.SalesFlowRef,
                Store: item.Store,
                Location: item.Location,
                PostStatus: false,
            });

            const savedItem = await newMsku.save();
            insertedIds.push(savedItem._id);
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

export const postPurchaseinvoice = async (req, res) => {
    const { status, data: purchaseData, Location, Store , VoucherRef} = req.body;
    console.log(req.body)
    const { id } = req.params;

    if (status === true) {
        try {
            const bulkOps = purchaseData.map(item => ({
                updateOne: {
                    filter: {
                        ProductName: item.product,
                        Location: Location,
                        Store: Store
                    },
                    update: {
                        $inc: {
                            TotalQuantity: Number(item.totalBox) || 0,
                            Amount: item.ValueAfterDiscout
                        },
                        $setOnInsert: {
                            ProductName: item.product,
                            Location: Location,
                            Store: Store
                        }
                    },
                    upsert: true
                }
            }));

            await TotalProductModal.bulkWrite(bulkOps);
            for (const item of purchaseData) {
                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Location,
                    Store
                });

                if (product && product.TotalQuantity > 0) {
                    const avgRate = product.Amount / product.TotalQuantity;
                    await TotalProductModal.updateOne(
                        { _id: product._id },
                        { $set: { AvgRate: avgRate } }
                    );
                }
            }

            await PurchaseInvoiceModal.findByIdAndUpdate(id, { PostStatus: status, VoucherRef : VoucherRef });

            return res.status(200).json({
                success: true,
                message: "Invoice posted and stock increased successfully"
            });

        } catch (error) {
            console.error("Error posting stock:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to update stock during posting"
            });
        }

    } else {
        try {
            if (!purchaseData || !Array.isArray(purchaseData)) {
                return res.status(400).json({
                    success: false,
                    message: "Missing or invalid purchase data"
                });
            }

            // Check stock availability for rollback
            const stockChecks = await Promise.all(
                purchaseData.map(async (item) => {
                    const product = await TotalProductModal.findOne({
                        ProductName: item.product,
                        Location,
                        Store
                    });

                    return { product, item };
                })
            );

            // Find products that either don't exist or have insufficient stock
            const insufficientStock = stockChecks.filter(({ product, item }) =>
                !product || (product.TotalQuantity || 0) < (item.totalBox || 0)
            );

            if (insufficientStock.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock to unpost invoice",
                    errors: insufficientStock.map(({ product, item }) =>
                        !product
                            ? { productId: item.product, message: "Product not found" }
                            : {
                                product: product.ProductName,
                                available: product.TotalQuantity,
                                tryingToDeduct: item.totalBox
                            }
                    )
                });
            }

            // Prepare bulk operations for rolling back stock
            const bulkOps = purchaseData.map((item) => ({
                updateOne: {
                    filter: {
                        ProductName: item.product,
                        Location,
                        Store,
                        TotalQuantity: { $gte: item.totalBox } // safety check
                    },
                    update: {
                        $inc: {
                            TotalQuantity: -Number(item.totalBox) || 0,
                            Amount: -Number(item.amount) || 0 // optional if you also want to roll back amount
                        }
                    }
                }
            }));

            // Execute bulk stock updates
            const result = await TotalProductModal.bulkWrite(bulkOps);

            // Update invoice post status
            await PurchaseInvoiceModal.findByIdAndUpdate(id, { PostStatus: status });

            return res.status(200).json({
                success: true,
                message: "Invoice unposted and stock reverted successfully"
            });

        } catch (error) {
            console.error("Error unposting stock:", error);
            return res.status(500).json({
                success: false,
                message: "Error occurred while unposting invoice"
            });
        }

    }
};


