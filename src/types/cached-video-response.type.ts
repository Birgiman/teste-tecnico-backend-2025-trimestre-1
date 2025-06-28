export interface CachedFromRedis {
  buffer: Buffer;
  path?: never;
  size?: never;
}

export interface CachedFromDisk {
  buffer?: never;
  path: string;
  size: number;
}

export type CachedVideoResponse = CachedFromRedis | CachedFromDisk;
