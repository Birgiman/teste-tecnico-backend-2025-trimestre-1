export interface CachedFromRedis {
  buffer: Buffer;
  path?: never;
  size?: never;
  fromCache: true;
}

export interface CachedFromDisk {
  buffer?: never;
  path: string;
  size: number;
  fromCache?: false;
}

export type CachedVideoResponse = CachedFromRedis | CachedFromDisk;
