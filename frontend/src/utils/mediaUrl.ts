export function resolveMediaUrl(path: string | null | undefined, apiBaseUrl?: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/")) {
    return apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, "")}${path}` : path;
  }
  return apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}` : path;
}
