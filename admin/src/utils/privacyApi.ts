export const apiRoot = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "").replace(/\/(admins|publishers|viewers)$/, "");

export async function privacyRequest<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${apiRoot}/privacy${path}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "The request could not be completed. Please try again.");
  return data as T;
}
