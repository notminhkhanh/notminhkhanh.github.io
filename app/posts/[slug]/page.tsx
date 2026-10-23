import { notFound } from 'next/navigation';
import { getPosts } from '../../../content/posts';
import { base, Header, Footer } from '../../site';
export function generateStaticParams() { return getPosts().map(({slug}) => ({slug})); }
export async function generateMetadata({params}: {params: Promise<{slug:string}>}) { const {slug}=await params; return {title: getPosts().find(p=>p.slug===slug)?.title || 'Not found'}; }
export default async function Post({params}: {params: Promise<{slug:string}>}) {
 const {slug}=await params; const post=getPosts().find(p=>p.slug===slug); if(!post) notFound();
 return <div className="shell"><Header/><main id="main" className="article post-article"><a className="back" href={`${base}/`}>← All writing</a><article><header><div className="eyebrow">{post.category}</div><h1>{post.title}</h1><div className="tags"><time dateTime={post.date}>{post.displayDate}</time><span>·</span><span>{post.minutes} min read</span></div></header>{post.cover && <figure className="article-cover"><img src={post.cover} alt={post.coverAlt} width="1536" height="1024" fetchPriority="high"/></figure>}<div className="prose" dangerouslySetInnerHTML={{__html:post.html}}/>{post.sample && <p className="sample-note">Sample writing for this blog’s first edition.</p>}</article></main><Footer/></div>;
}
