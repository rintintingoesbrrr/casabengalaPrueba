import { Router } from "express";
import pool           from "../db.js";
import { validateRegister } from "../middleware/validate.js";

const router = Router();

router.post("/", async (req, res) => {
  // 1. Validate
  const { valid, errors } = validateRegister(req.body);
  if (!valid) {
    return res.status(422).json({ message: "Datos inválidos", errors });
  }

  const { nombre, correo, mensaje } = req.body;

  // 2. Metadata
  const ip_address = (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    null
  );
  const user_agent = req.headers["user-agent"]?.slice(0, 500) || null;

  try {
    // 3. Duplicate email check
    const [existing] = await pool.query(
      "SELECT id FROM registros WHERE correo = ?",
      [correo.trim().toLowerCase()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Este correo ya está registrado",
        errors: { correo: "Este correo ya está registrado" },
      });
    }

    // 4. Insert
    const [result] = await pool.query(
      `INSERT INTO registros (nombre, correo, mensaje, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        correo.trim().toLowerCase(),
        mensaje.trim(),
        ip_address,
        user_agent,
      ]
    );

    return res.status(201).json({
      message: "Registro exitoso",
      id: result.insertId,
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
});

export default router;