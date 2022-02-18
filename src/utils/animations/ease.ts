/**
 *
 * @param {number} t current time
 * @param {number} b start value
 * @param {number} c change in value
 * @param {number} d duration
 */

export function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
        return (c / 2) * t * t * t + b;
    }
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
}
