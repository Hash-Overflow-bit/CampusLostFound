// UX/accidental-repeat protection only. Security rate limits must be enforced server-side/provider-side.
const PREFIX = "clf:auth-cooldown:";

export function getCooldownRemaining(key) {
  const expiresAt = Number(sessionStorage.getItem(`${PREFIX}${key}`) || 0);
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}

export function startCooldown(key, seconds) {
  const duration = Math.max(1, Number(seconds) || 1);
  sessionStorage.setItem(`${PREFIX}${key}`, String(Date.now() + duration * 1000));
  return duration;
}

export function assertCooldownReady(key) {
  const remaining = getCooldownRemaining(key);
  if (remaining > 0) {
    const error = new Error(`Please wait ${remaining} seconds before trying again.`);
    error.code = "client-cooldown";
    throw error;
  }
}
