import type { Style } from './types';
/**
 * css entry
 */
declare function css(css: Style, global?: boolean, keyframes?: boolean): string;
/**
 * CSS Global function to declare global styles
 * @type {Function}
 */
declare let glob: (styles: Style) => string;
/**
 * `keyframes` function for defining animations
 * @type {Function}
 */
declare let keyframes: (styles: Style) => string;
export { css, glob, keyframes };
