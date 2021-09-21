let insertRule:(rule: string) => number = (Object.assign(document.head.appendChild(document.createElement('style')), { innerHTMl: ' ' }}).sheet as CSSStyleSheet).insertRule;

let cache: string[] = []

/**
 * css entry
 */
function css(css: Style, global?:boolean, global?:keyframes) {
    let styles = 
    // Get a string representation of the object that is called 'compiled'
    // Retrieve the className from cache or hash it in place
    let className = toHash(JSON.stringify(css));

    // If there's no entry for the current className
    if (!cache.includes(className)) {
        parse(
            // For keyframes
            keyframes ? { ['@keyframes ' + className]: css } : css,
            global ? '' : '.' + className
        ).forEach(rule => (style.sheet as CSSStyleSheet).insertRule(rule))
        cache.push(className)
    }
    return className
}

/**
 * CSS Global function to declare global styles
 * @type {Function}
 */
let glob = (styles: Style)=> css(styles, !0);

/**
 * `keyframes` function for defining animations
 * @type {Function}
 */
let keyframes = (styles: Style)=> css(styles, !1, !0);

export { css, glob, keyframes };
