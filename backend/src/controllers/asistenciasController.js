import * as Asistencia from "../models/asistenciasModel.js";

export const listarAsistencias = (req, res) => {

    Asistencia.obtenerAsistencias((err, resultados) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(resultados);

    });

};
export const agregarAsistencia = (req, res) => {
    const { id_socio } = req.body;

    if (!id_socio) {
        return res.status(400).json({
            mensaje: "El id_socio es obligatorio"
        });
    }

    Asistencia.verificarSocioActivo(id_socio, (err, socio) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (socio.length === 0) {
            return res.status(404).json({
                mensaje: "El socio no existe"
            });
        }

        if (socio[0].estado !== "ACTIVO") {
            return res.status(400).json({
                mensaje: "No se puede registrar la asistencia de un socio INACTIVO"
            });
        }

        Asistencia.registrarAsistencia(id_socio, (err, resultado) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                mensaje: "Asistencia registrada correctamente",
                id_asistencia: resultado.insertId
            });
        });
    });
};
