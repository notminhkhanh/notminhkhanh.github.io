# Writing posts

Each post is a Markdown file in `content/posts/`:

```markdown
---
title: "My post"
date: "2026-09-06"
category: "Diary"
excerpt: "A short introduction."
published: false
---

Your writing goes here.
```

Set `published: true` to include the post in the list and give it an article page. Set `published: false` to hide it from both. Posts are sorted by date automatically.

Refresh the local preview after saving. Once GitHub Pages is configured, commit and push your change to update the live site.

Create another post by copying `content/posts/_template.md` to a new filename, or run `pnpm new-post my-post-title`. The filename becomes its URL, so keep it stable after publishing. Files beginning with `_` are ignored.

Your bio is in `content/about.md`. Unpublished files still exist in the repository and are readable if the repository is public.

## Cover images

Put an image in `public/images/covers/` and add these optional fields to the post’s Markdown header:

```yaml
cover: "/images/covers/my-post.webp"
coverAlt: "A short description of what the image shows."
```

The same image appears above the article and beside its title in the post list. Landscape images around 3:2 work well. Leave both fields out for a text-only post.

For a smaller download in the list, optionally place a 360-pixel-wide WebP beside the cover named `my-post-thumb.webp`; it is picked up automatically. The included covers already have these smaller versions. No change to `published: true` / `false` is needed.
