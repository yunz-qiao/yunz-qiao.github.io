---
title: Hello, world
date: 2026-05-26
tags: [meta]
description: First post. Verifying that markdown, code blocks, and math all render.
---

This is the first post on the new site. The point of this file is to confirm the renderer handles everything I plan to write later.

## Inline and display math

Einstein's famous identity, inline: $E = mc^2$.

A display equation:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

A multi-line one:

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

## Code

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## Links and emphasis

Some *italic*, some **bold**, and a [link to nothing](https://example.com).
