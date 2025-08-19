import InventoryTransferOutModal from "../modal/InventoryTransferOutModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";
import InventoryTransferInModal from "../modal/TransferInModal.js";

export const createTransferOut = async (req, res) => {
    const {
        TransferOutDate,
        LocationFrom,
        LocationTo,
        StoreFrom,
        StoreTo,
        TransferData,
        SalesFlowRef,
    } = req.body;

    try {
        const lastTransfer = await InventoryTransferOutModal.findOne().sort({ _id: -1 });
        let nextCode;

        if (!lastTransfer) {
            nextCode = "000001";
        } else {
            const nextNumber = parseInt(lastTransfer.TransferCode, 10) + 1;
            nextCode = nextNumber.toString().padStart(6, '0');
        }

        // Validate stock availability at source
        const stockChecks = await Promise.all(
            TransferData.map(async item => {
                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Location: LocationFrom,
                    Store: StoreFrom
                });
                return { product, item };
            })
        );

        const errors = stockChecks.filter(({ product, item }) =>
            !product || (product.TotalQuantity || 0) < (item.totalBox || 0)
        );

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock at source location",
                errors: errors.map(({ product, item }) =>
                    !product
                        ? { product: item.product, message: "Product not found" }
                        : {
                            product: product.ProductName,
                            available: product.TotalQuantity,
                            required: item.totalBox
                        }
                )
            });
        }
        const newTransfer = await InventoryTransferOutModal.create({
            TransferCode: nextCode,
            TransferOutDate,
            LocationFrom,
            LocationTo,
            StoreFrom,
            StoreTo,
            PostStatus: false,
            TransferData,
            SalesFlowRef,
        });
        console.log(newTransfer)
        return res.status(200).json({
            success: true,
            data: newTransfer
        });

    } catch (err) {
        console.error("createTransferOut error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create transfer"
        });
    }
};

export const getAllTransferOuts = async (req, res) => {
    try {
        const transfers = await InventoryTransferOutModal.find().sort({ TransferCode: -1 });
        return res.status(200).json({
            success: true,
            data: transfers
        });
    } catch (err) {
        console.error("getAllTransferOuts error:", err);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export const postTransferOut = async (req, res) => {
    const { id } = req.params;
    const { status, TransferData, LocationFrom, StoreFrom, LocationTo, StoreTo, TransferOutDate } = req.body;

    try {
        const transfer = await InventoryTransferOutModal.findById(id);
        if (!transfer) {
            return res.status(404).json({ success: false, message: "Transfer not found" });
        }

        if (status === "TransferOut") {
            if (transfer.PostStatus === "TransferOut") {
                return res.status(400).json({ success: false, message: "Transfer already posted" });
            }

            // ONLY decrease source quantity
            const bulkOps = TransferData.map(({ product, totalBox }) => {
                const qty = Number(totalBox) || 0;
                return {
                    updateOne: {
                        filter: { ProductName: product, Location: LocationFrom, Store: StoreFrom },
                        update: { $inc: { TotalQuantity: -qty } }
                    }
                };
            });

            await TotalProductModal.bulkWrite(bulkOps);
            await InventoryTransferOutModal.findByIdAndUpdate(id, { PostStatus: "TransferOut" });
            await InventoryTransferInModal.create({
                TransferCode: transfer.TransferCode,
                TransferInDate: TransferOutDate,
                LocationFrom,
                LocationTo,
                StoreFrom,
                StoreTo,
                PostStatus: "TransferOut",
                TransferData,
                SalesFlowRef: transfer.SalesFlowRef
            });


            return res.status(200).json({ success: true, message: "Source quantity decreased" });

        } else {
            // Unposting logic: Reverse source decrease
            const bulkOps = TransferData.map(({ product, totalBox }) => {
                const qty = Number(totalBox) || 0;
                return {
                    updateOne: {
                        filter: { ProductName: product, Location: LocationFrom, Store: StoreFrom },
                        update: { $inc: { TotalQuantity: qty } }
                    }
                };
            });

            await TotalProductModal.bulkWrite(bulkOps);
            const ChangeStatusAllow = await InventoryTransferInModal.findOne(
                { TransferCode: transfer.TransferCode,
                    PostStatus: "Received" 
                 },
            );
            if (ChangeStatusAllow) {
                console.log("Transfer Receive By Store To", ChangeStatusAllow);
                return res.status(404).json({ success: false, message: "Transfer Receive By Store To" });
            } else {
                await InventoryTransferOutModal.findByIdAndUpdate(id, { PostStatus: false });
                await InventoryTransferInModal.findOneAndDelete(
                    { TransferCode: transfer.TransferCode },
                );
                return res.status(200).json({ success: true, message: "Transfer unposted" });
            }
        }

    } catch (err) {
        console.error("postTransferOut error:", err);
        return res.status(500).json({ success: false, message: "Error processing transfer" });
    }
};

export const deleteTransferOut = async (req, res) => {
    const { id } = req.params;
    try {
        const transfer = await InventoryTransferOutModal.findById(id);
        if (!transfer) return res.status(404).json({ success: false, message: "Transfer not found" });

        if (transfer.PostStatus === "PostStatus") {
            return res.status(400).json({ success: false, message: "Cannot delete posted transfer" });
        }

        await InventoryTransferOutModal.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Transfer deleted successfully" });
    } catch (err) {
        console.error("deleteTransferOut error:", err);
        return res.status(500).json({ success: false, message: "Failed to delete transfer" });
    }
};
export const createTransferOutBulk = async (req, res) => {
    const { transfers } = req.body;

    if (!transfers || !Array.isArray(transfers)) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing 'transfers' data"
        });
    }

    try {
        const lastTransfer = await InventoryTransferOutModal.findOne().sort({ _id: -1 });
        let nextNumber = lastTransfer ? parseInt(lastTransfer.TransferCode, 10) + 1 : 1;

        const transferDocs = await Promise.all(
            transfers.map(async (transfer) => {
                const code = nextNumber.toString().padStart(6, '0');
                nextNumber++;

                return {
                    TransferCode: code,
                    TransferOutDate: transfer.TransferOutDate,
                    LocationFrom: transfer.LocationFrom,
                    LocationTo: transfer.LocationTo,
                    StoreFrom: transfer.StoreFrom,
                    StoreTo: transfer.StoreTo,
                    PostStatus: false,
                    SalesFlowRef: transfer.SalesFlowRef,
                    TransferData: transfer.TransferData
                };
            })
        );

        const createdTransfers = await InventoryTransferOutModal.insertMany(transferDocs);

        return res.status(200).json({
            success: true,
            data: createdTransfers,
            message: `${createdTransfers.length} transfer(s) created successfully`
        });

    } catch (error) {
        if (error?.code && error?.errors) {
            return res.status(400).json({
                success: false,
                message: "Validation error in one or more transfer documents",
                error
            });
        }

        console.error("Bulk transfer error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process bulk transfers",
            error: error.message || "Unknown error"
        });
    }
};

export const updateTransferOut = async (req, res) => {
    const { id } = req.params;
    const {
        TransferOutDate,
        LocationFrom,
        LocationTo,
        StoreFrom,
        StoreTo,
        TransferData,
        SalesFlowRef
    } = req.body;

    try {
        const existingTransfer = await InventoryTransferOutModal.findById(id);

        if (!existingTransfer) {
            return res.status(404).json({
                success: false,
                message: "Transfer not found"
            });
        }

        if (existingTransfer.PostStatus === "PostStatus") {
            return res.status(400).json({
                success: false,
                message: "Cannot update a posted transfer"
            });
        }

        // Optional stock validation again before update
        const stockCheck = await Promise.all(
            TransferData.map(async (item) => {
                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Location: LocationFrom,
                    Store: StoreFrom
                });
                return { product, item };
            })
        );

        const errors = stockCheck.filter(({ product, item }) =>
            !product || (product.TotalQuantity || 0) < (item.totalBox || 0)
        );

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock to update transfer",
                errors: errors.map(({ product, item }) =>
                    !product
                        ? { product: item.product, message: "Product not found" }
                        : {
                            product: product.ProductName,
                            available: product.TotalQuantity,
                            required: item.totalBox
                        }
                )
            });
        }

        const updatedTransfer = await InventoryTransferOutModal.findByIdAndUpdate(
            id,
            {
                TransferOutDate,
                LocationFrom,
                LocationTo,
                StoreFrom,
                StoreTo,
                TransferData,
                SalesFlowRef

            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data: updatedTransfer,
            message: "Transfer updated successfully"
        });

    } catch (error) {
        console.error("updateTransferOut error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update transfer",
            error: error.message
        });
    }
};

