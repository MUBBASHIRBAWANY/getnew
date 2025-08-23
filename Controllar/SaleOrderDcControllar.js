import SaleOrderDcModal from "../modal/SaleOrderDcModal.js"
import SaleOrderModal from "../modal/SaleOrderModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";
import VoucherModal from "../modal/VoucherModal.js";
import mongoose from "mongoose";


export const CreateSaleOrderDC = async (req, res) => {
    const { DcData, Store, Location } = req.body
    try {
        const stockChecks = await Promise.all(
            DcData.map(async item => {
                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Location: Location,
                    Store: Store
                });
                return { product, item };
            })
        );

        const errors = stockChecks.filter(({ product, item }) =>
            !product || product.TotalQuantity < (item.Delivered || 0)
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
                            required: item.Delivered
                        }
                )
            });
        }
        else {
            const data = await SaleOrderDcModal.create(req.body)
            res.status(200).send(data)
        }

    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}



export const UpdateSaleOrderDC = async (req, res) => {
    const { DcData, Location, Store } = req.body
    const { id } = req.params

    try {
        const stockChecks = await Promise.all(
            DcData.map(async item => {
                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Location: Location,
                    Store: Store
                });
                return { product, item };
            })
        );

        const errors = stockChecks.filter(({ product, item }) =>
            !product || product.TotalQuantity < (item.Delivered || 0)
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
                            required: item.Delivered
                        }
                )
            });
        }
        else {
            const data = await SaleOrderDcModal.findByIdAndUpdate(id, req.body)
            res.send({ status: true, data: data });
        }
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}

export const GetAllSaleOrderDC = async (req, res) => {
    try {
        const data = await SaleOrderDcModal.find()
        res.send({ status: true, data: data });

    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}


export const LastSaleOrderDC = async (req, res) => {
    try {
        const data = await SaleOrderDcModal.find().sort({ _id: -1 }).limit(1)
        res.send({ status: true, data: data });
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}

export const DeleteSaleOrderDC = async (req, res) => {
    const { id } = req.params
    try {
        const data = await SaleOrderDcModal.findByIdAndDelete(id)
        res.status(200).send("data Delete")
    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong", err)
    }
}


export const updateOrderStatusDC = async (req, res) => {
    const { Store, CostAccount, ProductData, FinshedAccount, Location, status, DcNum, Date, data, id, } = req.body

    try {

        const AccountValue = data.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0)
        console.log(AccountValue)
        const OrderDC = await SaleOrderDcModal.find({ _id: { $in: id } });
        const stockChecks = await Promise.all(
            ProductData.map(async (item) => {

                const product = await TotalProductModal.findOne({
                    ProductName: item.product,
                    Store: item.Store,
                    Location: item.Location
                });
                return { product, item };
            })
        );
        console.log(stockChecks, "stockChecks ye hai")

        if (status === true) {
            const insufficient = stockChecks.filter(({ product, item }) => {
                return !product || (product.TotalQuantity || 0) < (item.Delivered || 0);
            });



            if (insufficient.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for OrderDC ${OrderDC._id}`,
                    errors: insufficient.map(({ product, item }) =>
                        !product || product == null
                            ? { productId: item.product, message: "Product not found" }
                            : {
                                product: product.ProductName,
                                available: product.TotalQuantity,
                                tryingToSell: item.Delivered

                            }
                    )
                });
            }

            const bulkOps = stockChecks.map((item) => {

                const avgRate = item?.product?.AvgRate || 0;
                const calculatedAmount = (item.Delivered || 0) * avgRate;


                return {
                    updateOne: {
                        filter: {
                            ProductName: item.product?.ProductName,
                            Location,
                            Store,
                            TotalQuantity: { $gte: item.item.Delivered }
                        },
                        update: {
                            $inc: {
                                TotalQuantity: -Number(item.item.Delivered) || 0,
                                Amount: -calculatedAmount
                            }
                        }
                    }
                };
            });

            await TotalProductModal.bulkWrite(bulkOps);
            OrderDC.Status = true;
            await SaleOrderDcModal.findByIdAndUpdate(id, { Status: "true" })
            const totalAmount = data.reduce((sum, item) => {
                return sum + parseFloat(item.netAmunt || 0);
            }, 0);

            const AccountsData = [
                {
                    VoucherType: "Dc",
                    VoucherNumber: `Dc${DcNum}`,
                    status: "Post",
                    VoucherDate: Date,
                    VoucharData: [
                        {
                            Account: CostAccount,
                            Debit: AccountValue,
                            store: Store
                        },
                        {
                            Account: FinshedAccount,
                            Credit: AccountValue,
                            store: Store
                        }
                    ]
                }
            ];
            await VoucherModal.create(AccountsData)

            for (const item of ProductData) {
                const { Order, product, Delivered } = item;

                // Step 1: Fetch order containing the product
                const orderDoc = await SaleOrderModal.findOne({
                    SaleOrderNumber: Order,
                    "SaleOrderData.product": product
                });

                if (!orderDoc) continue;

                const productEntry = orderDoc.SaleOrderData.find(p => p.product == product);
                const remaining = Number(productEntry?.Remaingcarton || 0);
                const toDeliver = Number(Delivered);
                const newRemaining = remaining - toDeliver;
                if (!isNaN(newRemaining)) {
                    await SaleOrderModal.updateOne(
                        {
                            SaleOrderNumber: Order,
                        },
                        {
                            $set: {
                                "SaleOrderData.$[elem].Remaingcarton": newRemaining
                            }
                        },
                        {
                            arrayFilters: [{ "elem.product": product }]
                        }
                    );

                    console.log(`Updated ${Order} - ${product}: ${remaining} - ${toDeliver} = ${newRemaining}`);
                }
            }
            const updatedOrders = ProductData.map((item) => item.Order)
            // Step 3: Check if all product of the order are fully delivered (Remaingcarton === 0)
            for (const orderNumber of updatedOrders) {
                const order = await SaleOrderModal.findOne({ SaleOrderNumber: orderNumber });

                const isComplete = order.SaleOrderData.every(p => Number(p.Remaingcarton) === 0);

                if (isComplete) {
                    await SaleOrderModal.updateOne(
                        { SaleOrderNumber: orderNumber },
                        { $set: { Status: "Complete" } }
                    );
                }
            }
            res.status(200).send("Status Updated")
        }


        else if (status === false) {
            // UNPOST logic: restore stock
            const allOps = [];

            for (const { product, item } of stockChecks) {
                const avgRate = product?.AvgRate || 0;
                const amount = (item.Delivered || 0) * avgRate;

                allOps.push({
                    updateOne: {
                        filter: {
                            ProductName: item.product,
                            Store,
                            Location
                        },
                        update: {
                            $inc: {
                                TotalQuantity: Number(item.Delivered) || 0,
                                Amount: amount
                            },
                            $setOnInsert: {
                                ProductName: item.product,
                                Store,
                                Location
                            }
                        },
                        upsert: true
                    }
                });
            }

            // ✅ Run bulk update
            await TotalProductModal.bulkWrite(allOps);

            // ✅ Revert DC status
            OrderDC.Status = false;
            await SaleOrderDcModal.findByIdAndUpdate(id, { Status: false }); // use boolean not string
            await VoucherModal.deleteOne({ VoucherNumber: `Dc${DcNum}` });
            for (const item of ProductData) {
                const { Order, product, Delivered } = item;

                const orderDoc = await SaleOrderModal.findOne({
                    SaleOrderNumber: Order,
                    "SaleOrderData.product": product
                });

                if (!orderDoc) continue;

                const productEntry = orderDoc.SaleOrderData.find(p => p.product == product);
                const remaining = Number(productEntry?.Remaingcarton || 0);
                const toDeliver = Number(Delivered);
                const newRemaining = remaining + toDeliver;

                if (!isNaN(newRemaining)) {
                    await SaleOrderModal.updateOne(
                        {
                            SaleOrderNumber: Order,
                        },
                        {
                            $set: {
                                "SaleOrderData.$[elem].Remaingcarton": newRemaining
                            }
                        },
                        {
                            arrayFilters: [{ "elem.product": product }]
                        }
                    );

                    console.log(`Updated ${Order} - ${product}: ${remaining} + ${toDeliver} = ${newRemaining}`);
                }
            }

            const updatedOrders = ProductData.map((item) => item.Order)

            for (const orderNumber of updatedOrders) {
                const order = await SaleOrderModal.findOne({ SaleOrderNumber: orderNumber });

                const isComplete = order.Status === "Complete"

                if (isComplete) {
                    await SaleOrderModal.updateOne(
                        { SaleOrderNumber: orderNumber },
                        { $set: { Status: "false" } }
                    );
                }
            }
            res.status(200).send("Status Updated")
        }



    }
    catch (err) {
        res.status(400).send(err)
    }
}


export const OnlyTrue = async (req, res) => {
    try {
        const data = await SaleOrderDcModal.find({ Status: true })

        res.status(200).send({ status: true, data: data })

    } catch (err) {
        res.status(400).send(err)

    }
}