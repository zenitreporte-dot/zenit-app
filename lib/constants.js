// ============================================================
// Constantes globales de IkigAI
// ============================================================

// Precio en pesos colombianos
export const PRECIO_COP = 25000

// Comisión de afiliado en pesos colombianos
export const COMISION_AFILIADO_COP = 10000

// Colores por sección del formulario
export const COLORES_SECCIONES = {
  1: { bg: '#F4C0D1', text: '#8B1A4A', nombre: 'Lo que Amas', icono: '❤️' },
  2: { bg: '#B5D4F4', text: '#1A4A8B', nombre: 'En lo que Eres Bueno', icono: '⭐' },
  3: { bg: '#C0DD97', text: '#2D5A1A', nombre: 'Por lo que te Pueden Pagar', icono: '💰' },
  4: { bg: '#FAC775', text: '#8B5A1A', nombre: 'Lo que el Mundo Necesita', icono: '🌍' },
}

// Duración de la cookie de afiliado en días
export const DIAS_COOKIE_AFILIADO = 30

// Modelo de IA primario
export const MODELO_PRIMARIO = 'gemini-2.5-flash'

// Modelo de IA de respaldo
export const MODELO_FALLBACK = 'llama-3.3-70b-versatile'
