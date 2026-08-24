import express from "express";

import {
    listarSocios,
    buscarSocio,
    agregarSocio,
    actualizarSocio,
    eliminarSocio
} from "../controllers/sociosController.js";

const router = express.Router();

router.get("/", listarSocios);

router.get("/:id", buscarSocio);

router.post("/", agregarSocio);

router.put("/:id", actualizarSocio);

router.delete("/:id", eliminarSocio);

export default router;
