---
title: Migrating from Gatsby to Cloudflare Pages with Claude Code
date: 2026-05-17T12:00:00.000Z
description: How I handed a stack migration to Claude Code — a big strategic commit followed by a tail of small cleanup PRs.
---

This site used to be a Gatsby v2 build hosted on Netlify. As of this afternoon, it's an Astro site running on Cloudflare Pages. The interesting part isn't the framework swap, it's that I didn't really do the migration — I scoped it, reviewed it, and merged it. Claude Code did the typing.

### Why migrate at all

The site worked fine. What didn't work fine was the supply chain underneath it: Gatsby v2, React 16, Tailwind v1, Netlify CMS — all multiple major versions behind, none of it really being used the way it was originally set up. My `package.json` had grown a long tail of `gatsby-remark-*` and `gatsby-plugin-*` packages and a Dependabot config that pinned versions of half of them. The cost wasn't bugs in production, it was noise: weekly PRs to bump packages that didn't matter, on a stack I had already mentally moved on from.

I also host a couple of other things on Cloudflare. Consolidating made sense.

The other reason was less rational and more curiosity: I wanted to see how far I could push the Claude mobile app. The session that did the migration ran on Anthropic's infrastructure, not on my laptop — I drove it entirely from the app on my phone. I kicked it off, reviewed diffs, asked follow-up questions, and merged PRs in between other things. A site migration as a thing you do on the couch is a genuinely new shape, and I wanted to find its edges.

### The one-shot commit

I opened Claude Code, described the destination (Astro on Cloudflare Pages, drop Netlify CMS, keep the existing posts and URLs), and asked it to go. It came back with a single commit:

> Migrate from Gatsby v2 to Astro v5 + Plain CSS + Cloudflare Pages
>
> - Astro Content Collections for blog posts (5 posts migrated)
> - GitHub GraphQL API fetched at build time via fetch() in index.astro
> - Plain CSS + CSS Modules replacing Tailwind v1
> - Shiki syntax highlighting replacing Prism
> - Cloudflare Pages deploy hook replacing Netlify webhook in GH Actions
> - 301 redirects for old root-level post URLs → /blog/* paths
> - Removes: Gatsby, React, 30+ plugins, Netlify CMS, Netlify functions, Tailwind, Google Analytics, PWA manifest

Thirty-plus dependencies removed in one go. The new `package.json` lists exactly one runtime dependency: `astro`.

What I liked is that it didn't just translate the old code line-for-line. It picked Shiki because it's what Astro ships with, it rewrote the `gatsby-source-github-api` build-time plugin into a plain `fetch()` against the GraphQL API in `src/pages/index.astro`, and it remembered to write a `_redirects` file mapping the old root-level post URLs to `/blog/*` so existing links wouldn't 404. The new Cloudflare target is a four-line `wrangler.jsonc`:

```jsonc
{
  "name": "fraserxu-dev",
  "compatibility_date": "2026-05-17",
  "assets": { "directory": "./dist" }
}
```

That's the whole hosting config. The deploy itself runs from a GitHub Actions step that hits a Cloudflare deploy hook — the same shape as the old Netlify build hook I wrote about [six years ago](https://fraserxu.dev/blog/running-scheduled-build-for-gatsby-site-on-netlify/), just pointed at a different URL.

### The cleanup tail

The one big commit got me 90% of the way. The remaining 10% came out as a series of small Claude-driven PRs across the same afternoon, each on a `claude/<task>-<id>` branch:

- **PR #95** simplified the GitHub repos GraphQL query to use `first` + `DESC` ordering instead of fetching everything and slicing client-side.
- **PR #96** fixed the "latest repos" section that had rendered empty after the API rewrite — the field name had changed and nobody (including the agent) noticed until I loaded the page.
- **PR #98** deleted `.github/dependabot.yml` entirely. It still had `ignore` blocks pinning `gatsby-plugin-feed`, `gatsby-remark-smartypants`, `react@16.14.0`, and `bl@1.2.3` — every one of them a package that no longer exists in the repo. I'd rather upgrade `astro` by hand once a month than carry that config around.

Each diff was small enough to review in under a minute. That's the workflow I keep coming back to with AI: one strategic move where the agent gets to make a lot of decisions at once, then a sequence of obvious small cleanups where it doesn't.

### What I still did myself

The agent is fast, but it isn't deciding anything important. I picked Cloudflare Pages over the alternatives. I decided Netlify CMS could just go — I hadn't logged into it in three years — rather than asking Claude to port it. I read the diff before merging the big commit and noticed it had left a `postcss.config.js` behind that wasn't being used. When the repos section went blank, I told it which API field was wrong instead of letting it grep around for ten minutes.

There's also the quiet judgement of when to stop. After the dependabot PR landed I almost asked it to also remove the GitHub Actions cron job that used to trigger Netlify rebuilds. I caught myself — the same job now triggers Cloudflare, and "while we're in here" is how a clean migration turns into a three-day yak shave.

### On writing this at all

I haven't published a blog post in years. The friction was never the typing — it was finding an hour to sit down and decide what was actually worth saying, while the work was still fresh. By the time I had the hour, the work was no longer fresh, and the post never got written.

What's different now is that the git history is the draft. The agent can read every commit, every diff, every PR comment from the migration and produce a coherent first pass in a minute. My job becomes editing: cutting what isn't true to my experience, adding the bits the diff doesn't show (why I picked Cloudflare, what I almost did and stopped myself from doing), keeping the voice mine. That's a different kind of writing than I'm used to, and I'm still figuring out whether what comes out the other end is a blog post in the old sense or something else. But the threshold to publish is meaningfully lower, and "I never got around to writing it up" is no longer a good excuse.

### Closing

The whole thing — including this blog post — was drafted by Claude Code from the git history of the migration itself, driven from the Claude mobile app. I wrote the prompts, picked the destination, and hit merge. That feels like the right division of labor for a personal site in 2026, and I'm pretty sure the edge of what's possible from a phone is further out than I thought yesterday.
