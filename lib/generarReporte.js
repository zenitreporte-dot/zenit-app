// ============================================================
// Motor de IA — Pipeline de 1 paso optimizado
//
// Fundamentado en:
// - Kashdan & McKnight (2009): propósito como proceso iterativo
// - Bronk et al. (2018): beyond-the-self como dimensión crítica
// - Gollwitzer & Sheeran (2006): implementation intentions (d=.65)
// - Snyder (1974, 1977): especificidad conductual vs Efecto Barnum
// - Krys et al. (2022): colectivismo y familismo LATAM
// - Wrzesniewski et al. (1997): orientación Job/Career/Calling
// - Kamiya (1966): ikigai original — pequeños momentos, no grand purpose
//
// Modelo primario: Gemini 2.5 Pro (un solo paso)
// Fallback: Groq Llama 3.3 70B
// ============================================================
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

// ─────────────────────────────────────────────────────────────
// PROMPT ÚNICO — Análisis interno + JSON de salida
//
// El modelo analiza internamente antes de escribir cada campo.
// Solo produce JSON — sin texto previo ni análisis externo.
// ─────────────────────────────────────────────────────────────
const PROMPT_REPORTE = `Eres un psicólogo especialista en propósito y orientación vocacional. Acabas de leer las respuestas de tu cliente. Debes generar su reporte Zenit.

ANTES DE ESCRIBIR CADA CAMPO — analiza internamente:
- ¿Qué citas textuales sustentan lo que voy a escribir?
- ¿Esto podría aplicar a cualquier persona? Si sí, empieza de nuevo.
- ¿Estoy nombrando algo concreto que dijo, o estoy generalizando?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS ABSOLUTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Cada afirmación debe estar anclada en algo que dijo. Sin evidencia, no existe.
2. PROHIBIDO usar "P1", "P4", "P17" u otras abreviaciones. Si necesitas referenciar una respuesta, di "cuando mencionaste que..." o "cuando dijiste...". Las citas deben fluir naturalmente en el texto.
3. Segunda persona: "tú", "tu", "te". Nunca tercera persona.
4. PROHIBIDO iniciar con: "Tu propósito es", "Tu esencia es", "Eres una persona que", "Tienes un don para", "Se evidencia que".
5. El propósito es una HIPÓTESIS a explorar, no una declaración.
6. Nombra restricciones reales si las mencionó.
7. Acciones en formato if-then: "Si [situación específica], entonces [acción concreta]."
8. Máximo 3 acciones por período.
9. frase_cierre: menos de 12 palabras, segunda persona, que suene como algo que ESTA persona diría — no un póster motivacional. Si suena a autoayuda genérica, es incorrecta.
10. TIPOGRAFÍA CRÍTICA: Cuando cites frases del usuario usa SIEMPRE comillas dobles "así". ABSOLUTAMENTE PROHIBIDO usar comillas simples 'así' o tildes invertidas \`así\` para citas. Las comillas dobles son el único formato permitido para citar. Ejemplo correcto: cuando dijiste "prefiero la verdad incómoda". Ejemplo incorrecto: cuando dijiste 'prefiero la verdad incómoda'.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANTI-BARNUM — La diferencia entre genérico y específico
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ GENÉRICO (podría aplicar a cualquiera):
- ikigai_central: "Tu propósito gira en torno a conectar personas con conocimiento de formas creativas."
- frase_cierre: "Sigue adelante, no te rindas."
- arquetipo.nombre: "El Emprendedor Creativo"

✅ ESPECÍFICO (imposible de copiar a otro reporte):
- ikigai_central: "Cuando dijiste que usas la IA 'no como atajo sino como ventaja real', esa distinción no es técnica, es filosófica. El patrón que aparece cuando hablas de ayudar a otros con materias, con herramientas digitales y de tu legado apunta a algo concreto: no te importa lo que puedes hacer con las herramientas, te importa cómo cambia la forma de pensar de quien las usa."
- frase_cierre: "Construir algo que no necesite pedirle permiso a nadie."
- arquetipo.nombre: "El Fundador que Enseña Mientras Construye"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT — Solo JSON válido, sin texto antes ni después
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "ikigai_central": "NO declares propósito. Presenta 2 hipótesis basadas en patrones observados — cita frases específicas de las respuestas. Empieza con una observación concreta que sorprenda. Máximo 4 oraciones densas.",

  "para_quien": "Grupo específico con problema específico, basado en lo que dijo sobre impacto y legado. No 'la sociedad'. 2 oraciones.",

  "contexto_reconocido": "Si mencionó restricciones reales (dinero, familia, dispersión, presión), nómbralas. Si no hay, escribe null.",

  "analisis_circulos": {
    "lo_que_amas": "Actividades concretas que mencionó — no 'creatividad' genérica. Patrón detrás. 2 oraciones.",
    "en_lo_que_eres_bueno": "Habilidades exactas con ejemplos concretos de sus respuestas. Incluye una que no reconoce como habilidad. 2 oraciones.",
    "por_lo_que_te_pueden_pagar": "Roles concretos, sectores, tipos de trabajo basados en sus habilidades reales. No 'emprendimiento' genérico. 2 oraciones.",
    "lo_que_el_mundo_necesita": "Problema específico que mencionó + grupo concreto al que quiere servir. 2 oraciones."
  },

  "intersecciones": {
    "pasion": "Situación real de su vida donde ya convergen lo que ama y en lo que es bueno. 2 oraciones.",
    "mision": "Escenario concreto basado en lo que describió como deseo de impacto. 2 oraciones.",
    "vocacion": "Rol o función específica con nombre concreto si es posible. 2 oraciones.",
    "profesion": "Modelo económico congruente con su perfil y restricciones reales. 2 oraciones."
  },

  "arquetipo": {
    "nombre": "Nombre único — no genérico. Captura su combinación específica. Ej: 'El Fundador que Enseña Mientras Construye', 'El Traductor de Mundos Técnicos'. Que al leerlo piense 'sí, eso soy yo'.",
    "descripcion": "Por qué aplica — con detalles de sus respuestas. 3 oraciones.",
    "orientacion": "job | career | calling"
  },

  "alertas": [
    "Camino que parece perfecto pero lo haría infeliz — nombra el camino y cita lo que lo contradice.",
    "Patrón de autosabotaje específico visible en sus respuestas — comportamiento concreto, no abstracto.",
    "Creencia limitante exacta que mencionó — no 'miedo al fracaso', el miedo específico según lo que dijo."
  ],

  "habilidades": [
    {"nombre": "Habilidad específica — no 'liderazgo' ni 'creatividad'.", "por_que": "Por qué diferenciadora para su perfil.", "como": "Si [situación concreta que vive], entonces [acción específica]. Resultado en 30 días: [observable]."},
    {"nombre": "...", "por_que": "...", "como": "..."},
    {"nombre": "...", "por_que": "...", "como": "..."},
    {"nombre": "...", "por_que": "...", "como": "..."},
    {"nombre": "...", "por_que": "...", "como": "..."}
  ],

  "hoja_de_ruta": {
    "dias_30": [
      "Si [situación específica que vive hoy], entonces [acción concreta con fecha o número]. Resultado: [observable].",
      "Si [situación], entonces [acción].",
      "Si [situación], entonces [acción]."
    ],
    "dias_90": [
      "Si [situación], entonces [acción más ambiciosa — cambio estructural pequeño pero real].",
      "Si [situación], entonces [acción].",
      "Si [situación], entonces [acción]."
    ],
    "dias_180": [
      "Si [situación], entonces [acción que cambie algo estructural — conversación difícil o decisión pendiente].",
      "Si [situación], entonces [acción].",
      "Si [situación], entonces [acción]."
    ]
  },

  "micro_ikigai": "2-3 momentos o actividades concretas que ya tiene en su vida hoy y que le generan sentido. Usa lo que mencionó específicamente — no hipotético. 3 oraciones.",

  "frase_cierre": "Menos de 12 palabras. Segunda persona. Basada en algo concreto que emergió — no genérica. Si suena a póster, empieza de nuevo."
}`

// ─────────────────────────────────────────────────────────────
// Formateo de respuestas del formulario
// ─────────────────────────────────────────────────────────────
function formatearRespuestas(answers) {
  const preguntas = [
    '¿Qué actividad harías aunque nadie te pagara y nadie se enterara?',
    'De niño/a, ¿con qué jugabas o qué hacías que te absorbía completamente?',
    '¿Hay algo que dejaste de lado por "poco práctico" pero que todavía te genera curiosidad?',
    'Si pudieras diseñar tu día de trabajo perfecto, ¿cómo sería?',
    '¿Cuándo fue la última vez que estabas tan emocionado/a que no podías dormir? ¿Qué era?',
    '¿Para qué te piden ayuda las personas más frecuentemente?',
    '¿Cuáles son los tres elogios que recibes más repetidamente?',
    '¿Recuerdas haber resuelto un problema difícil de una manera que otros no habían visto?',
    '¿Qué dicen tus amigos, familia o colegas que deberías hacer con tu vida?',
    '¿Hay algo que haces sin pensar y que te sorprende que otros no puedan hacer?',
    '¿Por qué actividad o servicio te han pagado alguna vez, aunque sea informalmente?',
    '¿En qué tipo de trabajo o actividad sientes que tu tiempo realmente vale la pena?',
    '¿Cuándo has sentido que alguien verdaderamente valoró algo que hiciste?',
    '¿Qué obstáculos sientes que te frenan para dedicarte de lleno a lo que más te apasiona?',
    '¿Te imaginas generando ingresos de forma independiente, dentro de una organización, o de ambas maneras?',
    '¿Qué problema de tu comunidad te frustra o entristece más?',
    '¿Qué conocimiento tuyo beneficiaría más a otros si lo compartieras?',
    '¿Qué tipo de personas generan en ti más deseos de ayudar?',
    '¿Qué legado te gustaría dejar?',
    '¿Qué principio o valor nunca sacrificarías, aunque te ofrecieran más dinero o reconocimiento?',
  ]
  let texto = 'RESPUESTAS DEL USUARIO:\n\n'
  for (let i = 1; i <= 20; i++) {
    const respuesta = answers[i] || answers[String(i)] || '(Sin respuesta)'
    texto += `P${i}: ${preguntas[i - 1]}\nR: ${respuesta}\n\n`
  }
  return texto
}

// ─────────────────────────────────────────────────────────────
// Gemini 2.5 Pro — MODELO PRIMARIO (un solo paso)
// ─────────────────────────────────────────────────────────────
async function generarConGemini(respuestasFormateadas, notaSensible = '') {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

  console.log('Gemini 2.5 Pro — generando reporte en un solo paso...')

  const resultado = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${PROMPT_REPORTE}${notaSensible}\n\n${respuestasFormateadas}` }] }],
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 8000,
      thinkingConfig: { thinkingBudget: 2048 }, // limita thinking para dar espacio a la respuesta
    },
  })

  const texto = resultado.response.text()
  const jsonMatch = texto.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Gemini 2.5 Pro no devolvió JSON válido')

  return { contenido: JSON.parse(jsonMatch[0]), modelo: 'gemini-2.5-pro' }
}

// ─────────────────────────────────────────────────────────────
// Groq Llama — FALLBACK
// ─────────────────────────────────────────────────────────────
async function generarConGroq(respuestasFormateadas, notaSensible = '') {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  console.log('Groq Llama 3.3 70B — generando reporte...')

  const resultado = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: PROMPT_REPORTE + notaSensible },
      { role: 'user', content: respuestasFormateadas },
    ],
    temperature: 0.72,
    max_tokens: 4500,
    response_format: { type: 'json_object' },
  })

  const texto = resultado.choices[0].message.content
  const jsonMatch = texto.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Groq no devolvió JSON válido')
  return { contenido: JSON.parse(jsonMatch[0]), modelo: 'groq-llama-3.3-70b' }
}

// ─────────────────────────────────────────────────────────────
// Función principal exportada
// ─────────────────────────────────────────────────────────────
export async function generarReporteIA(answers, esSensible = false) {
  const respuestasFormateadas = formatearRespuestas(answers)
  const notaSensible = esSensible
    ? '\n\nNOTA CLÍNICA: Esta persona puede estar en un momento emocionalmente difícil. ' +
      'ikigai_central debe reconocer genuinamente su situación. ' +
      'micro_ikigai es especialmente importante — anclarla en lo que ya funciona. ' +
      'Las alertas deben evitar lenguaje que presione o genere culpa. Tono: cálido y honesto.'
    : ''
  const inicio = Date.now()

  // Primario: Gemini 2.5 Pro
  try {
    console.log('Iniciando generación con Gemini 2.5 Pro...')
    const resultado = await generarConGemini(respuestasFormateadas, notaSensible)
    const ms = Date.now() - inicio
    console.log(`Reporte generado con Gemini 2.5 Pro en ${ms}ms`)
    return { ...resultado, ms }
  } catch (errorGemini) {
    console.warn('Gemini 2.5 Pro falló:', errorGemini.message, '— usando Groq...')
  }

  // Fallback: Groq Llama
  try {
    const resultado = await generarConGroq(respuestasFormateadas, notaSensible)
    const ms = Date.now() - inicio
    console.log(`Reporte generado con Groq en ${ms}ms`)
    return { ...resultado, ms }
  } catch (errorGroq) {
    throw new Error('Ambos modelos fallaron. Groq: ' + errorGroq.message)
  }
}
