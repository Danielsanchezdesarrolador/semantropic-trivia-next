/** Validación de interfaz exclusivamente local. Nunca autentica ni persiste datos. */
export type PreviewErrors = Partial<Record<'displayName' | 'email' | 'password' | 'confirm' | 'code', string>>;
export const accountsUnavailable = 'Vista previa: las cuentas todavía no están habilitadas';
export function validatePreview(route: string, values: Record<string, string>): PreviewErrors {
  const errors: PreviewErrors = {};
  if (route === 'register' && !values.displayName?.trim()) errors.displayName = 'Escribe tu nombre público.';
  if (['sign-in', 'register', 'forgot-password'].includes(route)) {
    if (!values.email?.trim()) errors.email = 'Escribe tu correo electrónico.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Escribe un correo válido, como nombre@ejemplo.com.';
  }
  if (['sign-in', 'register', 'reset-password'].includes(route)) {
    if (!values.password) errors.password = 'Escribe tu contraseña.';
    else if (route !== 'sign-in' && values.password.length < 8) errors.password = 'Usa al menos 8 caracteres.';
  }
  if (['register', 'reset-password'].includes(route)) {
    if (!values.confirm) errors.confirm = 'Repite tu contraseña.';
    else if (values.password !== values.confirm) errors.confirm = 'Las contraseñas no coinciden.';
  }
  if (route === 'verify' && !/^[0-9]{6}$/.test(values.code || '')) errors.code = 'Escribe seis dígitos para revisar este formulario de ejemplo. No se verificará ninguna cuenta.';
  return errors;
}
