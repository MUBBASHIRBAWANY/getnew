  
import DepatmentModal from "../modal/DepartmentModal.js"

export const getAllDep = async (req, res) =>{
    try{

    const depar= await DepatmentModal.find({})
    console.log(depar)
    res.status(200).json(depar);

    }catch(e){
        console.log(e);
        res.status(500).send('Server Error');
    }
}
export const createDep = async (req, res) =>{
    const {DepatmentName} = req.body;
    console.log(DepatmentName)
    try{
        const newDep = new DepatmentModal({DepatmentName});
        await newDep.save();
        res.status(201).json(newDep);
    }catch(e){
        console.log(e);
        res.status(500).send('Server Error');
    }
}

export const updateDep = async (req, res) =>{
    const {id} = req.params;
    const {DepatmentName} = req.body;
    try{
        const dep = await DepatmentModal.findByIdAndUpdate(id, {DepatmentName}, {new: true});
        if (!dep) {
            return res.status(404).send("Department not found");
        }
        res.json(dep);
    }catch(e){
        console.log(e);
        res.status(500).send('Server Error');
    }
}

export const deleteDep = async (req, res) =>{
    const {id} = req.params;
    try{
        const dep = await DepatmentModal.findByIdAndDelete(id);
        if (!dep) {
            return res.status(404).send("Department not found");
        }
        res.json({message: "Department deleted successfully"});
    }catch(e){
        console.log(e);
        res.status(500).send('Server Error');
    }
}