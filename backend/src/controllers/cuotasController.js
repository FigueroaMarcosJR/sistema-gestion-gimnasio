import * as Cuota from "../models/cuotasModel.js";

export const listarCuotas = (req, res) => {

    Cuota.obtenerCuotas((err, resultados) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(resultados);

    });

};
export const agregarCuota = (req, res) => {

    const cuota = req.body;

    Cuota.crearCuota(cuota, (err, resultado) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({
            mensaje: "Cuota registrada correctamente",
            id_cuota: resultado.insertId
        });

    });

};
export const actualizarCuota = (req, res) => {

    const id = req.params.id;
    const cuota = req.body;

    Cuota.actualizarCuota(id, cuota, (err, resultado) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Cuota no encontrada"
            });
        }

        res.json({
            mensaje: "Cuota actualizada correctamente"
        });

    });

};
export const registrarPago = (req, res) => {
    const id = req.params.id;

    Cuota.obtenerCuotaPorId(id, (err, resultados) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Cuota no encontrada"
            });
        }

        const cuota = resultados[0];
        const hoy = new Date();
const vencimiento = new Date(cuota.fecha_vencimiento);

if (cuota.estado === "PAGADA" && vencimiento >= hoy) {
    return res.status(400).json({
        mensaje: "La cuota actual todavía está vigente. No se puede registrar un pago adelantado."
    });
}

        Cuota.verificarPeriodoExistente(
            cuota.id_socio,
            cuota.fecha_vencimiento,
            (err, periodos) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (periodos.length > 0) {
                    return res.status(409).json({
                        mensaje: "El próximo período de este socio ya fue registrado"
                    });
                }

                Cuota.registrarPago(cuota, (err, resultado) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        mensaje: "Pago registrado correctamente",
                        id_cuota: resultado.insertId
                    });
                });
            }
        );
    });
};
export const obtenerEstadoActual = (req, res) => {
    Cuota.obtenerEstadoActual((err, resultados) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(resultados);
    });
};