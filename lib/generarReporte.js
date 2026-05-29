// ============================================================
// Motor de IA — Pipeline de 2 pasos con base científica
//
// Fundamentado en:
// - Kashdan & McKnight (2009): propósito como proceso iterativo
// - Bronk et al. (2018): beyond-the-self como dimensión crítica
// - Gollwitzer & Sheeran (2006): implementation intentions (d=.65)
// - Snyder (1974, 1977): especificidad conductual vs Efecto Barnum
// - Krys et al. (2022): colectivismo y familismo LATAM
// - Wrzesniewski et al. (1997): orientación Job/Career/Calling
// - Ryan & Deci (2000): Self-Determination Theory
// - Kamiya (1966): ikigai original — pequeños momentos, no grand purpose
//
// Modelo primario: Gemini 2.5 Pro
// Fallback: Groq Llama 3.3 70B
// ============================================================
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

// ─────────────────────────────────────────────────────────────
// PASO 1 — Análisis profundo con extracción de evidencia
//
// Propósito: antes de escribir una sola línea del reporte,
// el modelo debe extraer citas reales, detectar sesgos,
// mapear restricciones y diagnosticar orientación vocacional.
// ─────────────────────────────────────────────────────────────
const PROMPT_ANALISIS = `Eres un psicólogo especialista en propósito y orientación vocacional. Acabas de leer las 20 respuestas de tu próximo cliente. Antes de la sesión, escribes tus notas de preparación.

REGLA ABSOLUTA: Cada conclusión debe estar anclada en una cita textual. Una interpretación sin evidencia no existe.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE A — EXTRACCIÓN DE EVIDENCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Copia textualmente las 7-9 frases más reveladoras. Para cada una:

CITA 1: "[frase exacta]"
→ Qué revela: [patrón, contradicción, deseo o miedo concreto]

(continúa hasta 9 citas)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE B — DETECCIÓN DE SESGO DE DESEABILIDAD SOCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Las personas responden lo que creen que "deberían" decir, no siempre lo que sienten.
Busca señales de respuesta aspiracional vs real:

- ¿Hay contradicciones entre respuestas? (ej: dice que su propósito es ayudar a otros, pero en P4 describe un día perfecto completamente solo)
- ¿Usa clichés de autoayuda? ("hacer la diferencia", "dejar un legado", "ayudar a la humanidad") — señal de respuesta socialmente deseable
- ¿Hay respuestas abstractas donde todas las demás son concretas? — posible blank spot
- ¿Qué dijo de forma espontánea y específica sin que se lo pidieran directamente?

Escribe: "La respuesta más auténtica fue [P#] porque... La más aspiracional/filtrada fue [P#] porque..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE C — DIAGNÓSTICO DE ORIENTACIÓN VOCACIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Según Wrzesniewski et al. (1997), las personas tienen orientación dominante:

JOB: El trabajo es medio para un fin (dinero, estabilidad). No es parte central de la identidad. Trabaja para vivir.
CAREER: El trabajo es medio para avanzar (status, reconocimiento, progresión). La identidad está en el ascenso.
CALLING: El trabajo es fin en sí mismo. Lo haría sin paga. Es parte central de la identidad. Siente que contribuye a algo más grande.

Con base en las respuestas (especialmente P11, P12, P13, P15), ¿cuál es la orientación dominante de esta persona? ¿Hay tensión entre la orientación real y la que aspira tener?

Escribe: "Orientación dominante: [JOB/CAREER/CALLING]. Evidencia: [cita]. Tensión: [sí/no, explicación]."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE D — MAPEO DE RESTRICCIONES REALES (CONTEXTO LATAM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
En Colombia y LATAM, el propósito no existe en el vacío. Está condicionado por:
- Obligaciones familiares (¿hay dependientes económicos? ¿hay presión familiar sobre la carrera?)
- Restricciones económicas reales (¿menciona estabilidad como prioridad no negociable?)
- Expectativas sociales o culturales que siente como límites
- Rol de género implícito en cómo describe sus posibilidades

¿Qué restricciones reales mencionó explícita o implícitamente? ¿Cuáles ignora el reporte si no las nombra?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE E — ¿A QUIÉN ESPECÍFICAMENTE SIRVE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
La investigación de Bronk (2018) demuestra que el propósito genuino siempre tiene un componente "más allá de sí mismo". Sin esto, es solo un interés personal intenso.

Con base en P16, P17, P18 y P19: ¿a quiénes específicamente quiere ayudar esta persona? No "a la sociedad" — a qué grupo concreto, con qué problema específico.

Si no emerge claramente, nótalo: es información para el reporte.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASE F — ANÁLISIS PSICOLÓGICO PROFUNDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Con todo lo anterior como base:

1. EL HILO INVISIBLE: ¿Qué patrón conecta lo que hacía de niño (P2), cómo ayuda a otros (P6-P7) y su visión de impacto (P19)? Nómbralo con una frase específica.

2. LA TENSIÓN REAL: ¿Dónde está la contradicción más grande entre lo que dice querer y cómo vive actualmente? Cita ambos lados.

3. EL MIEDO DISFRAZADO: En sus obstáculos (P14), ¿qué miedo específico se esconde? No "miedo al fracaso" — ¿miedo a qué exactamente, según lo que describió?

4. LA HABILIDAD QUE NO VE: ¿Qué hace naturalmente (P10) que menciona como obvio pero que claramente no lo es?

5. EL CAMINO QUE LA HARÍA MISERABLE: ¿Qué opción parece lógica para su perfil pero contradice algo que dijo explícitamente?

6. FUENTES DE SENTIDO COTIDIANAS: ¿Qué pequeños momentos o actividades concretas mencionó que ya le generan sentido ahora, antes de cualquier cambio de vida? (Kamiya, 1966: el ikigai auténtico vive en lo cotidiano, no solo en los grandes proyectos)

Sé directo. Este es tu borrador privado.`

// ─────────────────────────────────────────────────────────────
// PASO 2 — Síntesis estructurada en JSON
//
// El análisis previo es el contexto. El JSON es el producto.
// Nueva estructura incorpora: hipótesis (no declaraciones),
// para_quién, micro_ikigai, implementation intentions,
// reconocimiento de restricciones reales.
// ─────────────────────────────────────────────────────────────
const PROMPT_SINTESIS = `Basándote en el análisis anterior y las respuestas originales, escribe el reporte Zenit IkigAI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTRASTE — ANTES DE ESCRIBIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ GENÉRICO (Efecto Barnum — podría aplicar a cualquiera):
"Tu propósito gira en torno a conectar personas con conocimiento de formas creativas. Tienes una capacidad única para simplificar lo complejo y hacer que otros se sientan comprendidos. Eres un puente entre el saber y las personas."

✅ ESPECÍFICO (anclado en lo que dijo, imposible de copiar a otro reporte):
"Aparece el mismo patrón en tres respuestas distintas: de niño te absorbía construir Lego y luego modificarlos 'porque el resultado nunca era suficiente', en P8 describiste cómo resolviste el problema de comunicación entre el equipo de ventas y el técnico usando un documento visual que nadie había pedido, y en P19 tu legado no es 'ayudar a la gente' sino específicamente 'que los que vienen después encuentren el camino más claro que yo'. No es creatividad — es una necesidad de depurar sistemas hasta que sean transparentes para otros."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGLAS (aplican a cada campo del JSON)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Cada afirmación debe estar anclada en algo que dijo. Si no puedes citar, no lo escribas.
2. Habla en segunda persona: "tú", "tu", "te". Nunca "esta persona" ni tercera persona.
3. PROHIBIDO iniciar con: "Tu propósito es", "Tu esencia es", "Eres una persona que", "Tu Ikigai es", "Se evidencia que", "Tienes un don para".
4. El propósito NO es una declaración — es una hipótesis a testear. Usa lenguaje de exploración.
5. Nombra restricciones reales si las mencionó. No finjas que vive en el vacío.
6. Las acciones de la hoja de ruta DEBEN estar en formato if-then: "Si [situación específica], entonces [acción concreta]".
7. Máximo 3 acciones por período. La evidencia dice que más de 5 no se ejecutan.
8. La frase de cierre: menos de 12 palabras, segunda persona, que suene como algo que ella diría — no un poster.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT — Solo JSON válido, sin texto antes ni después
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "ikigai_central": "NO declares 'tu propósito es X'. En cambio: presenta 2-3 hipótesis de propósito basadas en patrones observados en sus respuestas. Formato: 'El patrón más consistente en lo que describiste apunta a [hipótesis 1]. También aparece [hipótesis 2]. Los próximos 30 días te dirán cuál pesa más.' Abre con una observación concreta que la haga pensar 'cómo supo eso'. Máximo 4 oraciones densas.",

  "para_quien": "¿A quiénes específicamente sirve su propósito? No 'a la sociedad' — a qué grupo concreto, con qué problema específico, basado en lo que dijo en P16-P19. Si mencionó un grupo específico (jóvenes de su barrio, emprendedores que fracasan, mujeres que no tienen acceso a X), úsalo. Si no, identifica el grupo implícito. 2-3 oraciones. Esta sección es obligatoria — sin ella el reporte es solo autoayuda narcisista.",

  "contexto_reconocido": "Si mencionó restricciones reales (familia, dinero, presión, dependientes, expectativas), nómbralas explícitamente y reconócelas como parte real del mapa, no como obstáculos a superar. Si no mencionó restricciones, escribe null. Ejemplo: 'Mencionaste que tu familia espera que sigas en el trabajo estable. Eso no es un obstáculo menor — es una variable real del diseño. Lo que sigue lo toma en cuenta.' Máximo 2 oraciones.",

  "analisis_circulos": {
    "lo_que_amas": "Nombra las actividades concretas que mencionó — no 'creatividad', sino exactamente qué describió. Explica el patrón detrás. 3 oraciones máximo.",
    "en_lo_que_eres_bueno": "Nombra habilidades exactas que mencionó o que se infieren de ejemplos concretos. Incluye al menos una que probablemente no reconoce como habilidad — cita el momento en que la demostró sin darse cuenta. 3 oraciones.",
    "por_lo_que_te_pueden_pagar": "Conecta sus habilidades con demandas reales del mercado. Sé específico: roles concretos, sectores, tipos de trabajo — no 'emprendimiento' genérico. Si mencionó restricciones económicas, considéralas. 3 oraciones.",
    "lo_que_el_mundo_necesita": "Conecta su deseo de impacto con un problema real y concreto. El problema debe ser lo suficientemente específico para que sepa a quién va a ayudar. No grandilocuente. 3 oraciones."
  },

  "intersecciones": {
    "pasion": "Lo que amas + En lo que eres bueno. Una situación real de su vida donde ya convergen — no hipotética. 2 oraciones.",
    "mision": "Lo que amas + Lo que el mundo necesita. Escenario concreto y realista basado en lo que describió como su deseo de impacto. 2 oraciones.",
    "vocacion": "En lo que eres bueno + Lo que el mundo necesita. Rol o función específica con nombre concreto si es posible. 2 oraciones.",
    "profesion": "En lo que eres bueno + Por lo que te pueden pagar. Modelo económico congruente con su perfil y sus restricciones reales. 2 oraciones."
  },

  "arquetipo": {
    "nombre": "Un nombre específico para esta persona — no El/La + adjetivo genérico. Crea algo que capture su combinación única basado en sus respuestas reales. Ejemplos del nivel de especificidad que busco: 'El Depurador de Sistemas Humanos', 'La Traductora de Mundos Técnicos', 'El Arquitecto de Caminos Más Claros'. Que al leerlo piense 'sí, eso soy yo'.",
    "descripcion": "Por qué este arquetipo aplica — usando detalles de sus respuestas. Si hay algo de su infancia que conecta con el arquetipo, úsalo. La orientación dominante (Job/Career/Calling) que diagnosticaste debe estar implícita en cómo describes el arquetipo. 3 oraciones.",
    "orientacion": "job | career | calling — una sola palabra, la orientación dominante diagnosticada en el análisis"
  },

  "alertas": [
    "ALERTA 1: Un camino que parece perfecto para su perfil pero que la haría infeliz — nombra el camino concreto y explica por qué basándote en algo que dijo explícitamente que lo contradice. Que incomode un poco — si suena a consejo de autoayuda genérico, empieza de nuevo.",
    "ALERTA 2: Un patrón de autosabotaje específico visible en sus respuestas — no en abstracto, sino el comportamiento concreto. Si puedes, cita brevemente algo que lo ejemplifica.",
    "ALERTA 3: Una creencia limitante que mencionó (especialmente en P14) que le está costando más de lo que cree. Nómbrala con exactitud, no como 'miedo al fracaso'."
  ],

  "habilidades": [
    {
      "nombre": "Habilidad específica — no 'liderazgo' ni 'creatividad' genérica. Di exactamente qué tipo.",
      "por_que": "Por qué esta habilidad es diferenciadora para su perfil — anclado en algo que describió.",
      "como": "Acción en formato if-then: 'Si [situación concreta que vive regularmente], entonces [acción específica que desarrolla esta habilidad]. Resultado esperado en 30 días: [algo medible o observable].'"
    },
    {"nombre": "...", "por_que": "...", "como": "..."},
    {"nombre": "...", "por_que": "...", "como": "..."},
    {"nombre": "...", "por_que": "...", "como": "..."},
    {"nombre": "...", "por_que": "...", "como": "..."}
  ],

  "hoja_de_ruta": {
    "dias_30": [
      "Si [situación específica que vive regularmente], entonces [acción concreta]. Resultado esperado: [observable].",
      "Si [otra situación], entonces [acción]. Resultado: [observable].",
      "Si [situación], entonces [acción]. Resultado: [observable]."
    ],
    "dias_90": [
      "Si [situación], entonces [acción más ambiciosa — un cambio estructural pequeño pero real].",
      "Si [situación], entonces [acción].",
      "Si [situación], entonces [acción]."
    ],
    "dias_180": [
      "Si [situación], entonces [acción que cambie algo estructural — puede incluir una conversación difícil o decisión que ya sabe que tiene que tomar].",
      "Si [situación], entonces [acción].",
      "Si [situación], entonces [acción]."
    ]
  },

  "micro_ikigai": "El ikigai japonés original (Kamiya, 1966) vive en los pequeños momentos cotidianos, no solo en los grandes proyectos. Con base en lo que describió: ¿qué 2-3 actividades o momentos concretos ya tiene en su vida que le generan sentido ahora, hoy, sin necesidad de ningún cambio? Nómbralos específicamente — si mencionó algo como 'cuando explico algo y veo que el otro entiende' o 'los martes cuando trabajo solo por la mañana', úsalos. Esta sección es un ancla: le recuerda que el propósito no empieza cuando todo esté resuelto.",

  "frase_cierre": "Menos de 12 palabras. Segunda persona. Que suene como algo que ella podría decir, no como un poster motivacional. Basada en algo concreto que emergió de sus respuestas — no genérica. Si no encuentras una frase que sea realmente suya, es señal de que no fuiste suficientemente específico en el análisis."
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
// Gemini 2.5 Pro — MODELO PRIMARIO
// ─────────────────────────────────────────────────────────────
async function generarConGemini(respuestasFormateadas, notaSensible = '') {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

  console.log('Gemini 2.5 Pro — paso 1: extracción y análisis profundo...')
  const resultadoAnalisis = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${PROMPT_ANALISIS}${notaSensible}\n\n${respuestasFormateadas}` }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 3500 },
  })
  const analisis = resultadoAnalisis.response.text()
  console.log('Análisis completado — iniciando síntesis estructurada...')

  const promptSintesisFinal = `${PROMPT_ANALISIS}${notaSensible}\n\n${respuestasFormateadas}\n\n${'━'.repeat(50)}\nMI ANÁLISIS (úsalo como base, no lo repitas):\n${'━'.repeat(50)}\n${analisis}\n\n${PROMPT_SINTESIS}`

  const resultadoSintesis = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: promptSintesisFinal }] }],
    generationConfig: { temperature: 0.75, maxOutputTokens: 6500 },
  })
  const texto = resultadoSintesis.response.text()
  const jsonMatch = texto.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Gemini 2.5 Pro no devolvió JSON válido')

  return { contenido: JSON.parse(jsonMatch[0]), modelo: 'gemini-2.5-pro' }
}

// ─────────────────────────────────────────────────────────────
// Groq Llama — FALLBACK
// ─────────────────────────────────────────────────────────────
async function generarConGroq(respuestasFormateadas, notaSensible = '') {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  console.log('Groq — paso 1: análisis profundo...')
  const paso1 = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: PROMPT_ANALISIS + notaSensible },
      { role: 'user', content: respuestasFormateadas },
    ],
    temperature: 0.7,
    max_tokens: 2800,
  })
  const analisis = paso1.choices[0].message.content
  console.log('Análisis completado — iniciando síntesis...')

  const paso2 = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: PROMPT_SINTESIS + notaSensible },
      { role: 'user', content: respuestasFormateadas },
      { role: 'assistant', content: `Mi análisis previo:\n${analisis}\n\nJSON del reporte:` },
    ],
    temperature: 0.72,
    max_tokens: 5500,
    response_format: { type: 'json_object' },
  })

  const texto = paso2.choices[0].message.content
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
      'En el análisis, busca activamente señales de esperanza y recursos — lo que todavía le genera ilusión. ' +
      'En el JSON: ikigai_central debe reconocer genuinamente su situación sin minimizarla. ' +
      'micro_ikigai es especialmente importante aquí — anclarla en lo que ya funciona. ' +
      'Las alertas deben evitar lenguaje que presione o genere culpa. Tono: cálido y honesto, nunca condescendiente.'
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
    console.log('Iniciando generación con Groq Llama...')
    const resultado = await generarConGroq(respuestasFormateadas, notaSensible)
    const ms = Date.now() - inicio
    console.log(`Reporte generado con Groq en ${ms}ms`)
    return { ...resultado, ms }
  } catch (errorGroq) {
    throw new Error('Ambos modelos fallaron. Groq: ' + errorGroq.message)
  }
}
