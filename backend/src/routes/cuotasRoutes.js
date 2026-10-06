import express from "express";

import {
    listarCuotas,
    agregarCuota,
    actualizarCuota,
    registrarPago,
    obtenerEstadoActual
} from "../controllers/cuotasController.js";

const router = express.Router();

router.get("/", listarCuotas);
router.get("/estado-actual", obtenerEstadoActual);
router.post("/", agregarCuota);
router.put("/:id", actualizarCuota);
router.post("/:id/pagar", registrarPago);


export default router;