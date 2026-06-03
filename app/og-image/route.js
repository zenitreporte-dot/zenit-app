import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1b2e',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Círculo decorativo fondo */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
        }} />

        {/* Logo texto */}
        <div style={{
          color: '#c9a84c',
          fontSize: '28px',
          letterSpacing: '6px',
          textTransform: 'uppercase',
          marginBottom: '32px',
          fontWeight: '400',
          display: 'flex',
        }}>
          ZENIT
        </div>

        {/* Título principal */}
        <div style={{
          color: '#f5f0e8',
          fontSize: '64px',
          fontWeight: '400',
          textAlign: 'center',
          lineHeight: '1.2',
          marginBottom: '24px',
          maxWidth: '900px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          Descubre a qué viniste a este mundo.
        </div>

        {/* Subtítulo */}
        <div style={{
          color: '#f5f0e8',
          opacity: 0.5,
          fontSize: '24px',
          textAlign: 'center',
          marginBottom: '48px',
          maxWidth: '700px',
          display: 'flex',
        }}>
          20 preguntas · IA analiza todo · Reporte 100% tuyo
        </div>

        {/* CTA pill */}
        <div style={{
          background: '#c9a84c',
          color: '#1a1b2e',
          fontSize: '20px',
          fontWeight: '700',
          padding: '16px 48px',
          borderRadius: '50px',
          display: 'flex',
        }}>
          $25.000 COP · Descarga inmediata
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          color: '#f5f0e8',
          opacity: 0.2,
          fontSize: '18px',
          display: 'flex',
        }}>
          zenitcol.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
