/**
 * Converts μ-law 8-bit 8000 Hz audio to PCM 16-bit 16000 Hz in real-time.
 *
 * @param ulawChunk - The incoming μ-law buffer chunk (Uint8Array).
 * @returns Int16Array - The resampled PCM16 buffer chunk.
 */
export function resampleUlawToPcm16(ulawChunk: Uint8Array): Int16Array {
  // μ-law to PCM lookup table
  const MULAW_MAX = 0x1fff;
  const BIAS = 0x84;
  const EXP_TABLE = [0, 132, 396, 924, 1980, 4092, 8316, 16764];

  // Step 1: Decode μ-law to PCM16
  const pcm16Buffer = new Int16Array(ulawChunk.length);
  for (let i = 0; i < ulawChunk.length; i++) {
    const ulawByte = ~ulawChunk[i];
    const sign = ulawByte & 0x80;
    const exponent = (ulawByte >> 4) & 0x07;
    const mantissa = ulawByte & 0x0f;
    let sample = EXP_TABLE[exponent] + (mantissa << (exponent + 3));
    if (sign !== 0) sample = -sample;
    pcm16Buffer[i] = sample;
  }

  // Step 2: Resample from 8000 Hz to 16000 Hz
  const ratio = 2; // 16000 / 8000
  const resampledLength = pcm16Buffer.length * ratio;
  const resampledPcm16Buffer = new Int16Array(resampledLength);

  for (let i = 0; i < resampledLength; i++) {
    const index = i / ratio;
    const indexBefore = Math.floor(index);
    const indexAfter = Math.min(indexBefore + 1, pcm16Buffer.length - 1);

    // Linear interpolation
    const sampleBefore = pcm16Buffer[indexBefore];
    const sampleAfter = pcm16Buffer[indexAfter];
    resampledPcm16Buffer[i] = sampleBefore + (sampleAfter - sampleBefore) * (index - indexBefore);
  }

  return resampledPcm16Buffer;
}
