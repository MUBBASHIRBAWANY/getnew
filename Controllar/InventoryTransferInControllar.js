import InventoryTransferOutModal from "../modal/InventoryTransferOutModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";
import InventoryTransferInModal from "../modal/TransferInModal.js";

export const getAllTransferIn = async (req, res) => {
    const data = await InventoryTransferInModal.find();
    if (data) {
        res.status(200).json({
            message: "All Transfer In Data",
            data: data
        });
    }
    else {
        res.status(404).json({
            message: "No Transfer In Data Found"
        });
    }
}
export const postTransferIn = async (req, res) => {
    const { status, TransferData, LocationTo, StoreTo, TransferCode } = req.body;
    const { id } = req.params;
    if (status === "Recived") {
        try {
            const quantityUpdates = TransferData.map(item => ({
                updateOne: {
                    filter: {
                        ProductName: item.product,
                        Location: LocationTo,
                        Store: StoreTo
                    },
                    update: {
                        $inc: {
                            TotalQuantity: Number(item.totalBox) || 0,
                            Amount: Number(item.GrossAmount) || 0
                        },
                        $setOnInsert: {
                            ProductName: item.product,
                            Location: LocationTo,
                            Store: StoreTo,
                            AvgRate: 0
                        }
                    },
                    upsert: true
                }
            }));
            console.log(quantityUpdates)
            await TotalProductModal.bulkWrite(quantityUpdates);

            // 2. Update average rates
            for (const item of TransferData) {
                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Location: LocationTo,
                    Store: StoreTo
                });

                if (product && product.TotalQuantity > 0) {
                    const avgRate = product.Amount / product.TotalQuantity;
                    await TotalProductModal.updateOne(
                        { _id: product._id },
                        { $set: { AvgRate: avgRate } }
                    );
                }
            }

            // 3. Update transfer statuses
            await InventoryTransferInModal.findByIdAndUpdate(id, { PostStatus: "Received" });
            await InventoryTransferOutModal.findOneAndUpdate(
                { TransferCode: TransferCode },
                { PostStatus: "Received" }
            );

            return res.status(200).json({
                success: true,
                message: "Destination quantity increased"
            });

        } catch (error) {
            console.error("Transfer In error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to update destination quantity"
            });
        }
    }
};

