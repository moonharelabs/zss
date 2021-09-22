import { ssr } from './ssr'
export let sheet: { insertRule: ((rule: string) => number) } =
    typeof window == 'object'
        ? (
              Object.assign(
                  document.head.appendChild(document.createElement('style')),
                  { innerHTMl: ' ' }
              ).sheet as CSSStyleSheet
          )
        : {insertRule(rule: string) {return ssr.push(rule)}}
