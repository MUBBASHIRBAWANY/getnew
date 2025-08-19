import DamageProductModal from "../modal/DamageProductModal.js";
import PurchaseReturnModal from "../modal/PurchaseReturnModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";

// Create Purchase Return
export const createPurchaseReturn = async (req, res) => {
    const { Vendor, PurchaseReturnData, VendorCode, PurchaseReturnDate, SalesFlowRef, Store, Location } = req.body;
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
    const { PurchaseReturnData, PurchaseReturnDate, SalesFlowRef } = req.body;

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
    const { status, returnData, Location, Store} = req.body;
    const { id } = req.params;
    console.log(returnData)
    if (status === true) {
        // Posting → Reduce stock
        try {
            if(returnData[0].Condition == "Fresh"){
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
            await PurchaseReturnModal.findByIdAndUpdate(id, { PostStatus: status });

            return res.status(200).json({
                success: true,
                message: "Return posted and stock deducted successfully"
            });
            }
            else if (returnData[0].Condition == "Damage"){
               const stockChecks = await Promise.all(
                returnData.map(async (item) => {
                    const product = await DamageProductModal.findOne({
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

            await DamageProductModal.bulkWrite(bulkOps);
            await PurchaseReturnModal.findByIdAndUpdate(id, { PostStatus: status });

            return res.status(200).json({
                success: true,
                message: "Return posted and stock deducted successfully"
            }); 
            }
         

        } catch (error) {
            console.error("Error posting return:", error);
            return res.status(500).json({
                success: false,
                message: "Error while posting return"
            });
        }

    } else {
        // Unposting → Add stock back
        try {
            if(returnData[0].Condition == "Fresh"){
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
                        },
                        $setOnInsert: {
                            ProductName: item.product,
                            Location,
                            Store
                        }
                    },
                    upsert: true
                }
            }));

            await TotalProductModal.bulkWrite(bulkOps);
            await PurchaseReturnModal.findByIdAndUpdate(id, { PostStatus: status });
            console.log(status)

            for (const item of returnData) {
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

            await PurchaseReturnModal.findByIdAndUpdate(id, { PostStatus: status });

            return res.status(200).json({
                success: true,
                message: "Return unposted and stock restored"
            });
            }
            else if(returnData[0].Condition == "Damge"){
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
                        },
                        $setOnInsert: {
                            ProductName: item.product,
                            Location,
                            Store
                        }
                    },
                    upsert: true
                }
            }));

            await DamageProductModal.bulkWrite(bulkOps);
            await PurchaseReturnModal.findByIdAndUpdate(id, { PostStatus: status });
            console.log(status)

            for (const item of returnData) {
                const product = await DamageProductModal.findOne({
                    ProductName: item.product,
                    Location,
                    Store
                });

                if (product && product.TotalQuantity > 0) {
                    const avgRate = product.Amount / product.TotalQuantity;
                    await DamageProductModal.updateOne(
                        { _id: product._id },
                        { $set: { AvgRate: avgRate } }
                    );
                }
            }

            await PurchaseReturnModal.findByIdAndUpdate(id, { PostStatus: status });

            return res.status(200).json({
                success: true,
                message: "Return unposted and stock restored"
            }); 
            }
        

        } catch (error) {
            console.error("Error unposting return:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to unpost return"
            });
        }
    }
};
