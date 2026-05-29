// Logo Zenit — Monograma ZI con strokes redondeados
// Dos variantes: ZenitIcon (solo ícono) y ZenitLogo (ícono + wordmark)
// Usa currentColor para adaptarse a cualquier contexto

export function ZenitIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Z — barra superior */}
      <line
        x1="14" y1="18"
        x2="78" y2="18"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Z — diagonal principal (↗ → ↙) */}
      <line
        x1="78" y1="18"
        x2="22" y2="82"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Z — barra inferior */}
      <line
        x1="22" y1="82"
        x2="86" y2="82"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* I — diagonal secundaria (↖ → ↘), crea el monograma ZI */}
      <line
        x1="32" y1="18"
        x2="68" y2="82"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ZenitLogo({ size = 28, className = '', showText = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ZenitIcon size={size} />
      {showText && (
        <span
          style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: size * 0.88,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          zenit
        </span>
      )}
    </span>
  )
}
