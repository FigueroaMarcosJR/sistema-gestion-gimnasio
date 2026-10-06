import { useState } from "react";

import Socios from "./components/Socios";
import Cuotas from "./components/Cuotas";
import Asistencias from "./components/Asistencias";
import Dashboard from "./components/Dashboard";
function App() {
    const [seccion, setSeccion] = useState("dashboard");

    const mostrarContenido = () => {
        if (seccion === "dashboard") {
            return <Dashboard />;
        }

        if (seccion === "socios") {
            return <Socios />;
        }

        if (seccion === "cuotas") {
            return <Cuotas />;
        }

        if (seccion === "asistencias") {
            return <Asistencias />;
        }

        return null;
    };

    const claseBoton = (nombre) => {
        return seccion === nombre
            ? "btn btn-primary text-start fw-semibold"
            : "btn btn-light text-start";
    };

    return (
        <div className="min-vh-100 bg-light">

            {/* BARRA SUPERIOR */}
            <nav className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm">
                <div>
                    <span className="navbar-brand fw-bold mb-0">
                        🏋️ Gym Management
                    </span>

                    <span className="text-secondary d-none d-md-inline">
                        Sistema de Gestión de Gimnasio
                    </span>
                </div>
            </nav>

            <div className="container-fluid">
                <div className="row">

                    {/* MENÚ LATERAL */}
                    <aside className="col-md-2 bg-white min-vh-100 border-end shadow-sm p-3">

                        <div className="mb-4">
                            <small className="text-uppercase text-muted fw-bold">
                                Menú principal
                            </small>
                        </div>

                        <div className="d-grid gap-2">

                            <button
                                className={claseBoton("dashboard")}
                                onClick={() => setSeccion("dashboard")}
                            >
                                🏠 Datos
                            </button>

                            <button
                                className={claseBoton("socios")}
                                onClick={() => setSeccion("socios")}
                            >
                                👥 Socios
                            </button>

                            <button
                                className={claseBoton("cuotas")}
                                onClick={() => setSeccion("cuotas")}
                            >
                                💳 Cuotas
                            </button>

                            <button
                                className={claseBoton("asistencias")}
                                onClick={() => setSeccion("asistencias")}
                            >
                                ✅ Asistencias
                            </button>

                        </div>

                        <hr className="my-4" />

                        <div className="text-muted small">
                            <div className="fw-semibold">
                                Sistema de Gimnasio
                            </div>
                            <div>
                                Panel administrativo
                            </div>
                        </div>

                    </aside>

                    {/* CONTENIDO PRINCIPAL */}
                    <main className="col-md-10 p-4 p-lg-5">
                        {mostrarContenido()}
                    </main>

                </div>
            </div>

        </div>
    );
}

export default App;