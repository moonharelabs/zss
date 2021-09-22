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
