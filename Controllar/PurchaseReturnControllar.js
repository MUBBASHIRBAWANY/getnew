import DamageProductModal from "../modal/DamageProductModal.js";
import PurchaseInvoiceModal from "../modal/PurchaseInvoiceModal.js";
import PurchaseReturnModal from "../modal/PurchaseReturnModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";
import VoucherModal from "../modal/VoucherModal.js";

// Create Purchase Return
export const createPurchaseReturn = async (req, res) => {
    const { Vendor, PurchaseReturnData, VendorCode, PurchaseReturnDate, SalesFlowRef, Store, InvoiceRef, Location } = req.body;
    try {
        const stockChecks = await Promise.all(
            PurchaseReturnData.map(async (item) => {
                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Location,
                    Store
                });

                return { product, item };
            })
        );

        const insufficientStock = stockChecks.filter(({ product, item }) =>
            !product || (product.TotalQuantity || 0) < (item.totalBox || 0)
        );

        if (insufficientStock.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock to return",
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

        const code = await PurchaseReturnModal.find({ Vendor }).sort({ _id: -1 }).limit(1);
        let nextCode;
        if (code.length === 0) {
            nextCode = "000001";
        } else {
            const nextNumber = parseInt(code[0].returnCode, 10) + 1;
            nextCode = nextNumber.toString().padStart(6, "0");
        }

        const data = await PurchaseReturnModal.create({
            returnCode: nextCode,
            PurchaseReturn: VendorCode + nextCode,
            PurchaseReturnData,
            Vendor,
            PurchaseReturnDate,
            SalesFlowRef,
            PostStatus: false,
            Store,
            Location,
            InvoiceRef
        });

        res.status(200).send(data);
    } catch (err) {
        console.log(err);
        res.status(400).send("something went wrong");
    }
};

// Update Purchase Return
export const updatePurchaseReturn = async (req, res) => {
    const { id } = req.params;
    const { PurchaseReturnData, PurchaseReturnDate } = req.body;

    try {
        await PurchaseReturnModal.findByIdAndUpdate(id, {
            PurchaseReturnData,
            PurchaseReturnDate,
            SalesFlowRef,
        });
        res.status(200).send("Data Edited");
    } catch (err) {
        res.status(400).send("something went wrong");
    }
};

// Get All
export const getAllPurchaseReturns = async (req, res) => {
    try {
        const data = await PurchaseReturnModal.find();
        res.status(200).send({ status: true, data });
    } catch (err) {
        res.status(400).send("something went wrong");
    }
};

// Delete
export const deletePurchaseReturn = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await PurchaseReturnModal.findByIdAndDelete(id);
        res.status(200).send({ status: true, data });
    } catch (err) {
        res.status(400).send("something went wrong");
    }
};

// Bulk Add
export const AddPurchaseReturnInBulk = async (req, res) => {

    try {
        const insertedIds = [];
        for (const item of req.body.Returninvoices) {
            const code = await PurchaseReturnModal.find({ Vendor: item.Vendor }).sort({ _id: -1 }).limit(1);
            let nextCode = code.length === 0
                ? "000001"
                : (parseInt(code[0].returnCode, 10) + 1).toString().padStart(6, "0");

            const newItem = new PurchaseReturnModal({
                returnCode: nextCode,
                PurchaseReturn: item.VendorCode + nextCode,
                PurchaseReturnData: item.PurchaseReturnData,
                Vendor: item.Vendor,
                PurchaseReturnDate: item.PurchaseReturnDate,
                SalesFlowRef: item.SalesFlowRef,
                Store: item.Store,
                Location: item.Location,
                PostStatus: false,
            });

            const savedItem = await newItem.save();
            insertedIds.push(savedItem._id);
        }

        res.status(200).send({ status: true, data: "Data Added" });
    } catch (error) {
        console.error("Error inserting documents:", error.message);
        res.status(500).send("Bulk insertion failed");
    }
};

// Post/Unpost
export const postPurchaseReturn = async (req, res) => {
    const { status, returnData, Location, Store, inv, AccountsData } = req.body;
    console.log(returnData)
    const { id } = req.params;
    if (status === true) {
        // Posting → Reduce stock
        try {

            const stockChecks = await Promise.all(
                returnData.map(async (item) => {
                    const product = await TotalProductModal.findOne({
                        ProductName: item.product,
                        Location,
                        Store
                    });

                    return { product, item };
                })
            );

            const insufficientStock = stockChecks.filter(({ product, item }) =>
                !product || (product.TotalQuantity || 0) < (item.totalBox || 0)
            );

            if (insufficientStock.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock to return",
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

            const bulkOps = returnData.map(item => ({
                updateOne: {
                    filter: {
                        ProductName: item.product,
                        Location,
                        Store,
                        TotalQuantity: { $gte: item.totalBox }
                    },
                    update: {
                        $inc: {
                            TotalQuantity: -Number(item.totalBox),
                            Amount: -Number(item.amount || 0)
                        }
                    }
                }
            }));

            await TotalProductModal.bulkWrite(bulkOps);
            const updateStatus = await PurchaseReturnModal.findByIdAndUpdate(id, { PostStatus: status });
            const invoiceDoc = await PurchaseInvoiceModal.findOne({ PurchaseInvoice: inv });

            if (invoiceDoc) {
                for (const purchasedItem of invoiceDoc.PurchaseData) {
                    const returnedItem = returnData.find(r => String(r.id) === String(purchasedItem.id));
                    console.log(returnedItem , "returnedItem")
                    if (returnedItem) {
                        purchasedItem.Remaining = Math.max(
                            (purchasedItem.Remaining || 0) - (returnedItem.totalBox || 0),
                            0
                        );
                    }
                }
                invoiceDoc.markModified('PurchaseData');
                await invoiceDoc.save();
            }
            console.log(AccountsData)
            await VoucherModal.create(AccountsData)
            return res.status(200).json({
                success: true,
                message: "Return posted and stock deducted successfully"
            });




        } catch (error) {
            console.error("Error posting return:", error);
            return res.status(500).json({
                success: false,
                message: "Error while posting return"
            });
        }

    }
    else {
        // Unposting → Add stock back
        try {
            console.log(returnData)
            // 1️⃣ Add stock back to TotalProduct
            const bulkOps = returnData.map(item => ({
                updateOne: {
                    filter: {
                        ProductName: item.product,
                        Location,
                        Store
                    },
                    update: {
                        $inc: {
                            TotalQuantity: Number(item.totalBox),
                            Amount: Number(item.amount || 0)
                        }
                    }
                }
            }));

            await TotalProductModal.bulkWrite(bulkOps);

            // 2️⃣ Update Purchase Return status
            await PurchaseReturnModal.findByIdAndUpdate(id, { PostStatus: status });

            // 3️⃣ Restore invoice Remaining
            const invoiceDoc = await PurchaseInvoiceModal.findOne({ PurchaseInvoice: inv });

            if (invoiceDoc) {
                for (const purchasedItem of invoiceDoc.PurchaseData) {
                    const returnedItem = returnData.find(r => String(r.id) === String(purchasedItem.id));
                    if (returnedItem) {
                        purchasedItem.Remaining =
                            (purchasedItem.Remaining || 0) + (returnedItem.totalBox || 0);
                    }
                }
                invoiceDoc.markModified("PurchaseData");
                await invoiceDoc.save();
            }

            // 4️⃣ Remove related voucher (based on AccountsData info)
            if (AccountsData?.VoucherNumber) {
                await VoucherModal.deleteOne({ VoucherNumber: AccountsData.VoucherNumber });
            }

            return res.status(200).json({
                success: true,
                message: "Return unposted and stock restored successfully"
            });

        } catch (error) {
            console.error("Error unposting return:", error);
            return res.status(500).json({
                success: false,
                message: "Error while unposting return"
            });
        }
    }
};
