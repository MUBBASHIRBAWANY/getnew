import AccountOpeningBalanceModal from "../modal/AccountsOpeningModal.js";
import VoucherModal from "../modal/VoucherModal.js";


const GernalLager = async (req, res) => {
    const { Account, startDate, endDate, Store } = req.query
    const StoreArray = [...Store?.split(",")];
    const AccountArray = [...Account?.split(",")]
    const firstOpneing = await AccountOpeningBalanceModal.find({
        DateStart: { $lte: startDate },
        DateEnd: { $gte: startDate }
    });
    const nextDate = firstOpneing[0]?.DateStart
    const previosdate = new Date(startDate);
    previosdate.setDate(previosdate.getDate() - 1);
    const before = previosdate.toISOString().split('T')[0];
    try {
        const mergedVOucherData = await VoucherModal.aggregate([
            {
                $match: {
                    VoucherDate: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },

            { $unwind: "$VoucharData" },
            {
                $group: {
                    _id: {
                        Account: "$VoucharData.Account",
                        VoucherNumber: "$VoucherNumber",
                        status: "$status",
                        VoucherDate: "$VoucherDate",
                        Credit: "$VoucharData.Credit",
                        store: "$VoucharData.store",
                        Debit: "$VoucharData.Debit",
                        Type: "Voucher",
                        Chq: "$ChequeNumber"
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    Account: "$_id.Account",
                    VoucherNumber: "$_id.VoucherNumber",
                    status: "$_id.status",
                    VoucherDate: "$_id.VoucherDate",
                    Credit: "$_id.Credit",
                    Debit: "$_id.Debit",
                    Type: "Voucher",
                    store: { $ifNull: ["$_id.store", "0"] },
                    Chq: "$_id.Chq"
                },
            },
        ]);

        const mergedVOucherDataBefore = await VoucherModal.aggregate([
            {
                $match: {
                    VoucherDate: {
                        $gte: nextDate,
                        $lte: before,
                    },
                },
            },

            { $unwind: "$VoucharData" },
            {
                $group: {
                    _id: {
                        Account: "$VoucharData.Account",
                        VoucherNumber: "$VoucherNumber",
                        status: "$PostStatus",
                        VoucherDate: "$VoucherDate",
                        Credit: "$VoucharData.Credit",
                        store: "$VoucharData.store",
                        Debit: "$VoucharData.Debit",
                        Type: "Voucher Before"

                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    Account: "$_id.Account",
                    VoucherNumber: "$_id.VoucherNumber",
                    status: "$_id.status",
                    VoucherDate: "$_id.VoucherDate",
                    Credit: "$_id.Credit",
                    Debit: "$_id.Debit",
                    Type: "VoucherBefore",
                    store: { $ifNull: ["$_id.store", "0"] },
                },
            },
        ]);
        const data = mergedVOucherData.concat(mergedVOucherDataBefore)
        if (Account || Store) {
            const wholedata = data.filter((item) => {
                const AccountMatch = AccountArray.includes(item?.Account)
                const storeMatch = StoreArray.includes(item?.store);
                console.log(storeMatch)
                return AccountMatch && storeMatch;
            });

            console.log(wholedata)
            res.json(wholedata);
        }
        else {
            res.status(200).send(data)
        }
    } catch (err) {
        console.log(err)

        res.status(500).send("Some thing went wrong", err)
    }

}


export default GernalLager