import DamageProductModal from "../modal/DamageProductModal.js";
import SalesReturnModal from "../modal/SalesReturnModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";

// Create Sales Return
export const createSalesReturn = async (req, res) => {
    const { Client, SalesReturnData, SalesInvoiceReturnDate, Store, SalesFlowRef, Location, Damage } = req.body;

    try {

        const code = await SalesReturnModal.findOne().sort({ _id: -1 }).limit(1)
        let nextCode
        if (code == null) {
            const nextNumber = parseInt("000000", 10) + 1;
            nextCode = nextNumber.toString().padStart(6, '0')
        }
        else {
            const nextNumber = parseInt(code.SalesReturnNumber, 10) + 1;
            console.log(nextNumber)
            nextCode = nextNumber.toString().padStart(6, '0')
        }
        console.log(nextCode)

        const newReturn = await SalesReturnModal.create({
            SalesReturnNumber: nextCode,
            SalesReturnData,
            Client,
            SalesInvoiceReturnDate,
            PostStatus: false,
            Store,
            SalesFlowRef,
            Location,
            Damage,
        });

        res.status(201).json(newReturn);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to create sales return");
    }
};

// Get All Sales Returns
export const getAllSalesReturn = async (req, res) => {
    try {
        const returns = await SalesReturnModal.find().sort({ ReturnNumber: -1 });
        console.log(returns)
        res.status(200).json({ status: true, data: returns });
    } catch (err) {

        res.status(500).send("Failed to fetch returns");
    }
};

// Update Sales Return
export const updateSalesReturn = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Prevent modification if posted
        const existingReturn = await SalesReturnModal.findById(id);
        if (existingReturn.PostStatus) {
            return res.status(400).send("Posted returns cannot be modified");
        }

        const updatedReturn = await SalesReturnModal.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json(updatedReturn);
    } catch (err) {
        console.error(err);
        res.status(500).send("Update failed");
    }
};

// Delete Sales Return
export const deleteSalesReturn = async (req, res) => {
    const { id } = req.params;

    try {
        const existingReturn = await SalesReturnModal.findById(id);

        if (existingReturn.PostStatus == true) {
            return res.status(400).send("Posted returns cannot be deleted");
        }

        await SalesReturnModal.findByIdAndDelete(id);
        res.status(200).send("Return deleted successfully");
    } catch (err) {
        res.status(500).send("Deletion failed");
    }
};

// Post/Unpost Sales Return
export const postSalesReturn = async (req, res) => {
    const { id } = req.params;
    const { status, SalesReturnData, Location, Store, Condition } = req.body;

    try {
        const salesReturn = await SalesReturnModal.findById(id);
        if (!salesReturn) {
            return res.status(404).json({ success: false, message: "Sales return not found" });
        }

        if (status === true) {
            if (salesReturn.PostStatus) {
                return res.status(400).json({ success: false, message: "Return already posted" });
            }
            console.log(Condition)
            if (Condition == "Damage") {
                console.log("Damage ")
                const bulkOps = SalesReturnData.map(item => ({
                    updateOne: {
                        filter: {
                            ProductName: item.product,
                            Location,
                            Store
                        },
                        update: {
                            $inc: {
                                TotalQuantity: Number(item.totalBox) || 0,
                                Amount: (Number(item.netAmunt) || 0)
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
                for (const item of SalesReturnData) {
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
                await SalesReturnModal.findByIdAndUpdate(id, { PostStatus: true });

                return res.status(200).json({
                    success: true,
                    message: "Return posted and stock added successfully"
                });

            }
            else {
                console.log("first")
                const bulkOps = SalesReturnData.map(item => ({
                    updateOne: {
                        filter: {
                            ProductName: item.product,
                            Location,
                            Store
                        },
                        update: {
                            $inc: {
                                TotalQuantity: Number(item.totalBox) || 0,
                                Amount: (Number(item.netAmunt) || 0)
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
                for (const item of SalesReturnData) {
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
                await SalesReturnModal.findByIdAndUpdate(id, { PostStatus: true });

                return res.status(200).json({
                    success: true,
                    message: "Return posted and stock added successfully"
                });

            }


        } else {
            // Already unposted?
            if (!salesReturn.PostStatus) {
                return res.status(400).json({ success: false, message: "Return not posted yet" });
            }
             if (Condition == "Damage") {
                const stockChecks = await Promise.all(
                SalesReturnData.map(async item => {
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
                    message: "Insufficient stock to unpost return",
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

            // Prepare rollback bulk operations
            const bulkOps = SalesReturnData.map(item => ({
                updateOne: {
                    filter: {
                        ProductName: item.product,
                        Location,
                        Store,
                        TotalQuantity: { $gte: item.totalBox } // extra safety
                    },
                    update: {
                        $inc: {
                            TotalQuantity: -Number(item.totalBox) || 0,
                            Amount: -(Number(item.netAmunt) || 0)
                        }
                    }
                }
            }));

            await DamageProductModal.bulkWrite(bulkOps);
            await SalesReturnModal.findByIdAndUpdate(id, { PostStatus: false });

            return res.status(200).json({
                success: true,
                message: "Return unposted and stock reverted successfully"
            });
             }
             else {
                 const stockChecks = await Promise.all(
                SalesReturnData.map(async item => {
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
                    message: "Insufficient stock to unpost return",
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

            // Prepare rollback bulk operations
            const bulkOps = SalesReturnData.map(item => ({
                updateOne: {
                    filter: {
                        ProductName: item.product,
                        Location,
                        Store,
                        TotalQuantity: { $gte: item.totalBox } // extra safety
                    },
                    update: {
                        $inc: {
                            TotalQuantity: -Number(item.totalBox) || 0,
                            Amount: -(Number(item.netAmunt) || 0)
                        }
                    }
                }
            }));

            await TotalProductModal.bulkWrite(bulkOps);
            await SalesReturnModal.findByIdAndUpdate(id, { PostStatus: false });

            return res.status(200).json({
                success: true,
                message: "Return unposted and stock reverted successfully"
            });
             }
            // Check stock availability for rollback
            
        }

    } catch (error) {
        console.error("Sales return posting error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the return"
        });
    }
};


export const createSalesInvoiceReturnBulk = async (req, res) => {
    const { Returninvoices } = req.body;

    try {
        const lastInvoice = await SalesReturnModal.findOne().sort({ _id: -1 });
        let nextNumber = lastInvoice ? parseInt(lastInvoice.SalesReturnNumber, 10) + 1 : 1;

        const invoicePromises = Returninvoices.map(async (Returninvoices) => {
            const code = nextNumber.toString().padStart(6, '0');
            nextNumber++;
            return {
                SalesReturnNumber: code,
                SalesReturnData: Returninvoices.SalesData,
                Client: Returninvoices.Client,
                SalesInvoiceReturnDate: Returninvoices.SalesInvoiceReturnDate,
                SalesFlowRef: Returninvoices.SalesFlowRef,
                PostStatus: false,
                Store: Returninvoices.Store,
                Location: Returninvoices.Location,
                OrderBooker: Returninvoices.OrderBooker,
                Condition: Returninvoices.Condition
            };
        });

        const results = await Promise.allSettled(invoicePromises);

        const failedReturninvoices = results.filter(r => r.status === 'rejected');
        if (failedReturninvoices.length > 0) {
            return res.status(400).json({
                success: false,
                errors: failedReturninvoices.map(f => ({
                    code: f.reason.code,
                    issues: f.reason.errors
                }))
            });
        }

        const validReturninvoices = results.map(r => r.value);
        const created = await SalesReturnModal.insertMany(validReturninvoices);

        res.status(200).json({
            success: true,
            data: created,
            message: `${created.length} invoice(s) created successfully`
        });

    } catch (err) {
        console.error('Bulk invoice error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to process bulk Returninvoices',
            error: err.message
        });
    }
};

