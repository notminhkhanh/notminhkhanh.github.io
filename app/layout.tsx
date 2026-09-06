import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'notminhkhanh', template: '%s — notminhkhanh' },
  description: 'Notes on code, curiosity, and the things in between. The personal notebook of Minh Khanh, also known as notminhkhanh.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><a className="skip" href="#main">Skip to content</a>{children}</body></html>;
}
