import * as Socio from "../models/sociosModel.js";

export const listarSocios = (req, res) => {

    Socio.obtenerSocios((err, resultados) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(resultados);

    });

};

export const buscarSocio = (req, res) => {

    const { id } = req.params;

    Socio.obtenerSocioPorId(id, (err, resultados) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(resultados);

    });

};

export const agregarSocio = (req, res) => {

    Socio.crearSocio(req.body, (err, resultado) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            mensaje: "Socio creado correctamente",
            id: resultado.insertId
        });

    });

};
export const actualizarSocio = (req, res) => {

    const { id } = req.params;

    Socio.actualizarSocio(id, req.body, (err, resultado) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Socio no encontrado"
            });
        }

        res.json({
            mensaje: "Socio actualizado correctamente"
        });

    });

};

export const eliminarSocio = (req, res) => {

    const { id } = req.params;

    Socio.desactivarSocio(id, (err, resultado) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Socio no encontrado"
            });
        }

        res.json({
            mensaje: "Socio dado de baja correctamente"
        });

    });

};


// Recibe la petición del cliente y llama al modelo.
