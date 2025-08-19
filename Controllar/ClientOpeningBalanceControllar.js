import ClientOpeningBalanceModal from "../modal/ClientOpeningBalanceModal.js";


export const CreateClientOpeningBalance = async (req , res) =>{
    try {
        const { DateStart, DateEnd, ClientData, status } = req.body;
        

        if (!DateStart || !DateEnd || !Array.isArray(ClientData)) {
            return res.status(400).send("Missing DateStart, DateEnd or ClientData");
        }

        const existingRecord = await ClientOpeningBalanceModal.findOne({ DateStart, DateEnd });

        if (existingRecord) {
            existingRecord.ClientData = existingRecord.ClientData.concat(ClientData);
            await existingRecord.save();
            return res.status(200).send("Inventory updated on existing date record.");
        } else {
            await ClientOpeningBalanceModal.create(req.body);
            return res.status(200).send("New inventory record created.");
        }
    } catch (err) {
        console.error("Error in createOpennigBalance:", err);
        return res.status(500).send("Something went wrong.");
    }
}

export const getAllClientOpeningBalance = async (req , res) =>{
    try{
         const data = await ClientOpeningBalanceModal.find()
        res.status(200).send({status : 200 , data : data})
    }catch(err){
        console.error("Error in createOpennigBalance:", err);
        return res.status(500).send("Something went wrong.");
    }
}

export const deleteOpeningBalance = async (req , res) =>{
    try{
        const {id} = req.params
         const data = await ClientOpeningBalanceModal.findByIdAndDelete(id)
        res.status(200).send({status : 200 , data : data})
    }catch(err){
        console.error("Error in createOpennigBalance:", err);
        return res.status(500).send("Something went wrong.");
    }
}

export const EditOpeningBalance = async (req , res) =>{
    try{
        const {id} = req.params
         const data = await ClientOpeningBalanceModal.findByIdAndUpdate(id, req.body)
        res.status(200).send({status : 200 , data : data})
    }catch(err){
        console.error("Error in createOpennigBalance:", err);
        return res.status(500).send("Something went wrong.");
    }
}
