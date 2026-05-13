const NAME_REGEX    = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]{2,100}$/;
const EMAIL_REGEX   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(body) {
  const errors = {};
  const { nombre, correo, mensaje } = body;

  if (!nombre?.trim())
    errors.nombre = "El nombre es obligatorio";
  else if (!NAME_REGEX.test(nombre.trim()))
    errors.nombre = "El nombre contiene caracteres inválidos";
  else if (nombre.trim().length < 2 || nombre.trim().length > 100)
    errors.nombre = "El nombre debe tener entre 2 y 100 caracteres";

  if (!correo?.trim())
    errors.correo = "El correo es obligatorio";
  else if (!EMAIL_REGEX.test(correo.trim()))
    errors.correo = "Correo inválido";
  else if (correo.trim().length > 255)
    errors.correo = "El correo es demasiado largo";

  if (!mensaje?.trim())
    errors.mensaje = "El mensaje es obligatorio";
  else if (mensaje.trim().length < 10)
    errors.mensaje = "El mensaje debe tener mínimo 10 caracteres";
  else if (mensaje.trim().length > 1000)
    errors.mensaje = "El mensaje no puede superar 1000 caracteres";

  return {
    valid:  Object.keys(errors).length === 0,
    errors,
  };
}