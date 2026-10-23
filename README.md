# notminhkhanh

A minimal personal blog with Markdown posts, a Monet cover, and a Markdown About page. Built with React and Vinext, exported as static files for GitHub Pages.

## Write

Edit a file in `content/posts/`. Set `published: true` to show it, or `published: false` to hide it. The post list and pages update automatically on refresh locally, and after the next deployment on GitHub Pages. See [WRITING.md](WRITING.md) for the short template.

Edit `content/about.md` for your bio, `app/page.tsx` for the home introduction, and `app/globals.css` for styling.

## Preview and build

Use Node.js 22.13 or newer and pnpm 11.19.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Run `pnpm build` to create static output in `dist/client`. For a project subpath, use `BASE_PATH=/my-blog pnpm build`. The build prepares directory indexes and a `.nojekyll` file.

## GitHub Pages

1. Push this project, including `.github`, to your repository’s `main` branch. Exclude `node_modules` and `dist`.
2. Under **Settings → Pages → Source**, choose **GitHub Actions**.
3. Run **Publish blog to GitHub Pages** from the Actions tab if needed. Subsequent pushes publish automatically.

The workflow detects root and project site paths. [GitHub’s workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Artwork

Claude Monet, *Water Lilies*, 1919. Public-domain reproduction from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Water-Lily_Pond_1919_Claude_Monet_Metropolitan.jpg). [Museum record](https://www.metmuseum.org/art/collection/search/438008).

Post covers were generated with OpenAI image generation, using topic-specific illustrations for technical writing and scenes inspired by the diary entries. Image briefs are in [cover credits](public/images/covers/credits.json). See [WRITING.md](WRITING.md#cover-images) to replace or add a cover.
