import CutomerModal from "../modal/CutomerModal.js";
import RegionModal from "../modal/RegionModal.js";
import SalesInvoiceModal from "../modal/SalesInvoiceModal.js";


export const allSalesDumpData = async (req, res) => {

    const { startDate, endDate } = req.query;
    try {
        const Client = await CutomerModal.find()
        const allSalesData = await SalesInvoiceModal.aggregate([
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
                        PostStatus: "$PostStatus",
                        invoice: "$SalesInvoice",
                        SalesInvoiceDate: "$SalesInvoiceDate",
                        Store: "$SalesData.Store",
                        Location: "$SalesData.Location",
                        OrderBooker: "$SalesData.OrderBooker",
                        SalesOrder: "SalesData.Order",
                        carton: "$SalesData.Delivered",
                        TotalAmount: "$SalesData.TotalAmount",
                        Client: "$Client",
                        DcNumber: "$DcNumber"

                    },
                    totalSaleCarton: { $sum: "$SalesData.TotalAmount" },
                    TotalValueExclGstBefore: { $sum: "$SalesData.TotalAmount" },
                    
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    date: "$_id.SalesInvoiceDate",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                    invoice: "$_id.invoice",
                    OrderBooker: "$_id.OrderBooker",
                    carton: "$_id.carton",
                    TotalAmount: "$_id.TotalAmount",
                    Client : "$_id.Client",
        
                },

            },
            
            
        ])
        
        
        res.status(200).send(allSalesData)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
}