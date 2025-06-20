import express from "express";
import {getAll , update , remove , lowStock , expired , add} from "../controllers/medicineController.js"

const router = express.Router();

router.get('/' ,getAll);
router.post('/' , add);
router.put('/:id' ,update);
router.delete('/:id',remove);
router.get('/low-stock' , lowStock);
router.get('/expired',expired);


export default router;



