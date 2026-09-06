export const base = process.env.BASE_PATH || '';
export function Header({ about = false }: { about?: boolean }) {
  return <header className="header"><a className="wordmark" href={`${base}/`}>notminhkhanh</a><nav aria-label="Main navigation"><a href={`${base}/`} aria-current={!about ? 'page' : undefined}>Writing</a><a href={`${base}/about/`} aria-current={about ? 'page' : undefined}>About</a></nav></header>;
}
export function Footer() { return <footer><span className="signature">A little space to think.</span><a href="https://github.com/notminhkhanh">GitHub ↗</a></footer>; }
