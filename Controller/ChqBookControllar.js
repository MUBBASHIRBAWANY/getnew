import ChqBookModal from "../modal/ChqBookModal.js";

export const createChqBook = async (req, res) => {
    const { Bank, Prefix, CheuquesStart, CheuquesEnd, Status } = req.body;

    try {
        const newChqBook = new ChqBookModal({
            Bank,
            CheuquesStart,
            CheuquesEnd,
            Prefix,
            Status
        });

        await newChqBook.save();
        res.status(201).json({ message: "Cheque Book created successfully", data: newChqBook });
    } catch (error) {
        res.status(500).json({ message: "Error creating cheque book", error: error.message });
    }
}

export const getChqBooks = async (req, res) => {
    try {
        const chqBooks = await ChqBookModal.find();
        res.status(200).json({ data: chqBooks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cheque books", error: error.message });
    }
}

export const getLastChqBook = async (req, res) => {

    const { bank } = req.params
    console.log(bank)
    try {
        const data = await ChqBookModal.find(({ Bank: bank })).sort({ _id: -1 }).limit(1)
        res.status(200).json({ data: data });

    } catch (err) {
        res.status(500).json({ message: "Error fetching cheque books", error: err });

    }
}
export const createChq = async (req, res) => {
    const { Cheuques, Status } = req.body;
    const { id } = req.params;
    try {
        const chq = await ChqBookModal.findById(id)
        if (chq.Status === "Chq Book Create") {
            res.status(401).send("Chq Book All ready Created")
        }
        const chqBook = await ChqBookModal.findByIdAndUpdate(id, {
            $push: { Cheuques: Cheuques },
            Status: Status
        }, { new: true });
        res.status(200).json({ message: "Cheque(s) added successfully", data: chqBook });
        if (!chqBook) {
            return res.status(404).json({ message: "Cheque book not found" });
        }


    } catch (error) {
        res.status(500).json({ message: "Error adding cheque(s)", error: error.message });
    }
}


export const updateChqBook = async (req, res) => {
    const { id } = req.params;
    const { Bank, Prefix, CheuquesStart, CheuquesEnd, Status } = req.body;

    try {
        const updatedChqBook = await ChqBookModal.findByIdAndUpdate(id, {
            Bank,
            CheuquesStart,
            CheuquesEnd,
            Prefix,
            Status
        }, { new: true });
        if (!updatedChqBook) {
            return res.status(404).json({ message: "Cheque book not found" });
        }
        res.status(200).json({ message: "Cheque book updated successfully", data: updatedChqBook });
    } catch (error) {
        res.status(500).json({ message: "Error updating cheque book", error: error.message });
    }
}

export const deleteChqBook = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedChqBook = await ChqBookModal.findByIdAndDelete(id);
        if (!deletedChqBook) {
            return res.status(404).json({ message: "Cheque book not found" });
        }
        res.status(200).json({ message: "Cheque book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting cheque book", error: error.message });
    }
}

export const updateChequeStatus = async (req, res) => {
        console.log(req.body)
        const { chqNumber, Status } = req.body;
        const { id } = req.params;
        console.log(chqNumber)
        try {
            const chqBook = await ChqBookModal.findById(id);

            if (!chqBook) {
                return res.status(404).json({ message: "Cheque book not found" });
            }

            let updated = false;

            // Since Cheuques is a 2D array
            chqBook.Cheuques = chqBook.Cheuques.map(subArray =>
                subArray.map(cheque => {
                    if (Array.isArray(chqNumber) && chqNumber.includes(cheque.chq)) {
                        updated = true;
                        return { ...cheque, status: Status };
                    }
                    return cheque;
                })
            );

            if (!updated) {
                return res.status(404).json({ message: "No matching cheques found" });
            }

            await chqBook.save();
            const avalibleChq = await ChqBookModal.findById(id);
            console.log(avalibleChq.Cheuques)
            const findchq = avalibleChq.Cheuques[0].filter((item) => item.status == 'unUsed')
            console.log(findchq.length)
            if (findchq.length == 0) {
                console.log(findchq.length)
                await ChqBookModal.findByIdAndUpdate(id, {
                    Status: "Chq Book Closed"
                });
                res.status(200).json({ message: "Cheque(s) status updated", data: chqBook });

            }
            else {

                res.status(200).json({ message: "Cheque(s) status updated", data: chqBook });
            }

        } catch (error) {
            res.status(500).json({ message: "Error updating cheque status", error: error.message });
        }
};



export const getOnlyOpenChqBook = async (req, res) => {
    try {
        const data = await ChqBookModal.find({ Status: "Chq Book Create" })
        res.status(200).json({ message: "All Open chq", data: data });
    } catch (error) {
        res.status(500).json({ message: "Error updating cheque status", error: error.message });

    }
}