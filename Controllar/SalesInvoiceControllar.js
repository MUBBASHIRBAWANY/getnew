
import SalesInvoiceModal from "../modal/SalesInvoiceModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";
import OpeningInventoryModal from "../modal/OpeningInventoryModal.js"
import SaleOrderDcModal from "../modal/SaleOrderDcModal.js";
import VoucherModal from "../modal/VoucherModal.js";


export const createSalesInvoice = async (req, res) => {
    const { Client, SaleInvoiceData, SaleInvoiceDate, SalesFlowRef, Store, Location, RemainingAmount, TotalAmount, DcNumber, LessAccount, AddAccount, LessAmount, AddAmount } = req.body

    console.log(LessAccount,
        AddAccount,
        LessAmount,
        AddAmount, "Less Account")
    try {
        const code = await SalesInvoiceModal.findOne().sort({ _id: -1 }).limit(1)
        console.log(code)
        let nextCode
        if (code == null) {
            const nextNumber = parseInt("000000", 10) + 1;
            nextCode = nextNumber.toString().padStart(6, '0')
        }
        else {
            const nextNumber = parseInt(code.SalesInvoice, 10) + 1;
            console.log(nextNumber)
            nextCode = nextNumber.toString().padStart(6, '0')
        }
        const stockChecks = await Promise.all(
            SaleInvoiceData.map(async item => {
                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Location: Location,
                    Store: Store
                });
                return { product, item };
            })
        );

        const errors = stockChecks.filter(({ product, item }) =>
            !product || product.TotalQuantity < (item.totalBox || 0)
        );

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: errors.map(({ product, item }) =>
                    !product
                        ? [`${item.product}`]
                        : {
                            product: product.ProductName,
                            qty: product.TotalQuantity,
                            required: item.totalBox
                        }
                )
            });
        }
        else {
            const invoicePayload = {
                SalesInvoice: nextCode,
                SalesData: SaleInvoiceData,
                Client,
                SalesInvoiceDate: SaleInvoiceDate,
                SalesFlowRef,
                PostStatus: false,
                Store,
                Location,
                RemainingAmount,
                TotalAmount,
                DcNumber,
            };

            if (LessAccount) {
                invoicePayload.LessAccount = LessAccount;
                invoicePayload.LessAmount = LessAmount;
            }

            if (AddAccount) {
                invoicePayload.AddAccount = AddAccount;
                invoicePayload.AddAmount = AddAmount;
            }

            const data = await SalesInvoiceModal.create(invoicePayload);
            await SaleOrderDcModal.findOneAndUpdate({ DcNumber: DcNumber }, { Status: "Serviced" })

            res.status(200).send(data)
        }

    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}

export const getAllSaleInvoice = async (req, res) => {
    try {
        const data = await SalesInvoiceModal.find()
            .sort({ SalesInvoice: -1 })
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }

}
export const getLimitedSaleInvoice = async (req, res) => {
    try {
        const data = await SalesInvoiceModal.find().sort({ _id: -1 }).limit(500)
            .sort({ SalesInvoice: -1 })
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }

}

export const UpdateSalesInvoice = async (req, res) => {
    const { id } = req.params
    const { Client, SaleInvoiceData, SaleInvoiceDate, SalesFlowRef, LessAccount, AddAccount, LessAmount, AddAmount } = req.body
    try {
        const stockChecks = await Promise.all(
            SaleInvoiceData.map(async item => {
                const product = await TotalProductModal.findOne({ ProductName: item.product });
                return { product, item };
            })
        );

        const errors = stockChecks.filter(({ product, item }) =>
            !product || product.TotalQuantity < (item.totalBox || 0)
        );

        console.log(errors)
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors: errors.map(({ product, item }) =>
                    !product
                        ? `${item.product}`
                        : [{
                            product: `${product.ProductName}`,
                            qty: `${product.TotalQuantity}`,
                            Req: `${item.totalBox}`
                        }]


                )
            });
        }
        else {
            const data = await SalesInvoiceModal.findByIdAndUpdate(id, {
                SalesData: SaleInvoiceData,
                Client,
                SalesInvoiceDate: SaleInvoiceDate,
                SalesFlowRef,
                PostStatus: false,
                LessAccount,
                AddAccount,
                LessAmount,
                AddAmount
            })
            res.status(200).send(data)
        }

    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}


export const deleteSaleInvoice = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const findTrue = await SalesInvoiceModal.find({ _id: id })
        console.log(findTrue)
        if (findTrue[0].PostStatus == true) {
            return res.status(400).send("invoice Posted");
        }
        else {
            const data = await SalesInvoiceModal.findByIdAndDelete(id)
            await SaleOrderDcModal.findOneAndUpdate({ DcNumber: findTrue[0].DcNumber }, { Status: "true" })
            res.status(200).send("invoice Delete");
        }


        // res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const postSalesinvoice = async (req, res) => {
    const { status, AccountsData, VoucherNumber } = req.body;
    const { id } = req.params;
    console.log(status, VoucherNumber)

    try {
        if (status === true) {
            const checkPost = await SalesInvoiceModal.findById(id);
            if (checkPost.PostStatus === true) {
                console.log(checkPost.PostStatus)
                return res.status(400).json({
                    success: false,
                    message: "Invoice already posted"
                });
            }

            await SalesInvoiceModal.findByIdAndUpdate(id, { PostStatus: true });
            await VoucherModal.create(AccountsData[0])
            return res.status(200).json({
                success: true,
                message: "Invoice posted, stock reduced, and amount updated"
            });

        } else {
            const checkPost = await SalesInvoiceModal.findById(id);
            if (checkPost?.PostStatus === false) {
                return res.status(400).json({
                    success: false,
                    message: "Invoice already Unposted"
                });
            }
            await SalesInvoiceModal.findByIdAndUpdate(id, { PostStatus: false });
            const voucher = await VoucherModal.find({ VoucherNumber: VoucherNumber })
            console.log(voucher)
            if (voucher) {
                await VoucherModal.findByIdAndDelete(voucher[0]._id)
            }
            return res.status(200).json({
                success: true,
                message: "Invoice unposted, stock and amount restored"
            });
        }
    } catch (error) {
        console.error("Error in postSalesinvoice:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the sales invoice"
        });
    }
};

export const BulkpostSalesinvoice = async (req, res) => {
    const { status, ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Missing or invalid invoice IDs"
        });
    }

    try {
        const invoices = await SalesInvoiceModal.find({ _id: { $in: ids } });

        if (invoices.length !== ids.length) {
            const foundIds = invoices.map(inv => inv._id.toString());
            const missing = ids.filter(id => !foundIds.includes(id));
            return res.status(404).json({
                success: false,
                message: "Some invoices not found",
                missing
            });
        }

        const allOps = [];

        for (const invoice of invoices) {
            const { SalesData, Store, Location, PostStatus } = invoice;

            if (!Array.isArray(SalesData) || SalesData.length === 0) continue;

            if (status === true && PostStatus === true) continue;
            if (status === false && PostStatus === false) continue;

            const stockChecks = await Promise.all(
                SalesData.map(async (item) => {
                    console.log("product of item", item)
                    const product = await TotalProductModal.findOne({
                        ProductName: item.product,
                        Store,
                        Location
                    });
                    return { product, item };
                })
            );


            if (status === true) {
                const insufficient = stockChecks.filter(({ product, item }) => {
                    !product || (product.TotalQuantity || 0) < (item.totalBox || 0)
                }
                );


                if (insufficient.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient stock for invoice ${invoice._id}`,
                        errors: insufficient.map(({ product, item }) =>
                            !product || product == null
                                ? { productId: item.product, message: "Product not found" }
                                : {
                                    product: product.ProductName,
                                    available: product.TotalQuantity,
                                    tryingToSell: item.totalBox
                                }
                        )
                    });
                }

                const bulkOps = stockChecks.map((item) => {
                    console.log(item?.product?.AvgRate, item.item.totalBox, Location,
                        Store,
                        item.product?.ProductName
                    )
                    const avgRate = item?.product?.AvgRate || 0;
                    const calculatedAmount = (item.item.totalBox || 0) * avgRate;
                    console.log(item.item.totalBox, item.product?.ProductName, item?.product?.AvgRate, Location, Store)

                    return {
                        updateOne: {
                            filter: {
                                ProductName: item.product?.ProductName,
                                Location,
                                Store,
                                TotalQuantity: { $gte: item.item.totalBox }
                            },
                            update: {
                                $inc: {
                                    TotalQuantity: -Number(item.item.totalBox) || 0,
                                    Amount: -calculatedAmount
                                }
                            }
                        }
                    };
                });

                await TotalProductModal.bulkWrite(bulkOps);
                invoice.PostStatus = true;
                await invoice.save();





            } else {
                // UNPOST logic: restore stock
                for (const { product, item } of stockChecks) {
                    const avgRate = product?.AvgRate || 0;
                    const amount = (item.totalBox || 0) * avgRate;

                    allOps.push({
                        updateOne: {
                            filter: {
                                _id: item.product,
                                Store,
                                Location
                            },
                            update: {
                                $inc: {
                                    TotalQuantity: Number(item.totalBox) || 0,
                                    Amount: amount
                                },
                                $setOnInsert: {
                                    _id: item.product,
                                    Store,
                                    Location
                                }
                            },
                            upsert: true
                        }
                    });
                }

                invoice.PostStatus = false;
                await invoice.save();
            }
        }

        if (allOps.length > 0) {
            await TotalProductModal.bulkWrite(allOps);
        }

        return res.status(200).json({
            success: true,
            message: `Invoices ${status ? 'posted' : 'unposted'} and stock updated`
        });

    } catch (error) {
        console.error("Error in postSalesinvoice:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing the sales invoices"
        });
    }
};



export const createSalesInvoiceBulk = async (req, res) => {
    const { invoices } = req.body;
    console.log(invoices)
    try {
        const lastInvoice = await SalesInvoiceModal.findOne().sort({ _id: -1 });
        let nextNumber = lastInvoice ? parseInt(lastInvoice.SalesInvoice, 10) + 1 : 1;
        const invoicePromises = invoices.map(async (invoice) => {
            const code = nextNumber.toString().padStart(6, '0');
            nextNumber++;
            return {
                SalesInvoice: code,
                SalesData: invoice.SalesData,
                Client: invoice.Client,
                SalesInvoiceDate: invoice.SalesInvoiceDate,
                SalesFlowRef: invoice.SalesFlowRef,
                PostStatus: false,
                Store: invoice.Store,
                Location: invoice.Location,
                OrderBooker: invoice.OrderBooker
            };
        });

        // Process all invoices
        const results = await Promise.allSettled(invoicePromises);

        // Handle errors
        const failedInvoices = results.filter(r => r.status === 'rejected');
        if (failedInvoices.length > 0) {
            return res.status(400).json({
                success: false,
                errors: failedInvoices.map(f => ({
                    code: f.reason.code,
                    issues: f.reason.errors
                }))
            });
        }

        // Insert successful invoices
        const validInvoices = results.map(r => r.value);
        const created = await SalesInvoiceModal.insertMany(validInvoices);

        res.status(200).json({
            success: true,
            data: created,
            message: `${created.length} invoice(s) created successfully`
        });

    } catch (err) {
        console.error('Bulk invoice error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to process bulk invoices',
            error: err.message
        });
    }
};


// Get all sales invoices where Amount is 0 (remaining amount is 0)
export const getOnlyRemain = async (req, res) => {
    console.log("first")
    try {
        //
        const data = await SalesInvoiceModal.find({ RemainingAmount: { $ne: 0, $exists: true } })
        console.log(data)
        res.status(200).send({ status: true, data });
    } catch (err) {
        res.status(400).send("some thing went wrong");
    }
};

export const getInvoiceByClient = async (req , res) => {
    const {Client} = req.params
    try {
        const data = await SalesInvoiceModal.find({Client : Client , RemainingAmount: { $ne: 0, $exists: true } , PostStatus : true})
        console.log(data)
        res.status(200).send({ status: true, data });
    } catch (err) {
        res.status(400).send("some thing went wrong");
    }
}