import connection from "../config/db.js";

export const obtenerAsistencias = (callback) => {
    const sql = `
        SELECT
            asistencias.id_asistencia,
            asistencias.id_socio,
            CONCAT(socios.nombre, ' ', socios.apellido) AS nombre_socio,
            asistencias.fecha_hora
        FROM asistencias
        INNER JOIN socios
            ON asistencias.id_socio = socios.id_socio
        ORDER BY asistencias.fecha_hora DESC
    `;

    connection.query(sql, callback);
};

export const registrarAsistencia = (id_socio, callback) => {
    const sql = `
        INSERT INTO asistencias (id_socio)
        VALUES (?)
    `;

    connection.query(sql, [id_socio], callback);
};
export const verificarSocioActivo = (id_socio, callback) => {
    const sql = `
        SELECT id_socio, estado
        FROM socios
        WHERE id_socio = ?
    `;

    connection.query(sql, [id_socio], callback);
};