import Medicine from "../models/Medicine.js";

//Add New Medicines
export const add = async(req , res)=>{
    try {
        const newMed = new Medicine(req.body);
        await newMed.save();
        res.status(201).json(newMed)

    } catch (err) {
        res.status(400).json({error : "Invalid Data" , details : err.message})
    }
}

//Get All Medicines
export const getAll = async (req , res) =>{
    try {
        const medicines = await Medicine.find();
        res.json(medicines)
    } catch (err) {
        res.status(500).json({error:  "Server Error. UNable to Fetch all Medicines"})
        
    }
}

//Update Medicines in DB
export const update = async (req ,res)=>{
    try {
        const med = await Medicine.findByIdAndUpdate(req.params.id , req.body ,{new : true})
        if(!med)  return res.status(404).json({error : "Medicine not Found"})
            res.json(med)
    } catch (err) {
        res.status(400).json({error : "Update Failed" , details: err.message})
    }
}

//Delete
export const remove = async(req , res)=>{
    try {
        const result = await Medicine.findByIdAndDelete(req.params.id)
        if(!result) return res.status(404).json({error : "Medicine not Found"})
            res.json({message : "Medicine Deleted"})
    } catch (err) {
        res.status(500).json({error: "Delete Failed"})
    }
}

//Low Stock Medicines
export const lowStock = async(req, res)=>{
    try {
        const stock = await Medicine.find({quantity : {$lt : 10}})
        res.json(stock)

    } catch (err) {
        res.status(500).json({error:  "Server Error.Unable to fetch Low Stock Medicines."})
    }
}

//Expired Medicines
export const expired = async (req , res)=>{
    try {
        const result = await Medicine.find({expiryDate : {$lt : new Date()}})
        res.json(result)
    } catch (err) {
        res.status(500).json({error:  "Server Error.Unable to fetch Expired Medicines."})
    }
}
