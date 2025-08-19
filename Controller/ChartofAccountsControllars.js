import ChartofAccountsModal from "../modal/ChartofAccountsModal.js"

export const CreateChartofAccounts = async (req, res) => {
    try {
        const { AccountCode, AccountName, Stage, Stage1, Stage2, Stage3, Type, masterCode } = req.body

        let code;
        if (Stage == "4") {
            const LastChartofAccountsCode = await ChartofAccountsModal.findOne({ masterCode: masterCode }).sort({ _id: -1 }).limit(1)
            if (!LastChartofAccountsCode) {
                const code1 = "001";
                code = masterCode + code1
            } else {
                const nextNumber = parseInt(LastChartofAccountsCode.AccountCode, 10) + 1;
                code = nextNumber.toString().padStart(3, '0');
                if (code == "999") {
                    return res.status(400).send("All ready 999 is open")
                }

            }

            const data = {
                AccountCode: code,
                AccountName,
                Stage,
                Stage1,
                Stage2,
                Stage3,
                Type,
                masterCode,
            }
            const sendRes = await ChartofAccountsModal.create(data)

            res.status(200).json({
                message: "Account created",
                data: sendRes
            });
        }

        else if (Stage == "2" || Stage == "3") {
            console.log("Stage ye hai", Stage)

            console.log(Stage)
            const LastChartofAccountsCode = await ChartofAccountsModal.findOne({ masterCode: masterCode }).sort({ _id: -1 }).limit(1)
            if (!LastChartofAccountsCode) {
                const code1 = "01";
                code = masterCode + code1
            } else {
                const nextNumber = parseInt(LastChartofAccountsCode.AccountCode, 10) + 1;
                code = nextNumber.toString().padStart(2, '0');
                if (code == "99") {
                    return res.status(400).send("All ready 999 is open")
                }
            }

            const data = {
                AccountCode: code,
                AccountName,
                Stage,
                Stage1,
                Stage2,
                Type,
                masterCode,
                ...(Stage === 3 && { Stage3 })
            }
            const sendRes = await ChartofAccountsModal.create(data)

            res.status(200).json({
                message: "Account created",
                data: sendRes
            });

        }
        else if (Stage == "1") {


            const LastChartofAccountsCode = await ChartofAccountsModal.findOne({ Stage: "1" }).sort({ _id: -1 }).limit(1)
            if (!LastChartofAccountsCode) {
                code = "1";
            } else {
                const nextNumber = parseInt(LastChartofAccountsCode.AccountCode, 10) + 1;
                code = nextNumber.toString().padStart(1, '0');
                if (code == "10") {
                    return res.status(400).send("All ready 9 is open")
                }

            }

            const data = {
                AccountCode: code,
                AccountName,
                Stage,
                Stage1,
            }
            console.log(data)
            const sendRes = await ChartofAccountsModal.create(data)
            res.status(200).send("data Add")
        }

    }
    catch (err) {
        console.log(err)
        res.status(400).send("some thing went wrong")
    }
}


export const updateChartofAccounts = async (req, res) => {
    const { id } = req.params
    const { AccountName } = req.body
    try {
        const data = await ChartofAccountsModal.findByIdAndUpdate(id, {
            AccountName: AccountName
        })
        res.status(200).send("Data Edit")
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getAllChartofAccounts = async (req, res) => {
    try {
        const data = await ChartofAccountsModal.find()
        res.status(200).send({ status: true, data: data });
    } catch (err) {
        res.status(400).send("some thing went wrong")

    }
}
export const deleteChartofAccounts = async (req, res) => {
    const { id } = req.params
    try {
        const data = await ChartofAccountsModal.findByIdAndDelete(id)
        res.status(200).send({ status: true, data: data });
    }
    catch (err) {
        res.status(400).send("some thing went wrong")
    }
}

export const getONlyStage4 = async (req, res) => {
    try {
        const data = await ChartofAccountsModal.find({ Stage: "4" })
        res.status(200).send({ status: true, data: data });

    } catch (err) {
        res.status(400).send("some thing went wrong", { err: err })

    }
}