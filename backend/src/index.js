import express        from "express";
import cors           from "cors";
import helmet         from "helmet";
import rateLimit      from "express-rate-limit";
import dotenv         from "dotenv";
import { testConnection } from "./db.js";
import registerRouter from "./routes/register.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin:      process.env.CORS_ORIGIN || "*",
  methods:     ["POST"],
  allowedHeaders: ["Content-Type"],
}));

// ─── Rate limit — max 10 requests per 15 min per IP ──────────────────────────
app.use("/api/register", rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { message: "Demasiadas solicitudes, intenta más tarde" },
}));

// ─── Body parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/register", registerRouter);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok" }));

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ message: "Ruta no encontrada" }));

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start();