import connection from "../config/db.js";

export const obtenerSocios = (callback) => {
  const sql = "SELECT * FROM socios";

  connection.query(sql, callback);
};

export const obtenerSocioPorId = (id, callback) => {
  const sql = "SELECT * FROM socios WHERE id_socio = ?";

  connection.query(sql, [id], callback);
};

export const crearSocio = (datos, callback) => {
  const sql = `
    INSERT INTO socios
    (nombre, apellido, dni, telefono, email, fecha_inscripcion, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(sql, [
    datos.nombre,
    datos.apellido,
    datos.dni,
    datos.telefono,
    datos.email,
    datos.fecha_inscripcion,
    datos.estado
  ], callback);
};
export const actualizarSocio = (id, datos, callback) => {
  const sql = `
    UPDATE socios
    SET nombre = ?,
        apellido = ?,
        dni = ?,
        telefono = ?,
        email = ?,
        fecha_inscripcion = ?,
        estado = ?
    WHERE id_socio = ?
  `;

  connection.query(sql, [
    datos.nombre,
    datos.apellido,
    datos.dni,
    datos.telefono,
    datos.email,
    datos.fecha_inscripcion,
    datos.estado,
    id
  ], callback);
};

export const desactivarSocio = (id, callback) => {
  const sql = `
    UPDATE socios
    SET estado = 'INACTIVO'
    WHERE id_socio = ?
  `;

  connection.query(sql, [id], callback);
};


// ES EL UNICO ARCHIVO QUE HABLA CON SQL