// Las 20 preguntas del formulario Zenit
// Divididas en 4 secciones según las 4 dimensiones del propósito

export const SECCIONES = [
  {
    id: 1,
    nombre: 'Lo que Amas',
    descripcion: 'Las actividades y experiencias que te dan vida',
    icono: '',
    colorFondo: '#1c1714',
    colorTexto: '#e8c97a',
    colorBoton: '#c9a84c',
    preguntas: [
      { id: 1, texto: '¿Qué actividad harías aunque nadie te pagara y nadie se enterara?' },
      { id: 2, texto: 'De niño/a, ¿con qué jugabas o qué hacías que te absorbía completamente?' },
      { id: 3, texto: '¿Hay algo que dejaste de lado por "poco práctico" pero que todavía te genera curiosidad?' },
      { id: 4, texto: 'Si pudieras diseñar tu día de trabajo perfecto, ¿cómo sería? ¿Qué harías, con quién, dónde?' },
      { id: 5, texto: '¿Cuándo fue la última vez que estabas tan emocionado/a con algo que no podías dormir? ¿Qué era?' },
    ],
  },
  {
    id: 2,
    nombre: 'En lo que Eres Bueno',
    descripcion: 'Tus habilidades naturales y fortalezas únicas',
    icono: '',
    colorFondo: '#131820',
    colorTexto: '#90aed4',
    colorBoton: '#4a7eb5',
    preguntas: [
      { id: 6, texto: '¿Para qué te piden ayuda las personas más frecuentemente?' },
      { id: 7, texto: '¿Cuáles son los tres elogios que recibes más repetidamente?' },
      { id: 8, texto: '¿Recuerdas haber resuelto un problema difícil de una manera que otros no habían visto? ¿Qué pasó?' },
      { id: 9, texto: '¿Qué dicen tus amigos, familia o colegas que deberías hacer con tu vida?' },
      { id: 10, texto: '¿Hay algo que haces sin pensar y que te sorprende que otros no puedan hacer?' },
    ],
  },
  {
    id: 3,
    nombre: 'Por lo que te Pueden Pagar',
    descripcion: 'El valor económico que puedes generar en el mundo',
    icono: '',
    colorFondo: '#131c14',
    colorTexto: '#8ec48e',
    colorBoton: '#4a9c4a',
    preguntas: [
      { id: 11, texto: '¿Por qué actividad o servicio te han pagado alguna vez, aunque sea informalmente?' },
      { id: 12, texto: '¿En qué tipo de trabajo o actividad sientes que tu tiempo realmente vale la pena, aunque no ganes mucho? Describe ese momento.' },
      { id: 13, texto: '¿Cuándo has sentido que alguien verdaderamente valoró algo que hiciste? ¿Qué fue exactamente lo que hiciste?' },
      { id: 14, texto: '¿Qué obstáculos sientes que te frenan para dedicarte de lleno a lo que más te apasiona?' },
      { id: 15, texto: '¿Te imaginas generando ingresos de forma independiente, dentro de una organización, o de ambas maneras? ¿Por qué?' },
    ],
  },
  {
    id: 4,
    nombre: 'Lo que el Mundo Necesita',
    descripcion: 'El impacto que puedes dejar en quienes te rodean',
    icono: '',
    colorFondo: '#1a1b2e',
    colorTexto: '#c9a84c',
    colorBoton: '#a88a38',
    preguntas: [
      { id: 16, texto: '¿Qué problema de tu comunidad, ciudad o país te frustra o entristece más?' },
      { id: 17, texto: '¿Qué conocimiento o habilidad tuya beneficiaría más a otros si lo compartieras?' },
      { id: 18, texto: '¿Qué tipo de personas generan en ti más deseos de ayudar o proteger? ¿Por qué ese grupo?' },
      { id: 19, texto: '¿Qué legado te gustaría dejar? ¿Cómo te gustaría que te recordaran?' },
      { id: 20, texto: '¿Qué principio o valor nunca sacrificarías, aunque te ofrecieran más dinero o reconocimiento a cambio?' },
    ],
  },
]

export const TODAS_LAS_PREGUNTAS = SECCIONES.flatMap(s => s.preguntas)
