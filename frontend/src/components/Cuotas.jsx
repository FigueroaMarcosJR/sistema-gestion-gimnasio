import { useEffect, useState } from "react";

function Cuotas() {
    const [cuotas, setCuotas] = useState([]);
    const [socios, setSocios] = useState([]);
    const [cuotaEditando, setCuotaEditando] = useState(null);
    const [estadoActual, setEstadoActual] = useState([]);

    const [formulario, setFormulario] = useState({
        id_socio: "",
        fecha_pago: "",
        fecha_vencimiento: "",
        monto: "",
        estado: "PENDIENTE"
    });

    const obtenerCuotas = () => {
        fetch("http://localhost:3000/api/cuotas")
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                setCuotas(datos);
            })
            .catch((error) => {
                console.error("Error al obtener cuotas:", error);
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
        obtenerCuotas();
        obtenerSocios();
        obtenerEstadoActual();
    }, []);
    const manejarCambio = (evento) => {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };
    const editarCuota = (cuota) => {
        setCuotaEditando(cuota);

        setFormulario({
            id_socio: cuota.id_socio,
            fecha_pago: cuota.fecha_pago || "",
            fecha_vencimiento: cuota.fecha_vencimiento,
            monto: cuota.monto,
            estado: cuota.estado
        });
    };

    const agregarCuota = (evento) => {
        evento.preventDefault();

        const metodo = cuotaEditando ? "PUT" : "POST";

        const url = cuotaEditando
            ? `http://localhost:3000/api/cuotas/${cuotaEditando.id_cuota}`
            : "http://localhost:3000/api/cuotas";

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
                    id_socio: "",
                    fecha_pago: "",
                    fecha_vencimiento: "",
                    monto: "",
                    estado: "PENDIENTE"
                });

                setCuotaEditando(null);

                obtenerCuotas();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const obtenerEstadoActual = () => {
        fetch("http://localhost:3000/api/cuotas/estado-actual")
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                setEstadoActual(datos);
            })
            .catch((error) => {
                console.error("Error al obtener estado actual:", error);
            });
    };
    const registrarPago = (cuota) => {

        if (!cuota.id_cuota) {
            alert("Este socio todavía no tiene una cuota registrada");
            return;
        }

        fetch(`http://localhost:3000/api/cuotas/${cuota.id_cuota}/pagar`, {
            method: "POST"
        })
            .then(async (respuesta) => {
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje);
                }

                return datos;
            })
            .then((datos) => {
                alert(datos.mensaje);

                obtenerEstadoActual();
                obtenerCuotas();
            })
            .catch((error) => {
                alert(error.message);
            });
    };
    const crearPrimeraCuota = (socio) => {
        const monto = prompt("Ingrese el monto de la cuota:");

        if (!monto) {
            return;
        }

        const fechaVencimiento = prompt(
            "Ingrese la fecha de vencimiento (AAAA-MM-DD):"
        );

        if (!fechaVencimiento) {
            return;
        }
        const fechaActual = new Date().toISOString().split("T")[0];

        const nuevaCuota = {
            id_socio: socio.id_socio,
            fecha_pago: fechaActual,
            fecha_vencimiento: fechaVencimiento,
            monto: monto,
            estado: "PAGADA"
        };

        fetch("http://localhost:3000/api/cuotas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaCuota)
        })
            .then(async (respuesta) => {
                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(
                        datos.mensaje || "Error al crear la primera cuota"
                    );
                }

                return datos;
            })
            .then((datos) => {
                alert(datos.mensaje || "Primera cuota creada correctamente");

                obtenerEstadoActual();
                obtenerCuotas();
            })
            .catch((error) => {
                alert(error.message);
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
        <div className="mb-4">
            <h1 className="fw-bold mb-1">
                Gestión de Cuotas
            </h1>

            <p className="text-muted mb-0">
                Controlá el estado de pago de cada socio y consultá el historial
                de cuotas registradas
            </p>
        </div>


        {/* FORMULARIO */}
        <div className="card border-0 shadow-sm mb-5">

            <div className="card-header bg-white border-0 pt-4 px-4">
                <h4 className="fw-bold mb-0">
                    {cuotaEditando ? "✏️ Editar cuota" : "➕ Nueva cuota"}
                </h4>
            </div>

            <div className="card-body p-4">

                <form onSubmit={agregarCuota}>

                    <div className="row">

                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Socio
                            </label>

                            <select
                                className="form-select"
                                name="id_socio"
                                value={formulario.id_socio}
                                onChange={manejarCambio}
                                required
                            >
                                <option value="">
                                    Seleccionar socio
                                </option>

                                {socios.map((socio) => (
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
                            <label className="form-label fw-semibold">
                                Fecha de pago
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="fecha_pago"
                                value={formulario.fecha_pago}
                                onChange={manejarCambio}
                            />
                        </div>


                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-semibold">
                                Fecha de vencimiento
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="fecha_vencimiento"
                                value={formulario.fecha_vencimiento}
                                onChange={manejarCambio}
                                required
                            />
                        </div>


                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">
                                Monto
                            </label>

                            <input
                                type="number"
                                className="form-control"
                                name="monto"
                                value={formulario.monto}
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
                                <option value="PAGADA">
                                    PAGADA
                                </option>

                                <option value="PENDIENTE">
                                    PENDIENTE
                                </option>

                                <option value="VENCIDA">
                                    VENCIDA
                                </option>
                            </select>
                        </div>

                    </div>


                    <div className="d-flex gap-2">

                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                        >
                            {cuotaEditando
                                ? "Guardar cambios"
                                : "Registrar cuota"}
                        </button>

                        {cuotaEditando && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    setCuotaEditando(null);

                                    setFormulario({
                                        id_socio: "",
                                        fecha_pago: "",
                                        fecha_vencimiento: "",
                                        monto: "",
                                        estado: "PENDIENTE"
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


        {/* ESTADO ACTUAL */}
        <div className="card border-0 shadow-sm mb-5">

            <div className="card-header bg-white border-0 pt-4 px-4">
                <div>
                    <h4 className="fw-bold mb-1">
                        💳 Estado actual de cuotas
                    </h4>

                    <p className="text-muted mb-0">
                        Situación vigente de cada socio activo
                    </p>
                </div>
            </div>

            <div className="card-body p-0">

                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">Socio</th>
                                <th>DNI</th>
                                <th>Vencimiento</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>

                        <tbody>

                            {estadoActual.map((item) => (

                                <tr key={item.id_socio}>

                                    <td className="ps-4 fw-semibold">
                                        {item.nombre_socio}
                                    </td>

                                    <td>
                                        {item.dni}
                                    </td>

                                    <td>
                                        {formatearFecha(item.fecha_vencimiento)}
                                    </td>

                                    <td className="fw-semibold">
                                        {item.monto
                                            ? `$${item.monto}`
                                            : "-"}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                item.estado === "PAGADA"
                                                    ? "badge bg-success"
                                                    : item.estado === "VENCIDA"
                                                    ? "badge bg-danger"
                                                    : item.estado === "PENDIENTE"
                                                    ? "badge bg-warning text-dark"
                                                    : "badge bg-secondary"
                                            }
                                        >
                                            {item.estado}
                                        </span>
                                    </td>

                                    <td>

                                        {item.estado === "SIN CUOTA" ? (

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() =>
                                                    crearPrimeraCuota(item)
                                                }
                                            >
                                                Crear primera cuota
                                            </button>

                                        ) : item.estado === "PAGADA" ? (

                                            <button
                                                className="btn btn-outline-success btn-sm"
                                                disabled
                                            >
                                                Al día ✓
                                            </button>

                                        ) : (

                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() =>
                                                    registrarPago(item)
                                                }
                                            >
                                                Registrar pago
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


        {/* HISTORIAL */}
        <div className="card border-0 shadow-sm">

            <div className="card-header bg-white border-0 pt-4 px-4">
                <div>
                    <h4 className="fw-bold mb-1">
                        📋 Historial de cuotas
                    </h4>

                    <p className="text-muted mb-0">
                        Registro completo de las cuotas cargadas en el sistema
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
                                <th>Fecha de pago</th>
                                <th>Vencimiento</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>

                            {cuotas.map((cuota) => (

                                <tr key={cuota.id_cuota}>

                                    <td className="ps-4 fw-semibold">
                                        #{cuota.id_cuota}
                                    </td>

                                    <td>
                                        {cuota.nombre_socio}
                                    </td>

                                    <td>
                                        {formatearFecha(cuota.fecha_pago)}
                                    </td>

                                    <td>
                                        {formatearFecha(cuota.fecha_vencimiento)}
                                    </td>

                                    <td className="fw-semibold">
                                        ${cuota.monto}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                cuota.estado === "PAGADA"
                                                    ? "badge bg-success"
                                                    : cuota.estado === "VENCIDA"
                                                    ? "badge bg-danger"
                                                    : "badge bg-warning text-dark"
                                            }
                                        >
                                            {cuota.estado}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-outline-warning btn-sm"
                                            onClick={() =>
                                                editarCuota(cuota)
                                            }
                                        >
                                            Editar
                                        </button>
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

export default Cuotas;