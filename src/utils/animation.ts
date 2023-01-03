/**
 * Provides a smoothstep value given a from, a to
 * and a timeline seeker
 * @param {number} from
 * @param {number} to
 * @param {number} value
 * @returns
 */
export const smoothstep = (from: number, to: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return x * x * (3 - 2 * x);
};



export class AnimationStore {
    
}
