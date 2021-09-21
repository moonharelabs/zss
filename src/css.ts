import { toHash } from "./hash";
import { parse } from "./parse";
import { Style } from "./types"

let style = document.head.appendChild(document.createElement('style'));
style.innerHTML = ' '

let cache: { [key: string]: string } = {}

/**
 * css entry
 */
export function css(css: Style) {
    // Get a string representation of the object that is called 'compiled'
    // Retrieve the className from cache or hash it in place
    let className = toHash(JSON.stringify(css));

    // If there's no entry for the current className
    if (!cache[className]) {
        parse(css, '.' + className).forEach(rule => style.sheet.insertRule(rule))
    }
    return className
}
