import AccountOpeningBalanceModal from "../modal/AccountsOpeningModal.js";
import DamageProductModal from "../modal/DamageProductModal.js";
import OpeningInventoryModal from "../modal/OpeningInventoryModal.js"
import PurchaseInvoiceModal from "../modal/PurchaseInvoiceModal.js";
import SaleOrderDcModal from "../modal/SaleOrderDcModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";
import SalesReturnModal from "../modal/SalesReturnModal.js";
import PurchaseReturnModal from "../modal/PurchaseReturnModal.js";
import VoucherModal from "../modal/VoucherModal.js";
import ChartofAccountsModel from "../modal/ChartofAccountsModal.js";


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

const generateNextCodeForVoucher = (code) => {
  console.log(code)
  if(code == null){
    console.log("first")
    return "Sys000001"
  }
  const nextNumber =  (parseInt(code.slice('3', "9"))) + 1;
  const nextCode = `Sys${nextNumber.toString().padStart(6, '0')}`;
  console.log(nextCode , "nextCode")
  return nextCode
}

function generateNextFiscalYear(startDate, endDate) {
    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Add 1 year to both
    const nextStart = new Date(start.setFullYear(start.getFullYear() + 1));
    const nextEnd = new Date(end.setFullYear(end.getFullYear() + 1));

    // Format back to YYYY-MM-DD
    const format = (d) => d.toISOString().split("T")[0];

    return {
        nextStart: format(nextStart),
        nextEnd: format(nextEnd),
    };
}

export const genrateNewYear = async (req, res) => {
    const { startDate, dateEnd, Assets, Capital, liabilities, Expenses, Revenue, RetainedearningsAccount } = req.body



    const openingdate = generateNextFiscalYear(startDate, dateEnd)
    const existingInventory = await OpeningInventoryModal.findOne({
        DateStart: openingdate.nextStart,
        DateEnd: openingdate.nextEnd,
    })
    const existingAccountOpen = await AccountOpeningBalanceModal.findOne({
        DateStart: openingdate.nextStart,
        DateEnd: openingdate.nextEnd,
    })
console.log(existingAccountOpen , existingInventory)
    if(existingInventory || existingAccountOpen){
        await OpeningInventoryModal.findByIdAndDelete(existingInventory._id)
        await AccountOpeningBalanceModal.findByIdAndDelete(existingAccountOpen._id)
        await VoucherModal.findOneAndDelete({VoucherNumber : existingAccountOpen.VoucherRef})
    }


    const StartjsDate = new Date(startDate);
    const EndjsDate = new Date(dateEnd);
    const DateStart = StartjsDate.toISOString().split("T")[0];
    const DateEnd = EndjsDate.toISOString().split("T")[0];
    console.log(DateStart, DateEnd)
    try {
        const Openinginventory = await OpeningInventoryModal.find({
            DateStart: { $lte: startDate },
            DateEnd: { $gte: startDate }
        });


        const mergedDataPurchase = await PurchaseInvoiceModal.aggregate([
            {
                $match: {
                    PurchaseInvoiceDate: {
                        $gte: DateStart,
                        $lte: DateEnd,
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

        const mergedDataDc = await SaleOrderDcModal.aggregate([
            {
                $match: {
                    DcDate: {
                        $gte: DateStart,
                        $lte: DateEnd,
                    },
                },
            },
            { $unwind: "$DcData" },

            {
                $group: {
                    _id: {
                        product: "$DcData.product",
                        PostStatus: "$Status",
                        DcDate: "$DcDate",
                        DcNumber: "$DcNumber",
                        Store: "$Store",
                        Location: "$Location",
                    },
                    // Convert Delivered (string) → number, then sum
                    Delivered: { $sum: { $toInt: "$DcData.Delivered" } },
                },
            },

            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    DcNumber: "$_id.DcNumber",
                    DcDate: "$_id.DcDate",
                    Delivered: 1,
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                },
            },
        ]);


        const mergedDataSalesReturn = await SalesReturnModal.aggregate([
            {
                $match: {
                    SalesInvoiceReturnDate: {
                        $gte: DateStart,
                        $lte: DateEnd,
                    },
                },
            },
            { $unwind: "$SalesReturnData" },

            {
                $group: {
                    _id: {
                        product: "$SalesReturnData.product",
                        PostStatus: "$Status",
                        SalesInvoiceReturnDate: "$SalesInvoiceReturnDate",
                        SalesReturnNumber: "$SalesReturnNumber",
                        Store: "$Store",
                        Location: "$Location",
                    },
                    // Convert Delivered (string) → number, then sum
                    Return: { $sum: { $toInt: "$SalesReturnData.return" } },
                },
            },

            {
                $project: {
                    _id: 0,
                    product: "$_id.product",
                    PostStatus: "$_id.PostStatus",
                    SalesReturnNumber: "$_id.SalesReturnNumber",
                    SalesInvoiceReturnDate: "$_id.SalesInvoiceReturnDate",
                    Return: 1,
                    Store: "$_id.Store",
                    Location: "$_id.Location",
                },
            },
        ]);

        const mergedPurchaseReturnData = await PurchaseReturnModal.aggregate([
            {
                $match: {
                    PurchaseReturnDate: {
                        $gte: DateStart,
                        $lte: DateEnd,
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
                        Store: "$Store",
                        Location: "$Location",

                    },
                    totalPurchaseReturnBox: { $sum: "$PurchaseReturnData.box" },
                    totalPurchaseReturnCarton: { $sum: "$PurchaseReturnData.unit" },
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
                    totalPurchaseReturnCarton: 1,
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

        const data = mergedDataPurchase.concat(Openinginventory[0].InvoetoryData).concat(mergedDataDc).concat(mergedDataSalesReturn).concat(mergedPurchaseReturnData)
        const merged = Object.values(
            data.reduce((acc, curr) => {
                const p = curr.product;
                if (!acc[p]) {
                    acc[p] = {
                        product: p,
                        totalPurchaseBox: 0,
                        totalPurchaseUnits: 0,
                        totalPurchaseValueExclGst: 0,
                        totalPurchaseGst: 0,
                        totalPurchaseReturnBox: 0,
                        totalPurchaseReturnCarton: 0,
                        totalGrossReturnAmntinclGst: 0,
                        totalValueExclReturnGst: 0,
                        totalPurchaseReturnGst: 0,
                        totalNetReturnAmount: 0,
                        Delivered: 0,
                        Return: 0,
                        OpeningQty: 0,
                        opneingQty: 0,
                        perBox: 0,
                        ValueExclGst: 0,
                        totalAvalibeleCarton: 0,
                        totalNetAmount: 0
                    }
                }

                // 🔹 Add Purchase
                if (curr.type === 'Purchase') {
                    acc[p].totalPurchaseBox += curr.totalPurchaseBox || 0;
                    acc[p].totalPurchaseUnits += curr.totalPurchaseUnits || 0;
                    acc[p].totalPurchaseValueExclGst += curr.totalPurchaseValueExclGst || 0;
                    acc[p].totalPurchaseGst += curr.totalPurchaseGst || 0;
                    acc[p].totalAvalibeleCarton += curr.totalPurchaseBox
                    acc[p].totalNetAmount += curr.totalPurchaseValueExclGst || 0;
                }

                // 🔹 Add Purchase Return
                if (curr.type === 'PurchaseReturn') {
                    acc[p].totalPurchaseReturnBox += curr.totalPurchaseReturnBox || 0;
                    acc[p].totalPurchaseReturnCarton += curr.totalPurchaseReturnCarton || 0;
                    acc[p].totalGrossReturnAmntinclGst += curr.totalGrossReturnAmntinclGst || 0;
                    acc[p].totalValueExclReturnGst += curr.totalValueExclReturnGst || 0;
                    acc[p].totalPurchaseReturnGst += curr.totalPurchaseReturnGst || 0;
                    acc[p].totalNetReturnAmount += curr.totalNetReturnAmount || 0;
                    acc[p].totalAvalibeleCarton -= curr.totalPurchaseReturnCarton || 0;
                    acc[p].totalNetAmount -= curr.totalValueExclReturnGst || 0;
                }

                // 🔹 Add Opening
                if (curr.opneingQty) {
                    acc[p].OpeningQty += curr.OpeningQty || 0;
                    acc[p].opneingQty += parseFloat(curr.opneingQty) || 0;
                    acc[p].perBox = curr.perBox || acc[p].perBox;
                    acc[p].ValueExclGst += parseFloat(curr.ValueExclGst) || 0;
                    acc[p].totalAvalibeleCarton += parseFloat(curr.opneingQty)
                    acc[p].totalNetAmount += parseFloat(curr.ValueExclGst) || 0;
                }

                // 🔹 Add Delivery
                if (curr.Delivered) {
                    acc[p].Delivered += curr.Delivered || 0;
                    acc[p].totalAvalibeleCarton -= curr.Delivered || 0;
                }

                // 🔹 Add Sales Return
                if (curr.Return) {
                    acc[p].Return += curr.Return || 0;
                    acc[p].totalAvalibeleCarton += curr.Return
                }

                return acc;
            }, {})
        );


        const newopening = {
            DateStart: openingdate.nextStart,
            DateEnd: openingdate.nextEnd,
            InvoetoryData: merged.map((item) => ({
                id: Date.now() + Math.random(),
                product: item.product,
                opneingQty: item.totalAvalibeleCarton,
                ValueExclGst: parseFloat(item.ValueExclGst).toFixed(4),
                perBox: parseFloat(item.ValueExclGst / item.totalAvalibeleCarton).toFixed(4)

            })),
            Status: "Open"

        }

        const OpeningAccountsData = await AccountOpeningBalanceModal.find({
            DateStart: { $lte: startDate },
            DateEnd: { $gte: startDate }
        });


        const mergedDataVoucher = await VoucherModal.aggregate([
            {
                $match: {
                    VoucherDate: {
                        $gte: DateStart,
                        $lte: DateEnd,
                    },
                },
            },
            { $unwind: "$VoucharData" },

            {
                $group: {
                    _id: {
                        Account: "$VoucharData.Account",
                        PostStatus: "$status",
                        Debit: "$VoucharData.Debit",
                        Credit: "$VoucharData.Credit",
                        Store: "$VoucharData.Store",
                        VoucherNumber: "$VoucherNumber"
                    },
                },
            },

            {
                $project: {
                    _id: 0,
                    Account: "$_id.Account",
                    PostStatus: "$_id.PostStatus",
                    Debit: "$_id.Debit",
                    Credit: "$_id.Credit",
                    Store: "$_id.Store",
                    VoucherNumber: "$_id.VoucherNumber"
                },
            },
        ]);
        const Accounts = await ChartofAccountsModel.find()

        const totalAccounts = mergedDataVoucher.concat(OpeningAccountsData[0].AccountsData)
        const TotalOpeningAccountsData = totalAccounts.map((item) => ({
            AccountCode: Accounts.find((Ac) => Ac._id == item.Account)?.AccountCode,
            Account: item.Account,
            Debit: item.Debit || 0,
            Credit: item.Credit || 0,
            VoucherNumber: item.VoucherNumber
        }))
        console.log(Expenses, Revenue)
        const ExpensesVoucher = TotalOpeningAccountsData.filter((item) => {
            const code = item?.AccountCode?.toString();
            return (
                code?.startsWith(String(Expenses))
            );
        });

        const RevenueVoucher = TotalOpeningAccountsData.filter((item) => {
            const code = item?.AccountCode?.toString();
            return (
                code?.startsWith(String(Revenue))
            );
        });

        // ✅ Merge by AccountId instead of AccountCode

        const ExpensesMerge = Object.values(
            ExpensesVoucher.reduce((acc, curr) => {
                const V = curr.Account; // group by Account

                if (!acc[V]) {
                    acc[V] = {
                        Account: V,
                        Debit: 0,
                        Credit: 0,
                    };
                }

                // accumulate values
                acc[V].Debit += curr.Debit || 0;
                acc[V].Credit += curr.Credit || 0;

                return acc;
            }, {})
        );

        const RevenueMerge = Object.values(
            RevenueVoucher.reduce((acc, curr) => {
                const V = curr.Account; // group by Account

                if (!acc[V]) {
                    acc[V] = {
                        Account: V,
                        Debit: 0,
                        Credit: 0,
                    };
                }

                // accumulate values
                acc[V].Debit += curr.Debit || 0;
                acc[V].Credit += curr.Credit || 0;

                return acc;
            }, {})
        );


        const TotalExpenceAndRevenueAccounts = ExpensesMerge.concat(RevenueMerge)
        const Retainedearnings = TotalExpenceAndRevenueAccounts.reduce(
            (sum, row) => sum + (row.Debit || 0) - (row.Credit || 0),
            0
        );
        const RetainedearningsEntry = {
            Account: RetainedearningsAccount,
            Credit: Retainedearnings > 0 ? Retainedearnings : 0,
            Debit: Retainedearnings < 0 ? Math.abs(Retainedearnings) : 0,
        }
        const Voucher = await VoucherModal.find({VoucherType: "System" }).sort({ _id: -1 }).limit(1)
        console.log("Voucher hai System 2" , Voucher)
        const Entry = {
            VoucherType: "System",
            VoucherNumber: `${generateNextCodeForVoucher(Voucher[0]?.VoucherNumber)}` || "Sys00002",
            VoucherDate: dateEnd,
            status: "Post",
            VoucharData: TotalExpenceAndRevenueAccounts.map((item) => {
                const totalDebit = parseFloat(item.Debit) || 0;
                const totalCredit = parseFloat(item.Credit) || 0;
                const balance = totalDebit - totalCredit;

                return {
                    Account: item.Account,
                    Credit: balance > 0 ? balance : 0,
                    Debit: balance < 0 ? Math.abs(balance) : 0,
                };
            }),
        };
        Entry.VoucharData.push(RetainedearningsEntry)
        const YearlyVoucher = await VoucherModal.create(Entry)
        console.log(newopening)
        await AccountOpeningBalanceModal.findByIdAndUpdate(OpeningAccountsData[0]._id, { Status: "Close" })


        const mergedDataVoucherForOpening = await VoucherModal.aggregate([
            {
                $match: {
                    VoucherDate: {
                        $gte: DateStart,
                        $lte: DateEnd,
                    },
                },
            },
            { $unwind: "$VoucharData" },

            {
                $group: {
                    _id: {
                        Account: "$VoucharData.Account",
                        PostStatus: "$status",
                        Debit: "$VoucharData.Debit",
                        Credit: "$VoucharData.Credit",
                        Store: "$VoucharData.Store",
                        VoucherNumber: "$VoucherNumber"
                    },
                },
            },

            {
                $project: {
                    _id: 0,
                    Account: "$_id.Account",
                    PostStatus: "$_id.PostStatus",
                    Debit: "$_id.Debit",
                    Credit: "$_id.Credit",
                    Store: "$_id.Store",
                    VoucherNumber: "$_id.VoucherNumber"
                },
            },
        ]);

        const totalAccountsForOpening = mergedDataVoucherForOpening.concat(OpeningAccountsData[0].AccountsData)
        const TotalOpeningAccountsDataForOpening = totalAccountsForOpening.map((item) => ({
            AccountCode: Accounts.find((Ac) => Ac._id == item.Account)?.AccountCode,
            Account: item.Account,
            Debit: item.Debit || 0,
            Credit: item.Credit || 0,
            VoucherNumber: item.VoucherNumber
        }))
        const totalAccountsOpening = TotalOpeningAccountsDataForOpening.filter((item) => {
            const code = item?.AccountCode?.toString();
            return (
                code?.startsWith(String(Assets)) ||
                code?.startsWith(String(liabilities)) ||
                code?.startsWith(String(Capital))

            );
        })
        const totalOpening = Object.values(
            totalAccountsOpening.reduce((acc, curr) => {
                const V = curr.Account; // group by Account

                if (!acc[V]) {
                    acc[V] = {
                        Account: V,
                        Debit: 0,
                        Credit: 0,
                    };
                }

                // accumulate values
                acc[V].Debit += Number(curr.Debit) || 0;
                acc[V].Credit += Number(curr.Credit) || 0;

                return acc;
            }, {})
        );
        const totalOpeningmerge = totalOpening.map(({ Account, Debit, Credit }) => {
            const debit = parseFloat(Debit) || 0;
            const credit = parseFloat(Credit) || 0;
            const diff = debit - credit;

            if (diff > 0) {
                return { Account, Debit: Number(diff).toFixed(4), Credit: 0 };
            } else if (diff < 0) {
                return { Account, Debit: 0, Credit: Number(Math.abs(diff)).toFixed(4) };
            } else {
                return { Account, Debit: 0, Credit: 0 };
            }
        });

        await AccountOpeningBalanceModal.create({
            DateStart: openingdate.nextStart,
            DateEnd: openingdate.nextEnd,
            AccountsData: totalOpeningmerge,
            Status: "Open",
            VoucherRef : YearlyVoucher.VoucherNumber

        })
        await OpeningInventoryModal.findByIdAndUpdate(Openinginventory[0]._id, { Status: "Close" })
        const opneing = await OpeningInventoryModal.create(newopening)

        res.status(200).send(opneing)
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }


}


export const GetOnlyYear = async (req, res) => {
    try {
        const inventory = await OpeningInventoryModal.find({}, { DateStart: 1, DateEnd: 1, _id: 0 })
        res.send(inventory)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Something went wrong", error: err });
    }

}

