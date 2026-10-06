import { useEffect, useState } from "react";

function Dashboard() {
    const [socios, setSocios] = useState([]);
    const [estadoCuotas, setEstadoCuotas] = useState([]);
    const [asistencias, setAsistencias] = useState([]);

    useEffect(() => {

        fetch("http://localhost:3000/api/socios")
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                setSocios(datos);
            })
            .catch((error) => {
                console.error("Error al obtener socios:", error);
            });

        fetch("http://localhost:3000/api/cuotas/estado-actual")
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                setEstadoCuotas(datos);
            })
            .catch((error) => {
                console.error("Error al obtener cuotas:", error);
            });

        fetch("http://localhost:3000/api/asistencias")
            .then((respuesta) => respuesta.json())
            .then((datos) => {
                setAsistencias(datos);
            })
            .catch((error) => {
                console.error("Error al obtener asistencias:", error);
            });

    }, []);

    const sociosActivos = socios.filter(
        (socio) => socio.estado === "ACTIVO"
    ).length;

    const cuotasPagadas = estadoCuotas.filter(
        (cuota) => cuota.estado === "PAGADA"
    ).length;

    const cuotasVencidas = estadoCuotas.filter(
        (cuota) => cuota.estado === "VENCIDA"
    ).length;

    const sociosSinCuota = estadoCuotas.filter(
        (cuota) => cuota.estado === "SIN CUOTA"
    ).length;

    const listaVencidas = estadoCuotas.filter(
        (cuota) => cuota.estado === "VENCIDA"
    );
    const hoy = new Date().toLocaleDateString("es-AR");

    const asistenciasHoy = asistencias.filter((asistencia) => {
        const fechaAsistencia = new Date(
            asistencia.fecha_hora
        ).toLocaleDateString("es-AR");

        return fechaAsistencia === hoy;
    }).length;

    return (
        <div>

            <div className="mb-4">
                <h1 className="fw-bold mb-1">
                    Dashboard
                </h1>

                <p className="text-muted mb-0">
                    Resumen general del estado del gimnasio
                </p>
            </div>


            <div className="row g-4">

                {/* SOCIOS ACTIVOS */}
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">

                            <div className="fs-2 mb-2">
                                👥
                            </div>

                            <h6 className="text-muted">
                                Socios activos
                            </h6>

                            <h2 className="fw-bold mb-0">
                                {sociosActivos}
                            </h2>

                        </div>
                    </div>
                </div>


                {/* CUOTAS AL DÍA */}
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">

                            <div className="fs-2 mb-2">
                                ✅
                            </div>

                            <h6 className="text-muted">
                                Cuotas al día
                            </h6>

                            <h2 className="fw-bold mb-0">
                                {cuotasPagadas}
                            </h2>

                        </div>
                    </div>
                </div>


                {/* CUOTAS VENCIDAS */}
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">

                            <div className="fs-2 mb-2">
                                ⚠️
                            </div>

                            <h6 className="text-muted">
                                Cuotas vencidas
                            </h6>

                            <h2 className="fw-bold mb-0">
                                {cuotasVencidas}
                            </h2>

                        </div>
                    </div>
                </div>


                {/* SIN CUOTA */}
                <div className="col-md-6 col-xl-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body p-4">

                            <div className="fs-2 mb-2">
                                💳
                            </div>

                            <h6 className="text-muted">
                                Sin cuota
                            </h6>

                            <h2 className="fw-bold mb-0">
                                {sociosSinCuota}
                            </h2>

                        </div>
                    </div>
                </div>

            </div>
            <div className="row g-4 mt-1">

                <div className="col-md-6 col-xl-3">

                    <div className="card border-0 shadow-sm h-100">

                        <div className="card-body p-4">

                            <div className="fs-2 mb-2">
                                🏋️
                            </div>

                            <h6 className="text-muted">
                                Asistencias hoy
                            </h6>

                            <h2 className="fw-bold mb-0">
                                {asistenciasHoy}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>
            <div className="card border-0 shadow-sm mt-5">

                <div className="card-header bg-white border-0 pt-4 px-4">
                    <h4 className="fw-bold mb-1">
                        ⚠️ Socios con cuotas vencidas
                    </h4>

                    <p className="text-muted mb-0">
                        Socios que requieren regularizar su cuota
                    </p>
                </div>

                <div className="card-body p-0">

                    {listaVencidas.length === 0 ? (

                        <div className="p-4">
                            <div className="alert alert-success mb-0">
                                ✅ No hay socios con cuotas vencidas.
                            </div>
                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Socio</th>
                                        <th>DNI</th>
                                        <th>Vencimiento</th>
                                        <th>Monto</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {listaVencidas.map((cuota) => (

                                        <tr key={cuota.id_socio}>

                                            <td className="ps-4 fw-semibold">
                                                {cuota.nombre_socio}
                                            </td>

                                            <td>
                                                {cuota.dni}
                                            </td>

                                            <td>
                                                {cuota.fecha_vencimiento
                                                    ? new Date(
                                                        cuota.fecha_vencimiento
                                                    ).toLocaleDateString("es-AR")
                                                    : "-"}
                                            </td>

                                            <td className="fw-semibold">
                                                {cuota.monto
                                                    ? `$${cuota.monto}`
                                                    : "-"}
                                            </td>

                                            <td>
                                                <span className="badge bg-danger">
                                                    VENCIDA
                                                </span>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;