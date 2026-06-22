export function sanitizeInput(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>"']/g, "")
    .replace(/[\\;]$/g, "")
    .trim();
}

export function validatePhone(phone: string): { valid: boolean; error: string } {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  if (cleaned.length === 0) return { valid: false, error: "El teléfono es obligatorio" };
  if (cleaned.length < 10) return { valid: false, error: "El número debe tener al menos 10 dígitos (ej: 0412XXXXXXX)" };
  if (cleaned.length > 15) return { valid: false, error: "El número ingresado es demasiado largo" };
  if (!/^\+?\d+$/.test(cleaned)) return { valid: false, error: "Solo se permiten números y el prefijo +" };
  return { valid: true, error: "" };
}

export function validateName(name: string): { valid: boolean; error: string } {
  const cleaned = name.trim();
  if (cleaned.length === 0) return { valid: false, error: "El nombre es obligatorio" };
  if (cleaned.length < 2) return { valid: false, error: "El nombre debe tener al menos 2 caracteres" };
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.]+$/.test(cleaned)) return { valid: false, error: "El nombre solo puede contener letras y espacios" };
  return { valid: true, error: "" };
}

export function validateAddress(address: string): { valid: boolean; error: string } {
  const cleaned = address.trim();
  if (cleaned.length === 0) return { valid: false, error: "La dirección es obligatoria" };
  if (cleaned.length < 10) return { valid: false, error: "Ingresá una dirección completa (calle, número, ciudad)" };
  if (cleaned.length > 300) return { valid: false, error: "La dirección es demasiado larga" };
  if (/[<>{}\\;]/.test(cleaned)) return { valid: false, error: "La dirección contiene caracteres no válidos" };
  return { valid: true, error: "" };
}
