import {readFile, writeFile} from 'node:fs/promises';
const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: pnpm new-post my-post-title (lowercase words separated by hyphens)');
  process.exit(1);
}
const path = `content/posts/${slug}.md`;
const title = slug.replaceAll('-', ' ');
const text = (await readFile('content/posts/_template.md', 'utf8'))
  .replace('"Your post title"', JSON.stringify(title.charAt(0).toUpperCase()+title.slice(1)))
  .replace('"2026-09-06"', JSON.stringify(new Date().toISOString().slice(0, 10)));
await writeFile(path, text, {flag:'wx'});
console.log(`Created ${path}. Keep published: false while writing; change it to true to publish.`);
