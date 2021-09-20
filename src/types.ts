import * as CSS from 'csstype';

export interface Properties extends CSS.PropertiesHyphenFallback<string | number, string | number> {
    [key: string]: string | number | (string | number | undefined)[] | Properties | undefined
}
export type Pseudos = { [P in CSS.SimplePseudos]: Properties }
export interface Style extends Pseudos {
    [key: string]: Properties
}
