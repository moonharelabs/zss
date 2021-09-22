/**
 * Parses the object into css, scoped, blocks
 */
export declare let parse: (obj: any, selector?: string | undefined, prefixer?: ((property: string, value: string) => string) | undefined) => string[];
