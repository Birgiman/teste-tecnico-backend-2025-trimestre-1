export interface VideoFileInfo {
  filename?: string;
  mimetype?: string;
  size: number;
  path: string;
}

export interface VideoFileWithBuffer {
  filename?: string;
  mimetype?: string;
  size?: number;
  path?: string;
  buffer: Buffer;
}
