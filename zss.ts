import type {
    PropertiesFallback,
    PropertiesHyphenFallback,
    SimplePseudos,
} from 'csstype';

export interface Properties
    extends PropertiesFallback<string | number, string | number>,
        PropertiesHyphenFallback<string | number, string | number> {
    [key: string]:
        | string
        | number
        | (string | number | undefined)[]
        | Properties
        | undefined;
}
export type Pseudos = { [P in SimplePseudos]: Properties };
export interface Style extends Pseudos {
    [key: string]: Properties;
}

let ssr:string[] = [];

let sheet: { insertRule: ((rule: string) => number) } =
    typeof window == 'object'
        ? (
              Object.assign(
                  document.head.appendChild(document.createElement('style')),
                  { innerHTMl: ' ' }
              ).sheet as CSSStyleSheet
          )
        : {insertRule(rule: string) {return ssr.push(rule)}}

/**
 * Transforms the input into a className.
 * The multiplication constant 101 is selected to be a prime,
 * as is the initial value of 11.
 * The intermediate and final results are truncated into 32-bit
 * unsigned integers.
 * @param  str
 * @returns string
 */
let toHash = (str: string) =>
    'zs' +
    Array.from(str).reduce((p, c, i) => (101 * p + c.charCodeAt(0)) >>> 0, 11);

/**
 * Parses the object into css, scoped, blocks
 */
let parse = (
    obj: any,
    selector?: string,
    prefixer?: (property: string, value: string) => string
): string[] => {
    let outer = '';
    let blocks: string[] = [];
    let current = '';
    let next;

    for (let key in obj) {
        let val = obj[key];

        // If this is a 'block'
        if (typeof val == 'object') {
            next = selector
                ? // Go over the selector and replace the matching multiple selectors if any
                  selector.replace(/([^,])+/g, (sel) => {
                      // Return the current selector with the key matching multiple selectors if any
                      return key.replace(/([^,])+/g, (k) => {
                          // If the current `k`(key) has a nested selector replace it
                          if (/&/.test(k)) return k.replace(/&/g, sel);

                          // If there's a current selector concat it
                          return sel ? sel + ' ' + k : k;
                      });
                  })
                : key;

            // If these are the `@` rule
            if (key[0] == '@') {
                // Handling the `@font-face` where the
                // block doesn't need the brackets wrapped
                if (key[1] == 'f') {
                    blocks = blocks.concat(parse(val, key));
                } else {
                    // Regular rule block
                    blocks.push(
                        key +
                            '{' +
                            parse(val, key[1] == 'k' ? '' : selector).join('') +
                            '}'
                    );
                }
            } else {
                // Call the parse for this block
                blocks = blocks.concat(parse(val, next));
            }
        } else {
            if (key[0] == '@' && key[1] == 'i') {
                outer = key + ' ' + val + ';';
            } else {
                key = key.replace(/[A-Z]/g, '-$&').toLowerCase();
                // Push the line for this property
                current += prefixer
                    ? // We have a prefixer and we need to run this through that
                      prefixer(key, val)
                    : // Nope no prefixer just append it
                      key + ':' + val + ';';
            }
        }
    }

    // If we have properties
    if (current[0]) {
        // Standard rule composition
        next = selector ? selector + '{' + current + '}' : current;

        // Else just push the rule
        blocks.unshift(outer + next);
    } else blocks.unshift(outer);

    return blocks;
};

let cache: string[] = [];

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

export const exportedForTesting = { ssr, sheet, parse, cache, toHash };
export { css, glob, keyframes };
