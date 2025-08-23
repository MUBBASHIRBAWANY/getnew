import PurchaseInvoiceModal from "../modal/PurchaseInvoiceModal.js";


export const allPurchaseDumpData = async (req, res) => {

    const { startDate, endDate } = req.query;
    try {
console.log(startDate, endDate)
        const allPurchaseData = await PurchaseInvoiceModal.aggregate([
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
                        invoice: "$PurchaseInvoice",
                        PurchaseInvoiceDate: "$PurchaseInvoiceDate",
                        Store: "$Store",
                        Location: "$Location",
                        carton: "$PurchaseData.carton",
                        discount : "$PurchaseData.discount", 
                        TotalAmount: "$PurchaseData.netAmunt",
                        Vendor: "$Vendor",

                    },
                    
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    date: "$_id.PurchaseInvoiceDate",
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                    invoice: "$_id.invoice",
                    carton: "$_id.carton",
                    TotalAmount: "$_id.TotalAmount",
                    discount: "$_id.discount",
                    Vendor : "$_id.Vendor",
        
                },

            },
            
            
        ])
        
        res.status(200).send(allPurchaseData)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
}