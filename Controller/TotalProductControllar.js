import TotalProductModal from "../modal/TotalProductModal.js"


export const getAllProductQty = async (req,res) => {
    try {
        const data = await TotalProductModal.find()
         res.status(200).send({ status: true, data: data });

    } catch(err) {
        console.log(err)
    }
}

export const getOneProduct = async (req,res) => {
    const {id} = req.body
    try {
        const data = await TotalProductModal.find({_id : id})
         res.status(200).send({ status: true, data: data });
    } catch(err) {
        console.log(err)
    }
}