import matter from 'gray-matter';
import { readdir, readFile, copyFile, mkdir, writeFile } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
const root = 'dist/client';
const base = process.env.BASE_PATH || '';
// This reading-only site needs no client JavaScript. Retain semantic static HTML.
async function prepareHtml(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await prepareHtml(path);
    else if (entry.name.endsWith('.css')) {
      const css = await readFile(path, 'utf8');
      await writeFile(path, css.replaceAll('/_next/', `${base}/_next/`));
    } else if (entry.name.endsWith('.html')) {
      let html = await readFile(path, 'utf8');
      html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<link\b(?=[^>]*(?:rel="modulepreload"|as="script"))[^>]*>/gi, '')
        .replaceAll('href="/_next/', `href="${base}/_next/`)
        .replaceAll('href="/favicon.svg', `href="${base}/favicon.svg`);
      await writeFile(path, html);
    }
  }
}
await prepareHtml(root);
// GitHub Pages uses directory indexes for trailing-slash article URLs.
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await visit(path);
    else if (entry.name.endsWith('.html') && !['index.html', '404.html'].includes(basename(path))) {
      const destination = join(dirname(path), basename(path, '.html'), 'index.html');
      await mkdir(dirname(destination), { recursive: true });
      await copyFile(path, destination);
    }
  }
}
await visit(root);
await writeFile(join(root, '.nojekyll'), '');
console.log('GitHub Pages directory indexes prepared.');

// Only currently published posts receive their legacy URL aliases.
for (const name of await readdir('content/posts')) {
  if (!name.endsWith('.md') || name.startsWith('_')) continue;
  const { data } = matter(await readFile(join('content/posts', name), 'utf8'));
  if (data.published !== true || !data.legacyPath) continue;
  if (typeof data.legacyPath !== 'string' || !data.legacyPath.startsWith('/posts/') || data.legacyPath.includes('..') || !data.legacyPath.endsWith('.html')) {
    throw new Error(`Invalid legacyPath in ${name}`);
  }
  const source = join(root, 'posts', basename(name, '.md'), 'index.html');
  const destination = join(root, data.legacyPath.slice(1));
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
}
