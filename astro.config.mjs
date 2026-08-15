import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Open external links in markdown content in a new tab. Kept local rather than
// pulling in rehype-external-links for what amounts to a tree walk.
function rehypeNewTabForExternal() {
  return (tree) => {
    const walk = (node) => {
      if (node.tagName === 'a' && /^https?:\/\//i.test(node.properties?.href ?? '')) {
        node.properties.target = '_blank';
        node.properties.rel = 'noopener';
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  // Canonical host. The GitHub Pages deploy at yunz-qiao.github.io mirrors it.
  site: 'https://yunzqiao.cc',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeNewTabForExternal],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
