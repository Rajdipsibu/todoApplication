import express from "express";
import { createNotes,getNotes,updateNotes,deleteNotes } from "../controllers/notes.controller.js";

const router = express.Router();

router.post("/notes",createNotes);
router.get("/notes",getNotes);
router.put("/notes/:id",updateNotes);
router.delete("/notes/:id",deleteNotes);

export default router;