import { useEffect, useState } from "react";

function Socios() {
    const [socios, setSocios] = useState([]);
    const [socioEditando, setSocioEditando] = useState(null);


    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        email: "",
        fecha_inscripcion: "",
        estado: "ACTIVO"
    });

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
        obtenerSocios();
    }, []);

    const manejarCambio = (evento) => {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const agregarSocio = (evento) => {
        evento.preventDefault();

        const metodo = socioEditando ? "PUT" : "POST";

        const url = socioEditando
            ? `http://localhost:3000/api/socios/${socioEditando.id_socio}`
            : "http://localhost:3000/api/socios";

        fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formulario)
        })
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                console.log(datos);

                setFormulario({
                    nombre: "",
                    apellido: "",
                    dni: "",
                    telefono: "",
                    email: "",
                    fecha_inscripcion: "",
                    estado: "ACTIVO"
                });

                setSocioEditando(null);

                obtenerSocios();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const editarSocio = (socio) => {
        setSocioEditando(socio);

        setFormulario({
            nombre: socio.nombre,
            apellido: socio.apellido,
            dni: socio.dni,
            telefono: socio.telefono || "",
            email: socio.email || "",
            fecha_inscripcion: socio.fecha_inscripcion,
            estado: socio.estado
        });
    };
    const darDeBaja = (id) => {

        fetch(`http://localhost:3000/api/socios/${id}`, {
            method: "DELETE"
        })
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                console.log(datos);
                obtenerSocios();
            })
            .catch((error) => {
                console.error("Error al dar de baja:", error);
            });
    };
    const formatearFecha = (fecha) => {
        if (!fecha) return "-";

        const fechaSinHora = fecha.split("T")[0];
        const [anio, mes, dia] = fechaSinHora.split("-");

        return `${dia}/${mes}/${anio}`;
    };

    return (
        <div>

            {/* ENCABEZADO */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold mb-1">
                        Gestión de Socios
                    </h1>

                    <p className="text-muted mb-0">
                        Administrá altas, modificaciones y estado de los socios
                    </p>
                </div>


            </div>


            {/* FORMULARIO */}
            <div className="card border-0 shadow-sm mb-5">

                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h4 className="fw-bold mb-0">
                        {socioEditando ? "✏️ Editar socio" : "➕ Nuevo socio"}
                    </h4>
                </div>

                <div className="card-body p-4">

                    <form onSubmit={agregarSocio}>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">
                                    Nombre
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="nombre"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>


                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">
                                    Apellido
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="apellido"
                                    value={formulario.apellido}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>


                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">
                                    DNI
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="dni"
                                    value={formulario.dni}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>


                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">
                                    Teléfono
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="telefono"
                                    value={formulario.telefono}
                                    onChange={manejarCambio}
                                />
                            </div>


                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-semibold">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formulario.email}
                                    onChange={manejarCambio}
                                />
                            </div>


                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">
                                    Fecha de inscripción
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="fecha_inscripcion"
                                    value={formulario.fecha_inscripcion}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>


                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">
                                    Estado
                                </label>

                                <select
                                    className="form-select"
                                    name="estado"
                                    value={formulario.estado}
                                    onChange={manejarCambio}
                                >
                                    <option value="ACTIVO">
                                        ACTIVO
                                    </option>

                                    <option value="INACTIVO">
                                        INACTIVO
                                    </option>
                                </select>
                            </div>

                        </div>


                        <div className="d-flex gap-2">

                            <button
                                type="submit"
                                className="btn btn-primary px-4"
                            >
                                {socioEditando
                                    ? "Guardar cambios"
                                    : "Agregar socio"}
                            </button>

                            {socioEditando && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setSocioEditando(null);

                                        setFormulario({
                                            nombre: "",
                                            apellido: "",
                                            dni: "",
                                            telefono: "",
                                            email: "",
                                            fecha_inscripcion: "",
                                            estado: "ACTIVO"
                                        });
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}

                        </div>

                    </form>

                </div>
            </div>


            {/* TABLA */}
            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h4 className="fw-bold mb-0">
                        👥 Lista de socios
                    </h4>
                </div>

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>DNI</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Inscripción</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {socios.map((socio) => (

                                    <tr key={socio.id_socio}>

                                        <td className="ps-4 fw-semibold">
                                            #{socio.id_socio}
                                        </td>

                                        <td>{socio.nombre}</td>

                                        <td>{socio.apellido}</td>

                                        <td>{socio.dni}</td>

                                        <td>
                                            {socio.telefono || "-"}
                                        </td>

                                        <td>
                                            {socio.email || "-"}
                                        </td>

                                        <td>
                                            {formatearFecha(socio.fecha_inscripcion)}
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    socio.estado === "ACTIVO"
                                                        ? "badge bg-success"
                                                        : "badge bg-secondary"
                                                }
                                            >
                                                {socio.estado}
                                            </span>
                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-outline-warning btn-sm"
                                                onClick={() => editarSocio(socio)}
                                            >
                                                Editar
                                            </button>

                                            {socio.estado === "ACTIVO" && (
                                                <button
                                                    className="btn btn-outline-danger btn-sm ms-2"
                                                    onClick={() =>
                                                        darDeBaja(socio.id_socio)
                                                    }
                                                >
                                                    Dar de baja
                                                </button>
                                            )}

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

export default Socios;