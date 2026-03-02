import { timingSafeEqual } from '@std/crypto';

/**
 * Securely verifies a token using constant-time comparison.
 *
 * @returns `true` if tokens match, `false` otherwise
 */
export const compareToken = (
  incomingToken: string,
  expectedToken: string
): boolean => {
  // Encode strings to Uint8Array for comparison
  const encoder = new TextEncoder();
  const expectedBytes = encoder.encode(expectedToken);
  const incomingBytes = encoder.encode(incomingToken);

  // Compare lengths first (not security critical but efficient)
  if (expectedBytes.length !== incomingBytes.length) {
    return false;
  }

  // Constant-time comparison (CRITICAL for security)
  return timingSafeEqual(expectedBytes, incomingBytes);
};
