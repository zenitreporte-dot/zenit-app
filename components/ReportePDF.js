// ============================================================
// Componente PDF del reporte Zenit — v5
// Paleta brand: navy #1a1b2e | amber #c9a84c | cream #f5f0e8
// ============================================================
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

export function registerLatoFonts() { /* no-op */ }

const C = {
  navy:       '#1a1b2e',
  navyMid:    '#2d2e4a',
  navyLight:  '#3d3e5a',
  amber:      '#c9a84c',
  amberLight: '#e8c97a',
  cream:      '#f5f0e8',
  creamDark:  '#ede8de',
  white:      '#FFFFFF',
  textDark:   '#1a1b2e',
  textMid:    '#4a4b5e',
  textLight:  '#7a7b8e',
  red:        '#DC2626',
  redBg:      '#FFF5F5',
  redBorder:  '#FECACA',
}

const s = StyleSheet.create({

  // ── Página ──────────────────────────────────────────────────
  pagina: {
    fontFamily: 'Helvetica',
    backgroundColor: C.white,
    paddingTop: 38,
    paddingBottom: 54,
    paddingHorizontal: 44,
  },

  // ── Hero ────────────────────────────────────────────────────
  hero: {
    backgroundColor: C.navy,
    borderRadius: 10,
    padding: 24,
    marginBottom: 14,
  },
  heroLabel:     { color: C.amberLight, fontSize: 7.5, letterSpacing: 2, marginBottom: 6 },
  heroArquetipo: { color: C.amber, fontSize: 21, fontFamily: 'Helvetica-Bold', marginBottom: 10, lineHeight: 1.3 },
  heroTexto:     { color: C.cream, fontSize: 9.5, lineHeight: 1.7, marginBottom: 12 },
  heroDivider:   { borderTopWidth: 1, borderTopColor: C.navyLight, marginBottom: 10 },
  heroFraseLabel:{ color: C.amberLight, fontSize: 7.5, marginBottom: 4 },
  heroFrase:     { color: C.white, fontSize: 11, fontFamily: 'Helvetica-Oblique', lineHeight: 1.5 },

  // ── Sección contenedor ──────────────────────────────────────
  seccion: {
    marginBottom: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: C.creamDark,
    overflow: 'hidden',
  },
  seccionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: C.cream,
  },
  seccionBadge: {
    width: 22,
    height: 22,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.navy,
  },
  seccionBadgeNum:  { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.amber },
  seccionLabel:     { fontSize: 7, fontFamily: 'Helvetica-Bold', letterSpacing: 1, color: C.textLight, marginBottom: 1 },
  seccionTitulo:    { fontSize: 11.5, fontFamily: 'Helvetica-Bold', color: C.navy },
  seccionBody:      { padding: 12, paddingTop: 10, backgroundColor: C.white },

  // ── Círculos ────────────────────────────────────────────────
  circulo: { borderRadius: 5, padding: 9, marginBottom: 6, backgroundColor: C.cream },
  circuloTit: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 3 },
  circuloTxt: { fontSize: 8.5, lineHeight: 1.6, color: C.textMid },

  // ── Grid 2 columnas ─────────────────────────────────────────
  grid2:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gridItem: {
    width: '48.4%',
    backgroundColor: C.cream,
    borderRadius: 5,
    padding: 9,
    borderWidth: 1,
    borderColor: C.creamDark,
  },
  gridBadge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.navy,
    backgroundColor: C.amber,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  gridTitulo: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.navy, marginBottom: 1 },
  gridSub:    { fontSize: 7.5, color: C.textLight, marginBottom: 4 },
  gridTxt:    { fontSize: 8.5, lineHeight: 1.6, color: C.textMid },

  // ── Arquetipo ───────────────────────────────────────────────
  arquetipoNombre: {
    fontSize: 17, fontFamily: 'Helvetica-Bold',
    color: C.amber, textAlign: 'center', marginBottom: 8,
  },
  arquetipoDesc: { fontSize: 9, lineHeight: 1.7, textAlign: 'center', color: C.textMid },

  // ── Alertas ─────────────────────────────────────────────────
  alertaItem: {
    flexDirection: 'row',
    gap: 7,
    backgroundColor: C.redBg,
    borderWidth: 1,
    borderColor: C.redBorder,
    borderRadius: 5,
    padding: 9,
    marginBottom: 6,
  },
  alertaBullet: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.red, width: 12 },
  alertaTxt:    { fontSize: 8.5, lineHeight: 1.6, color: C.textMid, flex: 1 },

  // ── Habilidades ─────────────────────────────────────────────
  habilidadItem: {
    backgroundColor: C.cream,
    borderWidth: 1,
    borderColor: C.creamDark,
    borderRadius: 5,
    padding: 9,
    marginBottom: 6,
  },
  habilidadHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  habilidadNum: {
    width: 18, height: 18, backgroundColor: C.navy, borderRadius: 9,
    fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.amber,
    textAlign: 'center', paddingTop: 3,
  },
  habilidadNombre: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.navy },
  habilidadLabel:  { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.textDark, marginBottom: 1 },
  habilidadTxt:    { fontSize: 8, lineHeight: 1.55, color: C.textMid },

  // ── Hoja de ruta ────────────────────────────────────────────
  periodoHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5, marginTop: 2 },
  periodoTag: {
    fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.navy,
    backgroundColor: C.amber,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 3,
  },
  periodoTitulo: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.navy },
  accion:        { flexDirection: 'row', gap: 5, marginBottom: 4 },
  accionFlecha:  { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: C.amber },
  accionTxt:     { fontSize: 8.5, lineHeight: 1.55, color: C.textMid, flex: 1 },
  dividerRuta:   { borderTopWidth: 1, borderTopColor: C.creamDark, marginVertical: 8 },

  // ── Contexto reconocido ─────────────────────────────────────
  contextoCaja: {
    backgroundColor: C.navyMid,
    borderRadius: 5,
    padding: 10,
    marginBottom: 6,
  },
  contextoTxt: { fontSize: 8.5, lineHeight: 1.6, color: C.cream },

  // ── Micro-ikigai ────────────────────────────────────────────
  microCaja: {
    backgroundColor: C.cream,
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: C.amber,
    marginBottom: 6,
  },
  microTxt: { fontSize: 8.5, lineHeight: 1.6, color: C.textMid },

  // ── Frase final ─────────────────────────────────────────────
  fraseBox: {
    backgroundColor: C.navy, borderRadius: 10,
    padding: 22, alignItems: 'center', marginBottom: 12,
  },
  fraseLabel: { color: C.amberLight, fontSize: 7.5, letterSpacing: 1.5, marginBottom: 6 },
  fraseTxt:   { color: C.white, fontSize: 13.5, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', lineHeight: 1.55 },

  // ── Footer fijo ─────────────────────────────────────────────
  footer: {
    position: 'absolute', bottom: 18, left: 44, right: 44,
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: C.creamDark, paddingTop: 6,
  },
  footerTxt: { fontSize: 7, color: C.textLight },
})

// ── Componente principal ─────────────────────────────────────
export function ReportePDF({ content, generatedAt, modelUsed }) {
  const fecha = generatedAt
    ? new Date(generatedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document title="Mi Reporte Zenit" author="Zenit">
      <Page size="A4" style={s.pagina}>

        {/* ── Hero: Arquetipo + Ikigai central + Frase ─────── */}
        <View style={s.hero} wrap={false}>
          <Text style={s.heroLabel}>TU ARQUETIPO</Text>
          <Text style={s.heroArquetipo}>{content.arquetipo?.nombre}</Text>
          <Text style={s.heroTexto}>{content.ikigai_central}</Text>
          <View style={s.heroDivider} />
          <Text style={s.heroFraseLabel}>Tu frase</Text>
          <Text style={s.heroFrase}>"{content.frase_cierre}"</Text>
        </View>

        {/* ── Para quién ───────────────────────────────────── */}
        {content.para_quien && (
          <Seccion num="1" titulo="Para quien es tu proposito">
            <View style={s.microCaja} wrap={false}>
              <Text style={s.microTxt}>{content.para_quien}</Text>
            </View>
          </Seccion>
        )}

        {/* ── Contexto reconocido ──────────────────────────── */}
        {content.contexto_reconocido && (
          <Seccion num="2" titulo="Tu contexto real">
            <View style={s.contextoCaja} wrap={false}>
              <Text style={s.contextoTxt}>{content.contexto_reconocido}</Text>
            </View>
          </Seccion>
        )}

        {/* ── Sección: 4 Círculos ──────────────────────────── */}
        <Seccion num="3" titulo="Analisis de tus 4 Circulos">
          <View style={s.circulo} wrap={false}>
            <Text style={s.circuloTit}>Lo que Amas</Text>
            <Text style={s.circuloTxt}>{content.analisis_circulos?.lo_que_amas}</Text>
          </View>
          <View style={s.circulo} wrap={false}>
            <Text style={s.circuloTit}>En lo que Eres Bueno</Text>
            <Text style={s.circuloTxt}>{content.analisis_circulos?.en_lo_que_eres_bueno}</Text>
          </View>
          <View style={s.circulo} wrap={false}>
            <Text style={s.circuloTit}>Por lo que te Pueden Pagar</Text>
            <Text style={s.circuloTxt}>{content.analisis_circulos?.por_lo_que_te_pueden_pagar}</Text>
          </View>
          <View style={s.circulo} wrap={false}>
            <Text style={s.circuloTit}>Lo que el Mundo Necesita</Text>
            <Text style={s.circuloTxt}>{content.analisis_circulos?.lo_que_el_mundo_necesita}</Text>
          </View>
        </Seccion>

        {/* ── Sección: Intersecciones ──────────────────────── */}
        <Seccion num="4" titulo="Las 4 Intersecciones de tu Ikigai">
          <View style={s.grid2}>
            <View style={s.gridItem} wrap={false}>
              <Text style={s.gridBadge}>PASION</Text>
              <Text style={s.gridTitulo}>Pasion</Text>
              <Text style={s.gridSub}>Amas + Eres bueno</Text>
              <Text style={s.gridTxt}>{content.intersecciones?.pasion}</Text>
            </View>
            <View style={s.gridItem} wrap={false}>
              <Text style={s.gridBadge}>MISION</Text>
              <Text style={s.gridTitulo}>Mision</Text>
              <Text style={s.gridSub}>Amas + Mundo necesita</Text>
              <Text style={s.gridTxt}>{content.intersecciones?.mision}</Text>
            </View>
            <View style={s.gridItem} wrap={false}>
              <Text style={s.gridBadge}>VOCACION</Text>
              <Text style={s.gridTitulo}>Vocacion</Text>
              <Text style={s.gridSub}>Eres bueno + Mundo necesita</Text>
              <Text style={s.gridTxt}>{content.intersecciones?.vocacion}</Text>
            </View>
            <View style={s.gridItem} wrap={false}>
              <Text style={s.gridBadge}>PROFESION</Text>
              <Text style={s.gridTitulo}>Profesion</Text>
              <Text style={s.gridSub}>Eres bueno + Te pagan</Text>
              <Text style={s.gridTxt}>{content.intersecciones?.profesion}</Text>
            </View>
          </View>
        </Seccion>

        {/* ── Sección: Arquetipo ───────────────────────────── */}
        <Seccion num="5" titulo="Tu Arquetipo">
          <View style={{ alignItems: 'center', paddingVertical: 8 }} wrap={false}>
            <Text style={s.arquetipoNombre}>{content.arquetipo?.nombre}</Text>
            <Text style={s.arquetipoDesc}>{content.arquetipo?.descripcion}</Text>
          </View>
        </Seccion>

        {/* ── Sección: Alertas ─────────────────────────────── */}
        <Seccion num="6" titulo="Alertas: Caminos que Probablemente no son para Ti">
          {(content.alertas || []).map((alerta, i) => (
            <View key={i} style={s.alertaItem} wrap={false}>
              <Text style={s.alertaBullet}>!</Text>
              <Text style={s.alertaTxt}>{alerta}</Text>
            </View>
          ))}
        </Seccion>

        {/* ── Sección: Habilidades ─────────────────────────── */}
        <Seccion num="7" titulo="Habilidades que Debes Desarrollar">
          {(content.habilidades || []).map((h, i) => (
            <View key={i} style={s.habilidadItem} wrap={false}>
              <View style={s.habilidadHeader}>
                <Text style={s.habilidadNum}>{i + 1}</Text>
                <Text style={s.habilidadNombre}>{h.nombre}</Text>
              </View>
              <Text style={s.habilidadLabel}>
                Por que:{' '}
                <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{h.por_que}</Text>
              </Text>
              <Text style={[s.habilidadLabel, { marginTop: 3 }]}>
                Como:{' '}
                <Text style={{ fontFamily: 'Helvetica', fontSize: 8 }}>{h.como}</Text>
              </Text>
            </View>
          ))}
        </Seccion>

        {/* ── Sección: Hoja de Ruta ────────────────────────── */}
        <Seccion num="8" titulo="Tu Hoja de Ruta a 180 Dias">

          <View wrap={false}>
            <View style={s.periodoHeader}>
              <Text style={s.periodoTag}>30 DIAS</Text>
              <Text style={s.periodoTitulo}>Primeros pasos</Text>
            </View>
            {(content.hoja_de_ruta?.dias_30 || []).map((a, i) => (
              <View key={i} style={s.accion}>
                <Text style={s.accionFlecha}>{'->'}</Text>
                <Text style={s.accionTxt}>{a}</Text>
              </View>
            ))}
          </View>

          <View style={s.dividerRuta} />

          <View wrap={false}>
            <View style={s.periodoHeader}>
              <Text style={s.periodoTag}>90 DIAS</Text>
              <Text style={s.periodoTitulo}>Construyendo momentum</Text>
            </View>
            {(content.hoja_de_ruta?.dias_90 || []).map((a, i) => (
              <View key={i} style={s.accion}>
                <Text style={s.accionFlecha}>{'->'}</Text>
                <Text style={s.accionTxt}>{a}</Text>
              </View>
            ))}
          </View>

          <View style={s.dividerRuta} />

          <View wrap={false}>
            <View style={s.periodoHeader}>
              <Text style={s.periodoTag}>180 DIAS</Text>
              <Text style={s.periodoTitulo}>El gran salto</Text>
            </View>
            {(content.hoja_de_ruta?.dias_180 || []).map((a, i) => (
              <View key={i} style={s.accion}>
                <Text style={s.accionFlecha}>{'->'}</Text>
                <Text style={s.accionTxt}>{a}</Text>
              </View>
            ))}
          </View>

        </Seccion>

        {/* ── Micro-ikigai ─────────────────────────────────── */}
        {content.micro_ikigai && (
          <Seccion num="9" titulo="Tu Ikigai de Hoy">
            <View style={s.microCaja} wrap={false}>
              <Text style={s.microTxt}>{content.micro_ikigai}</Text>
            </View>
          </Seccion>
        )}

        {/* ── Frase final ──────────────────────────────────── */}
        <View style={s.fraseBox} wrap={false}>
          <Text style={s.fraseLabel}>TU FRASE</Text>
          <Text style={s.fraseTxt}>"{content.frase_cierre}"</Text>
        </View>

        {/* ── Branding ─────────────────────────────────────── */}
        <View style={{ alignItems: 'center' }} wrap={false}>
          <Text style={{ fontSize: 7, color: C.textLight }}>
            Reporte generado por zenit  |  {fecha}
          </Text>
        </View>

        {/* ── Footer fijo en cada página ───────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>zenit  |  Reporte de proposito de vida  |  {fecha}</Text>
          <Text
            style={s.footerTxt}
            render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} de ${totalPages}`}
          />
        </View>

      </Page>
    </Document>
  )
}

// ── Componente Sección ───────────────────────────────────────
function Seccion({ num, titulo, children }) {
  return (
    <View style={s.seccion}>
      <View style={s.seccionHeader} wrap={false}>
        <View style={s.seccionBadge}>
          <Text style={s.seccionBadgeNum}>{num}</Text>
        </View>
        <View>
          <Text style={s.seccionLabel}>SECCION {num}</Text>
          <Text style={s.seccionTitulo}>{titulo}</Text>
        </View>
      </View>
      <View style={s.seccionBody}>{children}</View>
    </View>
  )
}
