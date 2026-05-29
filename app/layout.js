import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Zenit — Descubre tu propósito de vida en 20 minutos',
  description: 'Responde 20 preguntas. La IA analiza todo y te entrega un reporte 100% tuyo con tu propósito de vida, tus fortalezas reales y una hoja de ruta a 180 días. Solo $25.000 COP.',
  openGraph: {
    title: 'Zenit — Conócete en 20 minutos.',
    description: 'Reporte de propósito de vida con IA · $25.000 COP',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${dmSerif.variable} ${dmSans.variable} font-sans antialiased bg-zenit-navy text-zenit-cream`}>
        {children}
      </body>
    </html>
  )
}
