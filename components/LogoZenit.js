// Logo Zenit — usa las imágenes PNG oficiales del brand

export function ZenitIcon({ size = 32, className = '' }) {
  return (
    <img
      src="/logo-icon.png"
      alt="Zenit"
      className={className}
      style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block' }}
    />
  )
}

export function ZenitLogo({ size = 28, className = '', showText = true }) {
  if (showText) {
    // Usa el wordmark completo (ícono + texto)
    return (
      <img
        src="/logo-wordmark.png"
        alt="Zenit"
        className={className}
        style={{ height: size, width: 'auto', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }}
      />
    )
  }

  // Solo ícono
  return (
    <img
      src="/logo-icon.png"
      alt="Zenit"
      className={className}
      style={{ width: size, height: size, objectFit: 'contain', display: 'inline-block' }}
    />
  )
}
