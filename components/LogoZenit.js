// Logo Zenit — usa las imágenes PNG oficiales del brand

export function ZenitIcon({ size = 32, className = '' }) {
  return (
    <img
      src="/logo-icon.png"
      alt="Zenit"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
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
        height={size}
        className={className}
        style={{ objectFit: 'contain', width: 'auto' }}
      />
    )
  }

  // Solo ícono
  return (
    <img
      src="/logo-icon.png"
      alt="Zenit"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
