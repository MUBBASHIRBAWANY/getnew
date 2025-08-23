import CustomerChqRecivedModal from "../modal/CustomerChqRecivedModal";
import SalesInvoiceModal from "../modal/SalesInvoiceModal";

export const CustomerChq = async (req, res) => {
    const { Date, ChqRecivedData, Status} = req.body;

    try {
        const CustomerChq = new CustomerChqRecivedModal({
            Date,
            ChqRecivedData,
            Status
        });

        await CustomerChq.save();
        res.status(201).json({ message: "Cheque Book created successfully", data: CustomerChq });
    } catch (error) {
        res.status(500).json({ message: "Error creating cheque book", error: error.message });
    }
}


export const getCustomerChq = async (req, res) => {
    try {
        const CustomerChq = await CustomerChqRecivedModal.find();
        res.status(200).json({ data: CustomerChq });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cheque books", error: error.message });
    }
}

export const getLastChqRef = async (req, res) => {
    try {
        const data = await CustomerChqRecivedModal.find().sort({ _id: -1 }).limit(1)
        res.status(200).json({ data: data });

    } catch (err) {
        res.status(500).json({ message: "Error fetching cheque books", error: err });

    }
}


export const updateCustomerChq = async (res, req)=>{
    const {id} = req.params
    try{
        const data = await CustomerChqRecivedModal.findByIdAndUpdate(id , req.Body)
        res.status(200).send({data : data, Status : true })

    }catch(err){
        res.status(500).json({ message: "Some Thing Went Wrong", error: err });

    }
}



export const upDateCustomerChqStatus = async (req,res) =>{
        console.log(req.body)
        const { chqNumber, Status  , invoiceData} = req.body;
        const { id } = req.params;
        console.log(chqNumber)
        try {
            const chqBook = await CustomerChqRecivedModal.findById(id);

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
            const avalibleChq = await CustomerChqRecivedModal.findById(id);
            
            const findchq = avalibleChq.Cheuques[0].filter((item) => item.status == 'Pending')
            console.log(findchq.length)
            if (findchq.length == 0) {
                console.log(findchq.length)
                await CustomerChqRecivedModal.findByIdAndUpdate(id, {
                    Status: "All Chq Finished"
                });
                res.status(200).json({ message: "Cheque(s) status updated", data: chqBook });

            }
            else {

                res.status(200).json({ message: "Cheque(s) status updated", data: chqBook });
            }

        } catch (error) {
            res.status(500).json({ message: "Error updating cheque status", error: error.message });
        }
}