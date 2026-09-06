import { base, Header, Footer } from './site';
export default function NotFound() {
  return <div className="shell"><Header/><main id="main" className="article"><h1>Page not found.</h1><p>This page may have moved.</p><a className="back" href={`${base}/`}>← Back to the notebook</a></main><Footer/></div>;
}
