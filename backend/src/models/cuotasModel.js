import connection from "../config/db.js";

export const obtenerCuotas = (callback) => {
    const sql = `
        SELECT
            cuotas.id_cuota,
            cuotas.id_socio,
            CONCAT(socios.nombre, ' ', socios.apellido) AS nombre_socio,
            cuotas.fecha_pago,
            cuotas.fecha_vencimiento,
            cuotas.monto,
            CASE
    WHEN cuotas.estado IN ('PAGADA', 'PENDIENTE')
         AND cuotas.fecha_vencimiento < CURDATE()
    THEN 'VENCIDA'
    ELSE cuotas.estado
END AS estado
        FROM cuotas
        INNER JOIN socios
            ON cuotas.id_socio = socios.id_socio
        ORDER BY cuotas.fecha_vencimiento ASC
    `;

    connection.query(sql, callback);
};
export const crearCuota = (cuota, callback) => {
    const sql = `
        INSERT INTO cuotas
        (id_socio, fecha_pago, fecha_vencimiento, monto, estado)
        VALUES (?, ?, ?, ?, ?)
    `;

    const valores = [
        cuota.id_socio,
        cuota.fecha_pago,
        cuota.fecha_vencimiento,
        cuota.monto,
        cuota.estado
    ];

    connection.query(sql, valores, callback);
};
export const actualizarCuota = (id, cuota, callback) => {
    const sql = `
        UPDATE cuotas
        SET
            fecha_pago = ?,
            fecha_vencimiento = ?,
            monto = ?,
            estado = ?
        WHERE id_cuota = ?
    `;

    const valores = [
        cuota.fecha_pago,
        cuota.fecha_vencimiento,
        cuota.monto,
        cuota.estado,
        id
    ];

    connection.query(sql, valores, callback);
};
export const registrarPago = (cuota, callback) => {
    const sql = `
        INSERT INTO cuotas
        (id_socio, fecha_pago, fecha_vencimiento, monto, estado)
        VALUES (
            ?,
            CURDATE(),
            CASE
                WHEN ? < CURDATE()
                THEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
                ELSE DATE_ADD(?, INTERVAL 1 MONTH)
            END,
            ?,
            'PAGADA'
        )
    `;

    const valores = [
        cuota.id_socio,
        cuota.fecha_vencimiento,
        cuota.fecha_vencimiento,
        cuota.monto
    ];

    connection.query(sql, valores, callback);
};
export const obtenerCuotaPorId = (id, callback) => {
    const sql = `
        SELECT
            id_cuota,
            id_socio,
            fecha_vencimiento,
            monto,
            estado
        FROM cuotas
        WHERE id_cuota = ?
    `;

    connection.query(sql, [id], callback);
};
export const verificarPeriodoExistente = (
    id_socio,
    fecha_vencimiento,
    callback
) => {
    const sql = `
        SELECT id_cuota
        FROM cuotas
        WHERE id_socio = ?
        AND YEAR(fecha_vencimiento) = YEAR(DATE_ADD(?, INTERVAL 1 MONTH))
        AND MONTH(fecha_vencimiento) = MONTH(DATE_ADD(?, INTERVAL 1 MONTH))
        LIMIT 1
    `;

    connection.query(
        sql,
        [id_socio, fecha_vencimiento, fecha_vencimiento],
        callback
    );
};
export const obtenerEstadoActual = (callback) => {
    const sql = `
        SELECT
            socios.id_socio,
            CONCAT(socios.nombre, ' ', socios.apellido) AS nombre_socio,
            socios.dni,
            cuotas.id_cuota,
            cuotas.fecha_pago,
            cuotas.fecha_vencimiento,
            cuotas.monto,
            CASE
                WHEN cuotas.id_cuota IS NULL THEN 'SIN CUOTA'
                WHEN cuotas.fecha_vencimiento < CURDATE() THEN 'VENCIDA'
                ELSE cuotas.estado
            END AS estado
        FROM socios
        LEFT JOIN cuotas
            ON cuotas.id_cuota = (
                SELECT c2.id_cuota
                FROM cuotas c2
                WHERE c2.id_socio = socios.id_socio
                ORDER BY c2.fecha_vencimiento DESC, c2.id_cuota DESC
                LIMIT 1
            )
        WHERE socios.estado = 'ACTIVO'
        ORDER BY socios.apellido, socios.nombre
    `;

    connection.query(sql, callback);
};
// 1. Trae solamente socios ACTIVOS
// Busca la cuota más reciente de cada socio
// Si nunca tuvo una cuota, igualmente lo muestra como SIN CUOTA