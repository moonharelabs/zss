import type { PropertiesFallback, PropertiesHyphenFallback, SimplePseudos } from 'csstype';
export interface Properties extends PropertiesFallback<string | number, string | number>, PropertiesHyphenFallback<string | number, string | number> {
    [key: string]: string | number | (string | number | undefined)[] | Properties | undefined;
}
export declare type Pseudos = {
    [P in SimplePseudos]: Properties;
};
export interface Style extends Pseudos {
    [key: string]: Properties;
}
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
export declare const exportedForTesting: {
    ssr: string[];
    sheet: {
        insertRule: (rule: string) => number;
    };
    parse: (obj: any, selector?: string | undefined, prefixer?: ((property: string, value: string) => string) | undefined) => string[];
    cache: string[];
    toHash: (str: string) => string;
};
export { css, glob, keyframes };
