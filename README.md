# website

Personal site, built with [Astro](https://astro.build).

## Develop

```
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
npm run preview  # preview the built site locally
```

## Adding content

- **Blog post** → drop a `.md` (or `.mdx`) into `src/content/blog/`
- **Project** → drop a `.md` into `src/content/projects/`
- **Archive item** → drop a `.md` into `src/content/archive/`
- **Experience / Hobbies** → edit `src/pages/experience.astro` and `src/pages/hobbies.astro`

Frontmatter is validated against schemas in `src/content.config.ts`.

LaTeX math is supported in any markdown file: `$inline$` and `$$display$$`. It is rendered to
static SVG at build time via `rehype-mathjax/svg`, so there is no client-side JS for math.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

Hosting URL depends on the repo name:
- If the repo is renamed to `yunzheqiao.github.io`, the site lives at the root URL.
- Otherwise, uncomment `base: '/website'` in `astro.config.mjs` and the site lives at
  `yunzheqiao.github.io/website/`.
