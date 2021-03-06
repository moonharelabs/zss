/**
 * Parses the object into css, scoped, blocks
 */
export let parse = (
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
