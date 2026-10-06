import { useEffect, useState } from "react";

function Asistencias() {

    const [asistencias, setAsistencias] = useState([]);
    const [socios, setSocios] = useState([]);
    const [idSocio, setIdSocio] = useState("");
    const [mensaje, setMensaje] = useState("");

    const obtenerAsistencias = () => {

        fetch("http://localhost:3000/api/asistencias")
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                setAsistencias(datos);
            })
            .catch((error) => {
                console.error("Error al obtener asistencias:", error);
            });
    };

    const obtenerSocios = () => {

        fetch("http://localhost:3000/api/socios")
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                setSocios(datos);
            })
            .catch((error) => {
                console.error("Error al obtener socios:", error);
            });
    };

    useEffect(() => {
        obtenerAsistencias();
        obtenerSocios();
    }, []);

    const registrarAsistencia = (evento) => {
        evento.preventDefault();

        setMensaje("");

        fetch("http://localhost:3000/api/asistencias", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_socio: idSocio
            })
        })
            .then(async (respuesta) => {
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje);
                }

                return datos;
            })
            .then((datos) => {
                setMensaje(datos.mensaje);
                setIdSocio("");
                obtenerAsistencias();
            })
            .catch((error) => {
                setMensaje(error.message);
            });
    };

    return (
        <div>

            {/* ENCABEZADO */}
            <div className="mb-4">
                <h1 className="fw-bold mb-1">
                    Gestión de Asistencias
                </h1>

                <p className="text-muted mb-0">
                    Registrá el ingreso de socios y consultá el historial de asistencias
                </p>
            </div>


            {/* REGISTRO */}
            <div className="card border-0 shadow-sm mb-5">

                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h4 className="fw-bold mb-0">
                        ✅ Registrar asistencia
                    </h4>
                </div>

                <div className="card-body p-4">

                    <form onSubmit={registrarAsistencia}>

                        <div className="row align-items-end">

                            <div className="col-md-8 mb-3">
                                <label className="form-label fw-semibold">
                                    Socio
                                </label>

                                <select
                                    className="form-select"
                                    value={idSocio}
                                    onChange={(evento) =>
                                        setIdSocio(evento.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        Seleccionar socio
                                    </option>

                                    {socios
                                        .filter((socio) => socio.estado === "ACTIVO")
                                        .map((socio) => (
                                            <option
                                                key={socio.id_socio}
                                                value={socio.id_socio}
                                            >
                                                {socio.nombre} {socio.apellido} - DNI: {socio.dni}
                                            </option>
                                        ))}
                                </select>
                            </div>


                            <div className="col-md-4 mb-3">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Registrar asistencia
                                </button>
                            </div>

                        </div>


                        {mensaje && (
                            <div
                                className={
                                    mensaje.toLowerCase().includes("correct")
                                        ? "alert alert-success mt-2 mb-0"
                                        : "alert alert-warning mt-2 mb-0"
                                }
                            >
                                {mensaje}
                            </div>
                        )}

                    </form>

                </div>
            </div>


            {/* HISTORIAL */}
            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-0 pt-4 px-4">
                    <div>
                        <h4 className="fw-bold mb-1">
                            📋 Historial de asistencias
                        </h4>

                        <p className="text-muted mb-0">
                            Registro de ingresos realizados en el gimnasio
                        </p>
                    </div>
                </div>

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Socio</th>
                                    <th>Fecha y hora</th>
                                </tr>
                            </thead>

                            <tbody>

                                {asistencias.map((asistencia) => (

                                    <tr key={asistencia.id_asistencia}>

                                        <td className="ps-4 fw-semibold">
                                            #{asistencia.id_asistencia}
                                        </td>

                                        <td>
                                            {asistencia.nombre_socio}
                                        </td>

                                        <td>
                                            {new Date(
                                                asistencia.fecha_hora
                                            ).toLocaleString("es-AR")}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>
            </div>

        </div>
    );
}

export default Asistencias;