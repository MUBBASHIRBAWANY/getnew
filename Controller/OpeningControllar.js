import DamageProductModal from "../modal/DamageProductModal.js";
import OpeningInventoryModal from "../modal/OpeningInventoryModal.js"
import TotalProductModal from "../modal/TotalProductModal.js"

export const createOpennigBalance = async (req, res) => {
    try {
        const { DateStart, DateEnd, InvoetoryData } = req.body;

        if (!DateStart || !DateEnd || !Array.isArray(InvoetoryData)) {
            return res.status(400).send("Missing DateStart, DateEnd or InvoetoryData");
        }

        const existingRecord = await OpeningInventoryModal.findOne({ DateStart, DateEnd });

        if (existingRecord) {
            existingRecord.InvoetoryData = existingRecord.InvoetoryData.concat(InvoetoryData);
            await existingRecord.save();
            return res.status(200).send("Inventory updated on existing date record.");
        } else {
            await OpeningInventoryModal.create(req.body);
            return res.status(200).send("New inventory record created.");
        }
    } catch (err) {
        console.error("Error in createOpennigBalance:", err);
        return res.status(500).send("Something went wrong.");
    }
};

export const getAllOpeningInventory = async (req, res) => {
    try {
        const data = await OpeningInventoryModal.find()
        res.status(200).send(data)
    } catch (err) {
        res.status(400).send("Some thing went wrong", err)
    }

}

export const deleteOpeningInvetory = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const data = await OpeningInventoryModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        console.log(err)
        res.status(400).send("Some thing went wrong", err)

    }
}

export const UpdateOpeningInvetory = async (req, res) => {
    const { id } = req.params
    try {
        const data = await OpeningInventoryModal.findByIdAndUpdate(id, req.body)
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("Some thing went wrong", err)

    }
}

export const changeStatusOnly = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const currentDoc = await OpeningInventoryModal.findById(id);
        const allDocs = await OpeningInventoryModal.find();

        if (!currentDoc) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        const inventoryData = currentDoc.InvoetoryData || [];

        if (status === "Open") {
            if (allDocs.length === 1) {
                const TotalProducts = inventoryData.map(item => ({
                    ProductName: item.product,
                    IncrementQuantity: item.opneingQty || 0,
                    Amount: (item.opneingQty || 0) * (item.opneingQtyValueExclGst || 0),
                    Location: item.Location,
                    Store: item.Store,
                    Type: item.Type
                }));

                const freshProducts = TotalProducts.filter(p => p.Type === "Fresh");
                const damageProducts = TotalProducts.filter(p => p.Type !== "Fresh");

                if (freshProducts.length) {
                    const bulkOps = freshProducts.map(product => ({
                        updateOne: {
                            filter: {
                                ProductName: product.ProductName,
                                Location: product.Location,
                                Store: product.Store,
                            },
                            update: {
                                $inc: {
                                    TotalQuantity: product.IncrementQuantity,
                                    Amount: product.Amount,
                                },
                                $setOnInsert: {
                                    ProductName: product.ProductName,
                                    Location: product.Location,
                                    Store: product.Store,
                                },
                            },
                            upsert: true,
                        },
                    }));

                    await TotalProductModal.bulkWrite(bulkOps);

                    for (const product of freshProducts) {
                        const existingProduct = await TotalProductModal.findOne({
                            ProductName: product.ProductName,
                            Location: product.Location,
                            Store: product.Store,
                        });

                        if (existingProduct && existingProduct.TotalQuantity > 0) {
                            const avgRate = existingProduct.Amount / existingProduct.TotalQuantity;
                            await TotalProductModal.updateOne(
                                { _id: existingProduct._id },
                                { $set: { AvgRate: avgRate } }
                            );
                        }
                    }
                }

                if (damageProducts.length) {
                    const bulkOps = damageProducts.map(product => ({
                        updateOne: {
                            filter: {
                                ProductName: product.ProductName,
                                Location: product.Location,
                                Store: product.Store,
                            },
                            update: {
                                $inc: {
                                    TotalQuantity: product.IncrementQuantity,
                                    Amount: product.Amount,
                                },
                                $setOnInsert: {
                                    ProductName: product.ProductName,
                                    Location: product.Location,
                                    Store: product.Store,
                                },
                            },
                            upsert: true,
                        },
                    }));

                    await DamageProductModal.bulkWrite(bulkOps);

                    for (const product of damageProducts) {
                        const existingProduct = await DamageProductModal.findOne({
                            ProductName: product.ProductName,
                            Location: product.Location,
                            Store: product.Store,
                        });

                        if (existingProduct && existingProduct.TotalQuantity > 0) {
                            const avgRate = existingProduct.Amount / existingProduct.TotalQuantity;
                            await DamageProductModal.updateOne(
                                { _id: existingProduct._id },
                                { $set: { AvgRate: avgRate } }
                            );
                        }
                    }
                }

                await OpeningInventoryModal.findByIdAndUpdate(id, { Status: status });
                return res.status(200).json({
                    success: true,
                    message: "Invoice posted and stock increased successfully",
                });
                

            } else {
                await OpeningInventoryModal.findByIdAndUpdate(id, { Status: status });
                return res.status(200).json({
                    success: true,
                    message: "Invoice status updated to Open",
                });
            }

        } else if (status === "Unpost") {
            if (allDocs.length === 1) {
                const TotalProducts = inventoryData.map(item => ({
                    ProductName: item.product,
                    DecrementQuantity: item.opneingQty || 0,
                    Amount: (item.opneingQty || 0) * (item.opneingQtyValueExclGst || 0),
                    Location: item.Location,
                    Store: item.Store,
                    Type: item.Type
                }));

                const freshProducts = TotalProducts.filter(p => p.Type === "Fresh");
                const damageProducts = TotalProducts.filter(p => p.Type !== "Fresh");

                if (freshProducts.length) {
                    const bulkOps = freshProducts.map(product => ({
                        updateOne: {
                            filter: {
                                ProductName: product.ProductName,
                                Location: product.Location,
                                Store: product.Store,
                            },
                            update: {
                                $inc: {
                                    TotalQuantity: -product.DecrementQuantity,
                                    Amount: -product.Amount,
                                },
                            },
                        },
                    }));

                    await TotalProductModal.bulkWrite(bulkOps);

                    for (const product of freshProducts) {
                        const updatedProduct = await TotalProductModal.findOne({
                            ProductName: product.ProductName,
                            Location: product.Location,
                            Store: product.Store,
                        });

                        const newAvgRate =
                            updatedProduct && updatedProduct.TotalQuantity > 0
                                ? updatedProduct.Amount / updatedProduct.TotalQuantity
                                : 0;

                        await TotalProductModal.updateOne(
                            { _id: updatedProduct._id },
                            { $set: { AvgRate: newAvgRate } }
                        );
                    }
                }

                if (damageProducts.length) {
                    const bulkOps = damageProducts.map(product => ({
                        updateOne: {
                            filter: {
                                ProductName: product.ProductName,
                                Location: product.Location,
                                Store: product.Store,
                            },
                            update: {
                                $inc: {
                                    TotalQuantity: -product.DecrementQuantity,
                                    Amount: -product.Amount,
                                },
                            },
                        },
                    }));

                    await DamageProductModal.bulkWrite(bulkOps);

                    for (const product of damageProducts) {
                        const updatedProduct = await DamageProductModal.findOne({
                            ProductName: product.ProductName,
                            Location: product.Location,
                            Store: product.Store,
                        });

                        const newAvgRate =
                            updatedProduct && updatedProduct.TotalQuantity > 0
                                ? updatedProduct.Amount / updatedProduct.TotalQuantity
                                : 0;

                        await DamageProductModal.updateOne(
                            { _id: updatedProduct._id },
                            { $set: { AvgRate: newAvgRate } }
                        );
                    }
                }

                await OpeningInventoryModal.findByIdAndUpdate(id, { Status: status });
                return res.status(200).json({
                    success: true,
                    message: "Unposted successfully and stock reduced",
                });

            } else {
                console.log(status)
                await OpeningInventoryModal.findByIdAndUpdate(id, { Status: status });
                return res.status(200).json({
                    success: true,
                    message: "Invoice closed successfully",
                });
            }
        }
        else if (status === "Closed") {
            await OpeningInventoryModal.findByIdAndUpdate(id, { Status: status });
            return res.status(200).json({
                success: true,
                message: "Year End Successfully",
            });

        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Something went wrong", error: err });
    }
};


export const genrateNewYear = async (req, res) => {
    const { startDate, dateEnd } = req.body

    const firstOpneing = await OpeningInventoryModal.find({
        DateStart: { $lte: startDate },
        DateEnd: { $gte: startDate }
    });
    console.log(firstOpneing)

}

