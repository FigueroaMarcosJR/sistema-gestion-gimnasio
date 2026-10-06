import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./config/db.js";
import sociosRoutes from "./routes/sociosRoutes.js";
import cuotasRoutes from "./routes/cuotasRoutes.js";
import asistenciasRoutes from "./routes/asistenciasRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/socios", sociosRoutes);
app.use("/api/cuotas", cuotasRoutes);
app.use("/api/asistencias", asistenciasRoutes);

app.get("/", (req, res) => {
    res.send("Servidor del Sistema de Gestión de Gimnasio funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});


