export interface PendingFile {
  name: string;
  buffer: ArrayBuffer;
}

let pending: PendingFile | null = null;

export function setPendingFile(file: PendingFile) {
  pending = file;
}

export function getPendingFile(): PendingFile | null {
  return pending;
}

export function clearPendingFile() {
  pending = null;
}
