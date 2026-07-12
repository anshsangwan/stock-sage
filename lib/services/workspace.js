import { createHash } from 'crypto';

/**
 * Derives a deterministic workspace ID from a raw API key.
 *
 * Ref: ANTIGRAVITY_SPEC §7 — Workspace Isolation
 * - The raw API key is NEVER stored.
 * - A SHA-256 hash is used as the workspace_id.
 * - All report history is scoped to the workspace.
 *
 * @param {string} apiKey — The user's raw Gemini API key.
 * @returns {string} — Hex-encoded SHA-256 hash.
 */
export function deriveWorkspaceId(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('API key is required to derive workspace ID');
  }

  return createHash('sha256').update(apiKey).digest('hex');
}
