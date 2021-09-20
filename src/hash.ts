
/**
 * Transforms the input into a className.
 * The multiplication constant 101 is selected to be a prime,
 * as is the initial value of 11.
 * The intermediate and final results are truncated into 32-bit
 * unsigned integers.
 * @param  str
 * @returns string
 */
 export let toHash = (str: string) => 'zs' + Array.from(str).reduce((p, c, i) => (101 * p + c.charCodeAt(0)) >>> 0, 11)


