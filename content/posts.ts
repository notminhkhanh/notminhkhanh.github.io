import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import { gfmHeadingId } from 'marked-gfm-heading-id';

function renderPost(content: string) {
  const parser = new Marked(
    markedKatex({ throwOnError: false, nonStandard: true }),
    gfmHeadingId(),
  );
  const html = parser.parse(content, { async: false, gfm: true }) as string;
  return html.replaceAll(':face_holding_back_tears:', '🥹')
    .replaceAll('src="/images/', `src="${process.env.BASE_PATH || ''}/images/`);
}

export function getPosts() {
  const directory = join(process.cwd(), 'content/posts');
  return readdirSync(directory).filter(name => name.endsWith('.md') && !name.startsWith('_')).flatMap(name => {
    const {data, content} = matter(readFileSync(join(directory, name), 'utf8'));
    if (typeof data.published !== 'boolean') throw new Error(`${name}: set published to true or false`);
    if (!data.published) return [];
    const slug = name.slice(0, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid post filename: ${name}`);
    for (const key of ['title', 'date', 'category', 'excerpt']) {
      if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${name}: ${key} must be a non-empty string. Quote dates as "YYYY-MM-DD".`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0,10) !== data.date) throw new Error(`${name}: invalid date`);
    return [{
      slug, title: data.title as string, date: data.date as string,
      category: data.category as string, excerpt: data.excerpt as string,
      sample: data.sample === true,
      displayDate: new Date(`${data.date}T12:00:00Z`).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric', timeZone:'UTC'}),
      minutes: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220)),
      // Only repository-owned Markdown is read here; no visitor-submitted HTML.
      html: renderPost(content),
    }];
  }).sort((a,b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
