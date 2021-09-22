# zss
A 0KB css-in-js solution

---

```ts
import { css } from "zss";

// vanilla JS
const btn = document.querySelector("#btn");
btn.classList.add(css({
    background: props.color,
    borderRadius: props.radius + 'px'
}));

// JSX
const App => <button className={css({
    background: props.color,
    borderRadius: props.radius + 'px'
})}>click</button>
```

# Contributing
Feel free to try it out and checkout the examples. If you wanna fix something feel free to open a issue or a PR.
