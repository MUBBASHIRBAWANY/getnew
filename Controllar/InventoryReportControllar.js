import OpeningInventoryModal from "../modal/OpeningInventoryModal.js";
import PurchaseInvoiceModal from "../modal/PurchaseInvoiceModal.js";
import SalesInvoiceModal from "../modal/SalesInvoiceModal.js";
import InventoryTransferOutModal from "../modal/InventoryTransferOutModal.js";
import InventoryTransferInModal from "../modal/TransferInModal.js";
import SalesReturnModal from "../modal/SalesReturnModal.js"
import PurchaseReturnModal from "../modal/PurchaseReturnModal.js";
import StockReplacementModal from "../modal/StockReplacementModal.js";
export const getSalesInvoiceByDate = async (req, res) => {
    try {
        const { startDate, endDate, status, product, Location, Store, damage } = req.query;


        const StoreArray = [...Store?.split(",")];
        console.log(StoreArray)
        const firstOpneing = await OpeningInventoryModal.find({
            DateStart: { $lte: startDate },
            DateEnd: { $gte: startDate }
        });

        const nextDate = firstOpneing[0]?.DateStart
        const previosdate = new Date(startDate);
        previosdate.setDate(previosdate.getDate() - 1);
        const before = previosdate.toISOString().split('T')[0];

        const mergedDataPurchaseBefore = await PurchaseInvoiceModal.aggregate([
            {
                $match: {
                    PurchaseInvoiceDate: {
                        $gte: nextDate,
                        $lte: before,
                    },
                },
            },
            { $unwind: "$PurchaseData" },

            {
                $group: {
                    _id: {
                        product: "$PurchaseData.product",
                        PostStatus: "$PostStatus",
                        Store: "$Store",
                        Location: "$Location",
                        PurchaseInvoiceDate: "$PurchaseInvoiceDate",
                    },
                    totalPurchaseBoxBefore: { $sum: "$PurchaseData.totalBox" },
                    totalPurchaseValueExclGst: { $sum: "$PurchaseData.GrossAmount" },
                }
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    totalPurchaseBoxBefore: 1,
                    date: "$_id.PurchaseInvoiceDate",
                    totalPurchaseValueExclGst: 1,
                    type: "PurchaseBefore",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                },
            },

        ])


        const mergedDataPurchase = await PurchaseInvoiceModal.aggregate([
            {
                $match: {
                    PurchaseInvoiceDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            { $unwind: "$PurchaseData" },

            {
                $group: {
                    _id: {
                        product: "$PurchaseData.product",
                        PostStatus: "$PostStatus",
                        PurchaseInvoiceDate: "$PurchaseInvoiceDate",
                        invoice: "$PurchaseInvoice",
                        SalesFlowRef: `$SalesFlowRef`,
                        Store: "$Store",
                        Location: "$Location",
                    },

                    totalPurchaseBox: { $sum: "$PurchaseData.totalBox" },
                    totalPurchaseUnits: { $sum: "$PurchaseData.unit" },
                    totalPurchaseValueExclGst: { $sum: "$PurchaseData.GrossAmount" },
                    totalPurchaseGst: {
                        $sum: {
                            $toDouble: "$PurchaseData.Gst"
                        }
                    },
                    totalPurchaseNetAmount: {
                        $sum: {
                            $toDouble: "$PurchaseData.netAmunt"
                        }
                    }
                },

            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    totalPurchaseBox: 1,
                    invoice: `$_id.invoice`,
                    totalPurchaseGst: 1,
                    date: "$_id.PurchaseInvoiceDate",
                    totalPurchaseUnits: 1,
                    totalPurchaseGrossAmntinclGst: 1,
                    totalPurchaseValueExclGst: 1,
                    type: "Purchase",
                    SalesFlowRef: `$_id.SalesFlowRef`,
                    Store: "$_id.Store",
                    Location: "$_id.Location",

                },
            },

        ])
        //   console.log(mergedDataPurchase, mergedDataPurchaseBefore)
        const TotalSalesDataBefore = await SalesInvoiceModal.aggregate([
            {
                $match: {
                    SalesInvoiceDate: {
                        $gte: nextDate,
                        $lte: before,
                    },
                },
            },
            { $unwind: "$SalesData" },

            {
                $group: {
                    _id: {
                        product: "$SalesData.product",
                        PostStatus: "$PostStatus",
                        invoice: "$SalesInvoice",
                        SalesInvoiceDate: "$SalesInvoiceDate",
                        Store: "$Store",
                        Location: "$Location",

                    },
                    totalSaleBoxBefore: { $sum: "$SalesData.totalBox" },
                    TotalValueExclGstBefore: { $sum: "$SalesData.TotalValueExclGst" },

                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    totalSaleBoxBefore: 1,
                    date: "$_id.SalesInvoiceDate",
                    TotalValueExclGstBefore: 1,
                    type: "IssueBefore",
                    Store: "$_id.Store",
                    Location: "$_id.Location",

                },
            },
        ]);
        const mergedDataSale = await SalesInvoiceModal.aggregate([
            {
                $match: {
                    SalesInvoiceDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            { $unwind: "$SalesData" },

            {
                $group: {
                    _id: {
                        product: "$SalesData.product",
                        OrderBooker: "$OrderBooker",
                        PostStatus: "$PostStatus",
                        invoice: `$SalesInvoice`,
                        SalesFlowRef: '$SalesFlowRef',
                        SalesInvoiceDate: "$SalesInvoiceDate",
                        Store: "$Store",
                        Location: "$Location",
                    },
                    totalSaleBox: { $sum: "$SalesData.totalBox" },
                    totalSaleUnits: { $sum: "$SalesData.unit" },
                    totalGrossSaleAmntinclGst: { $sum: "$SalesData.GrossAmntinclGst" },
                    totalValueExclSaleGst: { $sum: "$SalesData.TotalValueExclGst" },
                    totalSaleGst: { $sum: "$SalesData.Gst" },
                    totalNetSaleAmount: { $sum: "$SalesData.netAmunt" },

                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    OrderBooker: "$_id.OrderBooker",
                    PostStatus: "$_id.PostStatus",
                    totalSaleBox: 1,
                    invoice: `$_id.invoice`,
                    SalesFlowRef: '$_id.SalesFlowRef',
                    totalSaleUnits: 1,
                    totalGrossSaleAmntinclGst: 1,
                    totalValueExclSaleGst: 1,
                    totalSaleGst: 1,
                    date: "$_id.SalesInvoiceDate",
                    totalNetSaleAmount: 1,
                    type: "Issue",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                },
            },
        ]);

        const TotalSalesReturnDataBefore = await SalesReturnModal.aggregate([
            {
                $match: {
                    SalesInvoiceReturnDate: {
                        $gte: nextDate,
                        $lte: before,
                    },
                },
            },
            { $unwind: "$SalesReturnData" },
            {
                $group: {
                    _id: {
                        product: "$SalesReturnData.product",
                        PostStatus: "$PostStatus",
                        SalesReturnNumber: "$SalesReturnNumber",
                        SalesInvoiceReturnDate: "$SalesInvoiceReturnDate",
                        Store: "$Store",
                        Location: "$Location",
                        Condition: "$Condition"
                    },
                    totalReturnBoxBefore: { $sum: "$SalesReturnData.box" },
                    TotalSRValueExclGstBefore: { $sum: "$SalesReturnData.TotalValueExclGst" },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    totalReturnBoxBefore: 1,
                    date: "$_id.SalesInvoiceReturnDate",
                    TotalSRValueExclGstBefore: 1,
                    type: "ReturnBefore",
                    Store: "$_id.Store",
                    Condition: "$_id.Condition",
                    Location: "$_id.Location",
                },
            },
        ]);
        const mergedDataReturn = await SalesReturnModal.aggregate([
            {
                $match: {
                    SalesInvoiceReturnDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            { $unwind: "$SalesReturnData" },
            {
                $group: {
                    _id: {
                        product: "$SalesReturnData.product",
                        OrderBooker: "$OrderBooker",
                        PostStatus: "$PostStatus",
                        SalesReturnNumber: "$SalesReturnNumber",
                        SalesFlowRef: "$SalesFlowRef",
                        SalesInvoiceReturnDate: "$SalesInvoiceReturnDate",
                        Store: "$Store",
                        Condition: "$Condition",
                        Location: "$Location",
                    },
                    totalReturnBox: { $sum: "$SalesReturnData.box" },
                    totalReturnUnits: { $sum: "$SalesReturnData.unit" },
                    totalGrossReturnAmntinclGst: { $sum: "$SalesReturnData.GrossAmntinclGst" },
                    totalValueExclReturnGst: { $sum: "$SalesReturnData.TotalValueExclGst" },
                    totalReturnGst: { $sum: "$SalesReturnData.Gst" },
                    totalNetReturnAmount: { $sum: "$SalesReturnData.netAmunt" },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    OrderBooker: "$_id.OrderBooker",
                    PostStatus: "$_id.PostStatus",
                    invoice: "$_id.SalesReturnNumber",
                    SalesFlowRef: "$_id.SalesFlowRef",
                    totalReturnBox: 1,
                    totalReturnUnits: 1,
                    totalGrossReturnAmntinclGst: 1,
                    totalValueExclReturnGst: 1,
                    totalReturnGst: 1,
                    date: "$_id.SalesInvoiceReturnDate",
                    totalNetReturnAmount: 1,
                    type: "Return",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                    Condition: "$_id.Condition"
                },
            },
        ]);


        const mergedInventoryOutData = await InventoryTransferOutModal.aggregate([
            {
                $match: {
                    TransferOutDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            { $unwind: "$TransferData" },

            {
                $group: {
                    _id: {
                        product: "$TransferData.product",
                        PostStatus: "$PostStatus",
                        TransferCode: `$TransferCode`,
                        SalesFlowRef: '$SalesFlowRef',
                        TransferOutDate: "$TransferOutDate",
                        LocationFrom: "$LocationFrom",
                        LocationTo: "$LocationTo",
                        StoreFrom: "$StoreFrom",
                        StoreTo: "$StoreTo",
                        GrossAmount: "$TransferData.GrossAmount",

                    },
                    totalOutBoxes: { $sum: "$TransferData.totalBox" },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    totalOutBoxes: 1,
                    TransferCode: `$_id.TransferCode`,
                    SalesFlowRef: '$_id.SalesFlowRef',
                    TrsferOutGrossAmount: `$_id.GrossAmount`,
                    date: "$_id.TransferOutDate",
                    type: "TransferOut",
                    LocationFrom: "$_id.LocationFrom",
                    LocationTo: "$_id.LocationTo",
                    StoreFrom: "$_id.StoreFrom",
                    StoreTo: "$_id.StoreTo",
                    Rate: "$_id.Rate"

                },
            },
        ]);

        const mergedInventoryOutDataBefore = await InventoryTransferOutModal.aggregate([
            {
                $match: {
                    TransferOutDate: {
                        $gte: nextDate,
                        $lte: before,
                    },
                },
            },
            { $unwind: "$TransferData" },

            {
                $group: {
                    _id: {
                        product: "$TransferData.product",
                        PostStatus: "$PostStatus",
                        TransferCode: `$TransferCode`,
                        SalesFlowRef: '$SalesFlowRef',
                        TransferOutDate: "$TransferOutDate",
                        LocationFrom: "$LocationFrom",
                        LocationTo: "$LocationTo",
                        StoreFrom: "$StoreFrom",
                        StoreTo: "$StoreTo",
                        GrossAmount: "$TransferData.GrossAmount",

                    },
                    TransferOutBoxesBefore: { $sum: "$TransferData.totalBox" },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    TransferOutBoxesBefore: 1,
                    TransferCode: `$_id.TransferCode`,
                    SalesFlowRef: '$_id.SalesFlowRef',
                    TransferOutAmountBefore: `$_id.GrossAmount`,
                    date: "$_id.TransferOutDate",
                    type: "TransferOutBefore",
                    LocationFrom: "$_id.LocationFrom",
                    LocationTo: "$_id.LocationTo",
                    StoreFrom: "$_id.StoreFrom",
                    StoreTo: "$_id.StoreTo",
                    Rate: "$_id.Rate"

                },
            },
        ]);
        const mergedInventoryInData = await InventoryTransferInModal.aggregate([
            {
                $match: {
                    TransferInDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            { $unwind: "$TransferData" },

            {
                $group: {
                    _id: {
                        product: "$TransferData.product",
                        PostStatus: "$PostStatus",
                        TransferCode: `$TransferCode`,
                        SalesFlowRef: '$SalesFlowRef',
                        TransferInDate: "$TransferInDate",
                        LocationFrom: "$LocationFrom",
                        LocationTo: "$LocationTo",
                        StoreTo: "$StoreTo",
                        StoreFrom: "$StoreFrom",
                        GrossAmount: "$TransferData.GrossAmount",

                    },
                    totalInBoxes: { $sum: "$TransferData.totalBox" },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    totalInBoxes: 1,
                    TransferCode: `$_id.TransferCode`,
                    SalesFlowRef: '$_id.SalesFlowRef',
                    TransferInAmount: `$_id.GrossAmount`,
                    date: "$_id.TransferInDate",
                    type: "TransferIn",
                    LocationFrom: "$_id.LocationFrom",
                    LocationTo: "$_id.LocationTo",
                    StoreFrom: "$_id.StoreFrom",
                    StoreTo: "$_id.StoreTo",
                    Rate: "$_id.Rate"

                },
            },
        ]);

        const mergedInventoryinDataBefore = await InventoryTransferInModal.aggregate([
            {
                $match: {
                    TransferInDate: {
                        $gte: nextDate,
                        $lte: before,
                    },
                },
            },
            { $unwind: "$TransferData" },

            {
                $group: {
                    _id: {
                        product: "$TransferData.product",
                        PostStatus: "$PostStatus",
                        TransferCode: `$TransferCode`,
                        SalesFlowRef: '$SalesFlowRef',
                        TransferInDate: "$TransferInDate",
                        LocationFrom: "$LocationFrom",
                        LocationTo: "$LocationTo",
                        StoreFrom: "$StoreFrom",
                        StoreTo: "$StoreTo",
                        GrossAmount: "$TransferData.GrossAmount",
                    },
                    TransferInBoxesBefore: { $sum: "$TransferData.totalBox" },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    TransferInBoxesBefore: 1,
                    TransferCode: `$_id.TransferCode`,
                    SalesFlowRef: '$_id.SalesFlowRef',
                    TransferInAmountBefore: `$_id.GrossAmount`,
                    date: "$_id.TransferinDate",
                    type: "TransferinBefore",
                    LocationFrom: "$_id.LocationFrom",
                    LocationTo: "$_id.LocationTo",
                    StoreFrom: "$_id.StoreFrom",
                    StoreTo: "$_id.StoreTo",
                    Rate: "$_id.Rate"

                },
            },
        ]);
        const mergedPurchaseReturnData = await PurchaseReturnModal.aggregate([
            {
                $match: {
                    PurchaseReturnDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            { $unwind: "$PurchaseReturnData" },
            {
                $group: {
                    _id: {
                        product: "$PurchaseReturnData.product",
                        Vendor: "$Vendor",
                        PostStatus: "$PostStatus",
                        PurchaseReturn: "$PurchaseReturn",
                        SalesFlowRef: "$SalesFlowRef",
                        PurchaseReturnDate: "$PurchaseReturnDate",
                        Store: "$Store",
                        Location: "$Location",
                        Condition: "$PurchaseReturnData.Condition"

                    },
                    totalPurchaseReturnBox: { $sum: "$PurchaseReturnData.box" },
                    totalPurchaseReturnUnits: { $sum: "$PurchaseReturnData.unit" },
                    totalGrossReturnAmntinclGst: { $sum: "$PurchaseReturnData.netAmunt" },
                    totalValueExclReturnGst: { $sum: "$PurchaseReturnData.TotalValueExclGst" },
                    totalPurchaseReturnGst: { $sum: "$PurchaseReturnData.Gst" },
                    totalNetReturnAmount: { $sum: "$PurchaseReturnData.netAmunt" },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    Vendor: "$_id.Vendor",
                    PostStatus: "$_id.PostStatus",
                    invoice: "$_id.PurchaseReturn",
                    SalesFlowRef: "$_id.SalesFlowRef",
                    totalPurchaseReturnBox: 1,
                    totalPurchaseReturnUnits: 1,
                    totalGrossReturnAmntinclGst: 1,
                    totalValueExclReturnGst: 1,
                    totalPurchaseReturnGst: 1,
                    date: "$_id.PurchaseReturnDate",
                    totalNetReturnAmount: 1,
                    type: "PurchaseReturn",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                    Condition: "$_id.Condition",

                },
            },
        ]);
        const TotalPurchaseReturnBefore = await PurchaseReturnModal.aggregate([
            {
                $match: {
                    PurchaseReturnDate: {
                        $gte: nextDate,
                        $lte: before,
                    },
                },
            },
            { $unwind: "$PurchaseReturnData" },
            {
                $group: {
                    _id: {
                        product: "$PurchaseReturnData.product",
                        PostStatus: "$PostStatus",
                        invoice: "$PurchaseReturn",
                        PurchaseReturnDate: "$PurchaseReturnDate",
                        Store: "$Store",
                        Location: "$Location",
                        Condition: "$PurchaseReturnData.Condition",

                    },
                    totalPurchaseReturnBoxBefore: { $sum: "$PurchaseReturnData.box" },

                    TotalValueExclGstBefore: { $sum: "$PurchaseReturnData.TotalValueExclGst" },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    totalPurchaseReturnBoxBefore: 1,
                    date: "$_id.PurchaseReturnDate",
                    TotalValueExclGstBefore: 1,
                    type: "PurchaseReturnBefore",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                    Condition: "$_id.Condition",
                },
            },
        ]);
        const mergedStockReplacementData = await StockReplacementModal.aggregate([
            {
                $match: {
                    ReplacementDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            { $unwind: "$ReplacementData" },
            {
                $group: {
                    _id: {
                        productFrom: "$ReplacementData.productFrom",
                        productTo: "$ReplacementData.productTo",
                        Customer: "$Customer",
                        PostStatus: "$PostStatus",
                        SalesFlowRef: "$SalesFlowRef",
                        ReplacementDate: "$ReplacementDate",
                        Store: "$Store",
                        Location: "$Location",
                    },
                    totalBoxesReplacementFrom: { $sum: { $toDouble: "$ReplacementData.totalBoxesFrom" } },
                    totalBoxesReplacementTo: { $sum: { $toDouble: "$ReplacementData.totalBoxesTo" } },
                    totalUnitsReplacementFrom: { $sum: "$ReplacementData.unitFrom" },
                    totalUnitsTo: { $sum: "$ReplacementData.unitTo" },
                    totalValueReplacementFrom: { $sum: "$ReplacementData.fromValue" },
                    totalValueReplacementTo: { $sum: "$ReplacementData.ToValue" },
                },
            },
            {
                $project: {
                    _id: 0,
                    productFrom: "$_id.productFrom",
                    productTo: "$_id.productTo",
                    Customer: "$_id.Customer",
                    PostStatus: "$_id.PostStatus",
                    SalesFlowRef: "$_id.SalesFlowRef",
                    date: "$_id.ReplacementDate",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                    totalBoxesReplacementFrom: 1,
                    totalBoxesReplacementTo: 1,
                    totalUnitsFrom: 1,
                    totalUnitsTo: 1,
                    totalValueFrom: 1,
                    totalValueTo: 1,
                    type: "StockReplacement"
                },
            },
        ]);
        const TotalStockReplacementBefore = await StockReplacementModal.aggregate([
            {
                $match: {
                    ReplacementDate: {
                        $gte: nextDate,
                        $lte: before,
                    },
                },
            },
            { $unwind: "$ReplacementData" },
            {
                $group: {
                    _id: {
                        productFrom: "$ReplacementData.productFrom",
                        PostStatus: "$PostStatus",
                        ReplacementDate: "$ReplacementDate",
                        Store: "$Store",
                        Location: "$Location",
                        type: "StockReplacementBefore"
                    },
                    totalBoxesToReplacementBefore: { $sum: { $toDouble: "$ReplacementData.totalBoxesTo" } },
                    totalValueToReplacementBefore: { $sum: "$ReplacementData.ToValue" },
                },
            },
            {
                $project: {
                    _id: 0,
                    productFrom: "$_id.productFrom",
                    PostStatus: "$_id.PostStatus",
                    date: "$_id.ReplacementDate",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                    totalBoxesToReplacementBefore: 1,
                    totalValueToReplacementBefore: 1,
                    type: "StockReplacementBefore"
                },
            },
        ]);



        const YearOpening = firstOpneing[0]?.InvoetoryData
        console.log(YearOpening)

        if (status == "Post") {
            const truemergedStockReplacementData = mergedStockReplacementData.filter((item) => item.PostStatus == true)
            const trueTotalStockReplacementBefore = TotalStockReplacementBefore.filter((item) => item.PostStatus == true)
            const truemergedDataPurchase = mergedDataPurchase.filter((item) => item.PostStatus == true)
            const truemergedDataSale = mergedDataSale.filter((item) => item.PostStatus == true)
            const turemergedPurchaseReturnData = damage == "Fresh" ? mergedPurchaseReturnData.filter((item) => item.PostStatus == true && item.Condition == "Fresh") : damage == "Damage" ? mergedPurchaseReturnData.filter((item) => item.PostStatus == true && item.Condition == "Damage") : mergedPurchaseReturnData.filter((item) => item.PostStatus == true)
            const trueTotalPurchaseReturnBefore = damage == "Fresh" ? TotalPurchaseReturnBefore.filter((item) => item.PostStatus == true && item.Condition == "Fresh") : damage == "Damage" ? TotalPurchaseReturnBefore.filter((item) => item.PostStatus == true && item.Condition == "Damage") : TotalPurchaseReturnBefore.filter((item) => item.PostStatus == true)
            const truemergedDataPurchaseBefore = mergedDataPurchaseBefore.filter((item) => item.PostStatus == true)
            const trueTotalSalesDataBefore = TotalSalesDataBefore.filter((item) => item.PostStatus == true)
            const truemergedInventoryOutData = mergedInventoryOutData.filter((item) => item.PostStatus !== false)
            const trurmergedInventoryOutDataBefore = mergedInventoryOutDataBefore.filter((item) => item.PostStatus !== false)
            const truemergedInventoryinDataBefore = mergedInventoryinDataBefore.filter((item) => item.PostStatus == "Received")
            const truemergedInventoryinData = mergedInventoryInData.filter((item) => item.PostStatus !== false)
            const truemergedDataReturn = damage == "Fresh" ? mergedDataReturn.filter((item) => item.PostStatus !== false && item.Condition !== "Damage") : damage == "Damage" ? mergedDataReturn.filter((item) => item.PostStatus !== false && item.Condition == "Damage") : mergedDataReturn.filter((item) => item.PostStatus !== false)
            const trueTotalSalesReturnDataBefore = damage == "Fresh" ? TotalSalesReturnDataBefore.filter((item) => item.PostStatus == true && item.Condition !== "Damage") : damage == "Damage" ? TotalSalesReturnDataBefore.filter((item) => item.PostStatus == true && item.Condition == "Damage") : TotalSalesReturnDataBefore.filter((item) => item.PostStatus == true)
            const truemarge = truemergedDataPurchase.concat(truemergedDataSale).concat(truemergedDataPurchaseBefore).concat(trueTotalSalesDataBefore).concat(YearOpening).concat(truemergedInventoryOutData).concat(trurmergedInventoryOutDataBefore).concat(truemergedInventoryinDataBefore).concat(truemergedInventoryinData).concat(trueTotalSalesReturnDataBefore).concat(truemergedDataReturn).concat(turemergedPurchaseReturnData).concat(trueTotalPurchaseReturnBefore).concat(truemergedStockReplacementData).concat(trueTotalStockReplacementBefore)
console.log("Fresh aya hai Damage" , damage)
            if (damage == "Damage") {
                console.log("Damage aya hai")
                const Damagedata = truemarge.filter((item) => item.Condition === "Damage")
                console.log(Damagedata)
                res.json(Damagedata)
            }
            
            else if (damage == "Fresh") {
                
                if (product || Location || Store) {
                    const data = truemarge.filter((item) => {

                        const productMatch = product
                            ? item?.product == product
                            || item?.productTo === product ||
                            item?.productTo === product : true;
                        const locationMatch = Location
                            ? item?.LocationTo === Location ||
                            item?.LocationFrom === Location ||
                            item?.Location === Location
                            : true;

                        const storeMatch = !Store ||
                            StoreArray.includes(item?.StoreTo) ||
                            StoreArray.includes(item?.StoreFrom) ||
                            StoreArray.includes(item?.Store);
                        return productMatch && locationMatch && storeMatch;
                    });


                    res.json(data);
                }
                else {
                    res.json(truemarge)

                }
            }
            else {
                res.json(truemarge)
            }





        }
        
        else if (status == "UnPost") {
            console.log("UnPost")
            const falsemergedStockReplacementData = mergedStockReplacementData.filter((item) => item.PostStatus == false)
            const falseTotalStockReplacementBefore = TotalStockReplacementBefore.filter((item) => item.PostStatus == false)
            console.log(falsemergedStockReplacementData, falseTotalStockReplacementBefore)
            const falsemergedDataPurchase = mergedDataPurchase.filter((item) => item.PostStatus == false)
            const falsemergedDataSale = mergedDataSale.filter((item) => item.PostStatus == false)
            const falsemergedPurchaseReturnData = damage == "Fresh" ? mergedPurchaseReturnData.filter((item) => item.PostStatus == false && item.Condition == "Fresh") : damage == "Damage" ? mergedPurchaseReturnData.filter((item) => item.PostStatus == false && item.Condition == "Damage") : mergedPurchaseReturnData.filter((item) => item.PostStatus == false)
            const falseTotalPurchaseReturnBefore = damage == "Fresh" ? TotalPurchaseReturnBefore.filter((item) => item.PostStatus == false && item.Condition == "Fresh") : damage == "Damage" ? TotalPurchaseReturnBefore.filter((item) => item.PostStatus == false && item.Condition == "Damage") : TotalPurchaseReturnBefore.filter((item) => item.PostStatus == false)
            const falsemergedDataPurchaseBefore = mergedDataPurchaseBefore.filter((item) => item.PostStatus == false)
            const falseTotalSalesDataBefore = TotalSalesDataBefore.filter((item) => item.PostStatus == false)
            const falsemergedInventoryOutData = mergedInventoryOutData.filter((item) => item.PostStatus == false)
            const falsemergedInventoryOutDataBefore = mergedInventoryOutDataBefore.filter((item) => item.PostStatus == false)
            const falsemergedInventoryinDataBefore = mergedInventoryinDataBefore.filter((item) => item.PostStatus == "Received")
            const falsemergedInventoryinData = mergedInventoryInData.filter((item) => item.PostStatus == false)
            const falsemergedDataReturn = damage == "Fresh" ? mergedDataReturn.filter((item) => item.PostStatus == false && item.Condition !== "Damage") : damage == "Damage" ? mergedDataReturn.filter((item) => item.PostStatus == false && item.Condition == "Damage") : mergedDataReturn.filter((item) => item.PostStatus == false)
            const falseTotalSalesReturnDataBefore = damage == "Fresh" ? TotalSalesReturnDataBefore.filter((item) => item.PostStatus == false && item.Condition !== "Damage") : damage == "Damage" ? TotalSalesReturnDataBefore.filter((item) => item.PostStatus == false && item.Condition == "Damage") : TotalSalesReturnDataBefore.filter((item) => item.PostStatus == false)
            const falsemarge = falsemergedDataPurchase.concat(falsemergedDataSale).concat(falsemergedDataPurchaseBefore).concat(falseTotalSalesDataBefore).concat(YearOpening).concat(falsemergedInventoryOutData).concat(falsemergedInventoryOutDataBefore).concat(falsemergedInventoryinDataBefore).concat(falsemergedInventoryinData).concat(falseTotalSalesReturnDataBefore).concat(falsemergedDataReturn).concat(falsemergedPurchaseReturnData).concat(falseTotalPurchaseReturnBefore).concat(falsemergedStockReplacementData).concat(falseTotalStockReplacementBefore)
            if (damage == "Damage") {
                console.log("unpost ka Damage aya hai")
                
                const Damagedata = falsemarge.filter((item) => item.Condition === "Damage" || item.Type == 'Damage' || item.type == "StockReplacement")
                console.log(Damagedata)
                res.json(Damagedata)
            }
            else if (damage == "Fresh") {
                if (Location || Store) {
                    const data = falsemarge.filter((item) => {
                            const locationMatch = Location
                            ? item?.LocationTo === Location ||
                            item?.LocationFrom === Location ||
                            item?.Location === Location
                            : true;

                        const storeMatch = !Store ||
                            StoreArray.includes(item?.StoreTo) ||
                            StoreArray.includes(item?.StoreFrom) ||
                            StoreArray.includes(item?.Store);
                        return  locationMatch && storeMatch;
                    });


                    res.json(data);
                }
                else {
                    res.json(falsemarge)

                }
            }
            else {
                res.json(falsemarge)
            }

        }
        else {
            const bothdata = mergedStockReplacementData.concat(YearOpening).concat(mergedDataPurchase).concat(mergedDataSale).concat(mergedPurchaseReturnData).concat(TotalPurchaseReturnBefore).concat(mergedDataPurchaseBefore).concat(TotalSalesDataBefore).concat(mergedInventoryOutData).concat(mergedInventoryOutDataBefore).concat(mergedInventoryinDataBefore).concat(mergedInventoryInData).concat(mergedDataReturn).concat(TotalSalesReturnDataBefore)
            if (Location || Store) {
                const data = bothdata.filter((item) => {
                    const locationMatch = Location
                        ? item?.LocationTo === Location ||
                        item?.LocationFrom === Location ||
                        item?.Location === Location
                        : true;

                    const storeMatch = !Store ||
                        StoreArray.includes(item?.StoreTo) ||
                        StoreArray.includes(item?.StoreFrom) ||
                        StoreArray.includes(item?.Store);
                    return  locationMatch && storeMatch;
                });


                res.json(data);
            }
            else {

                res.json(bothdata);
            }
        }

    } catch (error) {

        res.status(500).json({ error: error.message });
    }
}
