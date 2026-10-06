import express from "express";

import {
    listarAsistencias,
    agregarAsistencia
} from "../controllers/asistenciasController.js";

const router = express.Router();

router.get("/", listarAsistencias);
router.post("/", agregarAsistencia);

export default router;