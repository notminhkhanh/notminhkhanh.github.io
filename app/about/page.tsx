import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { base, Header, Footer } from '../site';

function getAbout() {
  const { data, content } = matter(
    readFileSync(join(process.cwd(), 'content/about.md'), 'utf8'),
  );
  for (const key of ['title', 'eyebrow', 'description']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) {
      throw new Error(`content/about.md: ${key} must be a non-empty string`);
    }
  }
  return { data, html: marked.parse(content, { async: false, gfm: true }) };
}

export function generateMetadata() {
  return { title: 'About', description: getAbout().data.description };
}

export default function About() {
  const { data, html } = getAbout();
  return (
    <div className="shell">
      <Header about />
      <main id="main" className="article">
        <div className="eyebrow">{data.eyebrow}</div>
        <h1>{data.title}</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        <a className="back" href={`${base}/`}>← Back to the notebook</a>
      </main>
      <Footer />
    </div>
  );
}
