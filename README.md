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

## Migrated writing

The collection contains six published posts and two unpublished posts. `content/migration.json` records source files and commits. Original bodies, titles, timestamps, tags, and languages are preserved; referenced images are bundled locally. The DP note was removed at your request.

Equations render with KaTeX; heading IDs preserve section links. Published posts with a `legacyPath` also retain their old `.html` URLs in the static build. Changing `published` to false excludes those aliases too.

The two recovered diaries are “Viết cho 2022” and “Nghĩ gì viết nấy - New year resolution”. The latter retains its original front-matter date, normalized from `2020-02-1` to `2020-02-01`; its text refers retrospectively to 2020, so the original date may need your correction.

## Artwork

Claude Monet, *Water Lilies*, 1919. Public-domain reproduction from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Water-Lily_Pond_1919_Claude_Monet_Metropolitan.jpg). [Museum record](https://www.metmuseum.org/art/collection/search/438008).
