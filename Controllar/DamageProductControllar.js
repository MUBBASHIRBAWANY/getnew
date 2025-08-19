import DamageProductModal from '../modal/DamageProductModal.js'




export const getAllDamageProductQty = async (req,res) => {
    try {
        const data = await DamageProductModal.find()
         res.status(200).send({ status: true, data: data });

    } catch(err) {
        console.log(err)
    }
}

export const getOneDamageProduct = async (req,res) => {
    const {id} = req.body
    try {
        const data = await DamageProductModal.find({_id : id})
         res.status(200).send({ status: true, data: data });
    } catch(err) {
        console.log(err)
    }
}