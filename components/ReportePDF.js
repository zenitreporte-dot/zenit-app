// ============================================================
// Componente PDF del reporte IkigAI — v4
// Enfoque: flujo único auto-paginado, wrap={false} por bloque
// Sin emojis, Helvetica built-in, sin Page explícitos múltiples
// ============================================================
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// No se necesita Font.register — usamos Helvetica built-in
export function registerLatoFonts() { /* no-op */ }

const C = {
  morado:     '#2E2060',
  purpura:    '#534AB7',
  lila:       '#EEEDFE',
  gris:       '#6B7280',
  grisClaro:  '#F9FAFB',
  grisBorde:  '#E5E7EB',
  negro:      '#111827',
  texto:      '#374151',
}

const s = StyleSheet.create({

  // ── Página ──────────────────────────────────────────────────
  pagina: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingTop: 38,
    paddingBottom: 54,
    paddingHorizontal: 44,
  },

  // ── Hero ────────────────────────────────────────────────────
  hero: {
    backgroundColor: C.morado,
    borderRadius: 10,
    padding: 24,
    marginBottom: 14,
  },
  heroLabel:     { color: '#A5B4FC', fontSize: 7.5, letterSpacing: 2, marginBottom: 6 },
  heroArquetipo: { color: '#FFFFFF', fontSize: 21, fontFamily: 'Helvetica-Bold', marginBottom: 10, lineHeight: 1.3 },
  heroTexto:     { color: '#E0E7FF', fontSize: 9.5, lineHeight: 1.7, marginBottom: 12 },
  heroDivider:   { borderTopWidth: 1, borderTopColor: '#4338CA', marginBottom: 10 },
  heroFraseLabel:{ color: '#A5B4FC', fontSize: 7.5, marginBottom: 4 },
  heroFrase:     { color: '#FFFFFF', fontSize: 11, fontFamily: 'Helvetica-Oblique', lineHeight: 1.5 },

  // ── Sección contenedor ──────────────────────────────────────
  seccion: {
    marginBottom: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: C.grisBorde,
    overflow: 'hidden',
  },
  seccionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  seccionBadge: {
    width: 22,
    height: 22,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seccionBadgeNum:  { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#FFFFFF' },
  seccionLabel:     { fontSize: 7, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 1 },
  seccionTitulo:    { fontSize: 11.5, fontFamily: 'Helvetica-Bold' },
  seccionBody:      { padding: 12, paddingTop: 10, backgroundColor: '#FFFFFF' },

  // ── Círculos ────────────────────────────────────────────────
  circulo: { borderRadius: 5, padding: 9, marginBottom: 6 },
  circuloTit: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  circuloTxt: { fontSize: 8.5, lineHeight: 1.6, color: C.texto },

  // ── Grid 2 columnas ─────────────────────────────────────────
  grid2:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  gridItem: {
    width: '48.4%',
    backgroundColor: C.grisClaro,
    borderRadius: 5,
    padding: 9,
    borderWidth: 1,
    borderColor: C.grisBorde,
  },
  gridBadge: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  gridTitulo: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.negro, marginBottom: 1 },
  gridSub:    { fontSize: 7.5, color: C.gris, marginBottom: 4 },
  gridTxt:    { fontSize: 8.5, lineHeight: 1.6, color: C.texto },

  // ── Arquetipo ───────────────────────────────────────────────
  arquetipoNombre: {
    fontSize: 17, fontFamily: 'Helvetica-Bold',
    color: '#D97706', textAlign: 'center', marginBottom: 8,
  },
  arquetipoDesc: { fontSize: 9, lineHeight: 1.7, textAlign: 'center', color: C.texto },

  // ── Alertas ─────────────────────────────────────────────────
  alertaItem: {
    flexDirection: 'row',
    gap: 7,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 5,
    padding: 9,
    marginBottom: 6,
  },
  alertaBullet: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#DC2626', width: 12 },
  alertaTxt:    { fontSize: 8.5, lineHeight: 1.6, color: C.texto, flex: 1 },

  // ── Habilidades ─────────────────────────────────────────────
  habilidadItem: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 5,
    padding: 9,
    marginBottom: 6,
  },
  habilidadHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  habilidadNum: {
    width: 18, height: 18, backgroundColor: '#1D4ED8', borderRadius: 9,
    fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#FFFFFF',
    textAlign: 'center', paddingTop: 3,
  },
  habilidadNombre: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#1E3A8A' },
  habilidadLabel:  { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.texto, marginBottom: 1 },
  habilidadTxt:    { fontSize: 8, lineHeight: 1.55, color: C.texto },

  // ── Hoja de ruta ────────────────────────────────────────────
  periodoHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5, marginTop: 2 },
  periodoTag: {
    fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#FFFFFF',
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 3,
  },
  periodoTitulo: { fontSize: 9.5, fontFamily: 'Helvetica-Bold' },
  accion:        { flexDirection: 'row', gap: 5, marginBottom: 4 },
  accionFlecha:  { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  accionTxt:     { fontSize: 8.5, lineHeight: 1.55, color: C.texto, flex: 1 },
  dividerRuta:   { borderTopWidth: 1, borderTopColor: '#E9D5FF', marginVertical: 8 },

  // ── Frase final ─────────────────────────────────────────────
  fraseBox: {
    backgroundColor: C.morado, borderRadius: 10,
    padding: 22, alignItems: 'center', marginBottom: 12,
  },
  fraseLabel: { color: '#A5B4FC', fontSize: 7.5, letterSpacing: 1.5, marginBottom: 6 },
  fraseTxt:   { color: '#FFFFFF', fontSize: 13.5, fontFamily: 'Helvetica-BoldOblique', textAlign: 'center', lineHeight: 1.55 },

  // ── Footer fijo ─────────────────────────────────────────────
  footer: {
    position: 'absolute', bottom: 18, left: 44, right: 44,
    flexDirection: 'row', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: C.grisBorde, paddingTop: 6,
  },
  footerTxt: { fontSize: 7, color: C.gris },
})

// ── Componente principal ─────────────────────────────────────
export function ReportePDF({ content, generatedAt, modelUsed }) {
  const fecha = generatedAt
    ? new Date(generatedAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Document title="Mi Reporte IkigAI" author="IkigAI">
      <Page size="A4" style={s.pagina}>

        {/* ── Hero: Arquetipo + Ikigai central + Frase ─────── */}
        <View style={s.hero} wrap={false}>
          <Text style={s.heroLabel}>TU ARQUETIPO IKIGAI</Text>
          <Text style={s.heroArquetipo}>{content.arquetipo?.nombre}</Text>
          <Text style={s.heroTexto}>{content.ikigai_central}</Text>
          <View style={s.heroDivider} />
          <Text style={s.heroFraseLabel}>Tu frase Ikigai</Text>
          <Text style={s.heroFrase}>"{content.frase_cierre}"</Text>
        </View>

        {/* ── Sección 1: 4 Círculos ────────────────────────── */}
        <Seccion num="1" color="#C2185B" fondo="#FFF0F5" titulo="Analisis de tus 4 Circulos">
          <View style={[s.circulo, { backgroundColor: '#F4C0D330' }]} wrap={false}>
            <Text style={[s.circuloTit, { color: '#8B1A4A' }]}>Lo que Amas</Text>
            <Text style={s.circuloTxt}>{content.analisis_circulos?.lo_que_amas}</Text>
          </View>
          <View style={[s.circulo, { backgroundColor: '#B5D4F430' }]} wrap={false}>
            <Text style={[s.circuloTit, { color: '#1A4A8B' }]}>En lo que Eres Bueno</Text>
            <Text style={s.circuloTxt}>{content.analisis_circulos?.en_lo_que_eres_bueno}</Text>
          </View>
          <View style={[s.circulo, { backgroundColor: '#C0DD9730' }]} wrap={false}>
            <Text style={[s.circuloTit, { color: '#2D5A1A' }]}>Por lo que te Pueden Pagar</Text>
            <Text style={s.circuloTxt}>{content.analisis_circulos?.por_lo_que_te_pueden_pagar}</Text>
          </View>
          <View style={[s.circulo, { backgroundColor: '#FAC77530' }]} wrap={false}>
            <Text style={[s.circuloTit, { color: '#8B5A1A' }]}>Lo que el Mundo Necesita</Text>
            <Text style={s.circuloTxt}>{content.analisis_circulos?.lo_que_el_mundo_necesita}</Text>
          </View>
        </Seccion>

        {/* ── Sección 2: Intersecciones ────────────────────── */}
        <Seccion num="2" color="#388E3C" fondo="#F1F8E9" titulo="Las 4 Intersecciones de tu Ikigai">
          <View style={s.grid2}>
            <View style={s.gridItem} wrap={false}>
              <Text style={[s.gridBadge, { backgroundColor: '#DC2626' }]}>PASION</Text>
              <Text style={s.gridTitulo}>Pasion</Text>
              <Text style={s.gridSub}>Amas + Eres bueno</Text>
              <Text style={s.gridTxt}>{content.intersecciones?.pasion}</Text>
            </View>
            <View style={s.gridItem} wrap={false}>
              <Text style={[s.gridBadge, { backgroundColor: '#7C3AED' }]}>MISION</Text>
              <Text style={s.gridTitulo}>Mision</Text>
              <Text style={s.gridSub}>Amas + Mundo necesita</Text>
              <Text style={s.gridTxt}>{content.intersecciones?.mision}</Text>
            </View>
            <View style={s.gridItem} wrap={false}>
              <Text style={[s.gridBadge, { backgroundColor: '#059669' }]}>VOCACION</Text>
              <Text style={s.gridTitulo}>Vocacion</Text>
              <Text style={s.gridSub}>Eres bueno + Mundo necesita</Text>
              <Text style={s.gridTxt}>{content.intersecciones?.vocacion}</Text>
            </View>
            <View style={s.gridItem} wrap={false}>
              <Text style={[s.gridBadge, { backgroundColor: '#D97706' }]}>PROFESION</Text>
              <Text style={s.gridTitulo}>Profesion</Text>
              <Text style={s.gridSub}>Eres bueno + Te pagan</Text>
              <Text style={s.gridTxt}>{content.intersecciones?.profesion}</Text>
            </View>
          </View>
        </Seccion>

        {/* ── Sección 3: Arquetipo ─────────────────────────── */}
        <Seccion num="3" color="#F57C00" fondo="#FFF8E1" titulo="Tu Arquetipo">
          <View style={{ alignItems: 'center', paddingVertical: 8 }} wrap={false}>
            <Text style={s.arquetipoNombre}>{content.arquetipo?.nombre}</Text>
            <Text style={s.arquetipoDesc}>{content.arquetipo?.descripcion}</Text>
          </View>
        </Seccion>

        {/* ── Sección 4: Alertas ───────────────────────────── */}
        <Seccion num="4" color="#D32F2F" fondo="#FFF5F5" titulo="Alertas: Caminos que Probablemente no son para Ti">
          {(content.alertas || []).map((alerta, i) => (
            <View key={i} style={s.alertaItem} wrap={false}>
              <Text style={s.alertaBullet}>!</Text>
              <Text style={s.alertaTxt}>{alerta}</Text>
            </View>
          ))}
        </Seccion>

        {/* ── Sección 5: Habilidades ───────────────────────── */}
        <Seccion num="5" color="#1565C0" fondo="#E3F2FD" titulo="Habilidades que Debes Desarrollar">
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

        {/* ── Sección 6: Hoja de Ruta ──────────────────────── */}
        <Seccion num="6" color={C.morado} fondo={C.lila} titulo="Tu Hoja de Ruta a 180 Dias">

          <View wrap={false}>
            <View style={s.periodoHeader}>
              <Text style={[s.periodoTag, { backgroundColor: C.purpura }]}>30 DIAS</Text>
              <Text style={[s.periodoTitulo, { color: C.purpura }]}>Primeros pasos</Text>
            </View>
            {(content.hoja_de_ruta?.dias_30 || []).map((a, i) => (
              <View key={i} style={s.accion}>
                <Text style={[s.accionFlecha, { color: C.purpura }]}>{'->'}</Text>
                <Text style={s.accionTxt}>{a}</Text>
              </View>
            ))}
          </View>

          <View style={s.dividerRuta} />

          <View wrap={false}>
            <View style={s.periodoHeader}>
              <Text style={[s.periodoTag, { backgroundColor: '#388E3C' }]}>90 DIAS</Text>
              <Text style={[s.periodoTitulo, { color: '#388E3C' }]}>Construyendo momentum</Text>
            </View>
            {(content.hoja_de_ruta?.dias_90 || []).map((a, i) => (
              <View key={i} style={s.accion}>
                <Text style={[s.accionFlecha, { color: '#388E3C' }]}>{'->'}</Text>
                <Text style={s.accionTxt}>{a}</Text>
              </View>
            ))}
          </View>

          <View style={s.dividerRuta} />

          <View wrap={false}>
            <View style={s.periodoHeader}>
              <Text style={[s.periodoTag, { backgroundColor: '#F57C00' }]}>180 DIAS</Text>
              <Text style={[s.periodoTitulo, { color: '#F57C00' }]}>El gran salto</Text>
            </View>
            {(content.hoja_de_ruta?.dias_180 || []).map((a, i) => (
              <View key={i} style={s.accion}>
                <Text style={[s.accionFlecha, { color: '#F57C00' }]}>{'->'}</Text>
                <Text style={s.accionTxt}>{a}</Text>
              </View>
            ))}
          </View>

        </Seccion>

        {/* ── Frase final ──────────────────────────────────── */}
        <View style={s.fraseBox} wrap={false}>
          <Text style={s.fraseLabel}>TU FRASE IKIGAI</Text>
          <Text style={s.fraseTxt}>"{content.frase_cierre}"</Text>
        </View>

        {/* ── Branding ─────────────────────────────────────── */}
        <View style={{ alignItems: 'center' }} wrap={false}>
          <Text style={{ fontSize: 7, color: C.gris }}>
            Reporte generado por IkigAI  |  {fecha}  |  Modelo: {modelUsed}
          </Text>
        </View>

        {/* ── Footer fijo en cada página ───────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>IkigAI  |  Reporte de proposito de vida  |  {fecha}</Text>
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
function Seccion({ num, color, fondo, titulo, children }) {
  return (
    <View style={s.seccion}>
      <View style={[s.seccionHeader, { backgroundColor: fondo }]} wrap={false}>
        <View style={[s.seccionBadge, { backgroundColor: color }]}>
          <Text style={s.seccionBadgeNum}>{num}</Text>
        </View>
        <View>
          <Text style={[s.seccionLabel, { color }]}>SECCION {num}</Text>
          <Text style={[s.seccionTitulo, { color }]}>{titulo}</Text>
        </View>
      </View>
      <View style={s.seccionBody}>{children}</View>
    </View>
  )
}
