/**
 * Tempos de expiração para o cache em milissegundos
 */
export enum CacheTTL {
  /** Cache curto: 30 segundos (30.000 ms) */
  SHORT = 30_000,
  /** Cache padrão: 1 minuto (60.000 ms) */
  DEFAULT = 60_000,
  /** Cache médio: 5 minutos (300.000 ms) */
  MEDIUM = 5 * 60_000,
  /** Cache médio: 10 minutos (600.000 ms) */
  LONG = 10 * 60_000,
  /** Cache extra longo: 30 minutos (1.800.000 ms) */
  XLONG = 30 * 60_000,
  /** Cache por 1 hora (3.600.000 ms) */
  HOUR = 60 * 60_000,
}

/**
 * Tamanhos máximos de arquivos em bytes
 */
export enum FileSizeLimit {
  /** Tamanho pequeno: 5MB (5 * 1024 * 1024 bytes) */
  SMALL = 5 * 1024 * 1024,
  /** Tamanho padrão: 10MB (10 * 1024 * 1024 bytes) */
  DEFAULT = 10 * 1024 * 1024,
  /** Tamanho padrão: 25MB (25 * 1024 * 1024 bytes) */
  MEDIUM = 25 * 1024 * 1024,
  /** Tamanho padrão: 50MB (50 * 1024 * 1024 bytes) */
  LARGE = 50 * 1024 * 1024,
}

/**
 * Extensões de vídeos suportadas para upload.
 */
export enum SupportedVideoExtensions {
  //* Fortmato de vídeo .mp4
  MP4 = 'video/mp4',
  //* Fortmato de vídeo .mkv
  MKV = 'video/x-matroska',
  //* Fortmato de vídeo .webm
  WEBM = 'video/webm',
  //* Fortmato de vídeo .mov
  MOV = 'video/quicktime',
  //* Fortmato de vídeo .avi
  AVI = 'video/x-msvideo',
  //* Fortmato de vídeo .flv
  FLV = 'video/x-flv',
  //* Fortmato de vídeo .m4v
  M4V = 'video/x-m4v',
}
