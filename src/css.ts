import type { Style} from './types'
import  { cache} from './cache'
import  { toHash} from './hash'
import  { parse} from './parse'
import  { sheet} from './sheet'

/**
 * css entry
 */
function css(css: Style, global?: boolean, keyframes?: boolean) {
    let stringified = JSON.stringify(css);
    // Get a string representation of the object that is called 'compiled'
    // Retrieve the className from cache or hash it in place
    let className = toHash(stringified);

    // If there's no entry for the current className
    if (cache.indexOf(stringified) == -1) {
        parse(
            // For keyframes
            keyframes ? { ['@keyframes ' + className]: css } : css,
            global ? '' : '.' + className
        ).forEach((rule) => sheet.insertRule(rule));
        cache.push(stringified);
    }

    return className;
}

/**
 * CSS Global function to declare global styles
 * @type {Function}
 */
let glob = (styles: Style) => css(styles, !0);

/**
 * `keyframes` function for defining animations
 * @type {Function}
 */
let keyframes = (styles: Style) => css(styles, !1, !0);

export { css, glob, keyframes };
