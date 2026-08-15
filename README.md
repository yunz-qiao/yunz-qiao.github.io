# website

Personal site, built with [Astro](https://astro.build).

**Live at [yunz-qiao.github.io](https://yunz-qiao.github.io/)**

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

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages
at <https://yunz-qiao.github.io/>.

The repo is named `yunz-qiao.github.io`, so the site is served from the root URL and no `base` path
is needed in `astro.config.mjs`. Pages is configured with build type "GitHub Actions" (not "deploy
from a branch") — the workflow uploads `dist/` as the artifact.
