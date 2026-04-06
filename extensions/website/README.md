# website -- static site generation

> Read this file when you need to deploy the wiki as a website. Self-contained: detect, use, fallback.

---

## Detection

Both conditions must be met:

1. `test -f extensions/website/node_modules/.package-lock.json` succeeds
2. `cd extensions/website && npm run build` completes successfully

**If either fails, skip to the "Install" section below.**

---

## Usage (when website is available)

### Local development

```bash
cd extensions/website
npm run dev
```

Starts a local dev server at `http://localhost:3000` with hot reloading.

### Static build

```bash
cd extensions/website
npm run build
```

Build output goes to `extensions/website/out/`.

### Local preview of the static build

The `out/` directory is a fully static export. To preview it locally with correct styles and routing, use a static file server:

```bash
cd extensions/website
npx serve out
```

This serves the site at `http://localhost:3000`. Opening `out/index.html` directly in a browser will not work because the static export relies on proper path resolution for CSS and JS assets.

### Deploying to Vercel

Vercel is the recommended hosting platform for Next.js static exports.

1. Push the repository to GitHub (if not already done)
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set the **Root Directory** to `extensions/website`
4. Vercel auto-detects Next.js and configures the build
5. Deploy. The site is live.

Subsequent pushes to main trigger automatic redeployments.

Alternatively, ask your AI agent: "Deploy my wiki to Vercel" and it will walk you through the process.

### Other static hosts

The `out/` directory can be deployed to any static hosting service (Netlify, GitHub Pages, Cloudflare Pages, etc.). Point the build command to `cd extensions/website && npm run build` and the output directory to `extensions/website/out`.

### Content source

The website reads directly from the wiki root at build time:

- `../../pages/`
- `../../sources/`
- `../../maps/`
- `../../queries/`

No content is copied or duplicated. Rebuild after wiki changes to update the site.

---

## Fallback (when website is unavailable)

Read `pages/`, `sources/`, `maps/`, `queries/` as markdown files directly in Obsidian or any text editor.

---

## Installation (for human users)

```bash
bash extensions/website/init.sh
# or manually:
cd extensions/website && npm install
```

Or ask your AI agent: "Set up the website extension" and it will handle the installation.

## Files

| File | Role |
|---|---|
| `README.md` | This file |
| `init.sh` | One-time installation script |
| `package.json` | npm scripts and dependencies |
| `next.config.ts` | Next.js build configuration |
| `app/` | Routes and page entry points |
| `lib/` | Markdown / wiki content reading and transformation |
| `components/` | Site UI components |
