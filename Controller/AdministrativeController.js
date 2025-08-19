import AdministrativeModal from "../modal/AdministrativeModal.js"

export const updateAdministrative = async (req,res) =>{
    const {id} = req.params
    console.log(req.body)
    try{
        const data = await AdministrativeModal.findByIdAndUpdate(id , req.body)
        res.status(200).send("Data update")
    }catch(err){
        res.status(403).send("Some Thing Went Gone Wrong")
    }
}

export const GetAdministrative = async (req, res) =>{
    const {id} = req.params
    try{
        const data = await AdministrativeModal.findById(id)
        res.status(200).send({ status: true, data: data });

    }catch(err){
        res.status(400).send({ massage: "some thing went gone wrong", err: err });
    }

}