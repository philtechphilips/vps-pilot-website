# VPSPilot Website

The public website for VPSPilot: the landing page and the documentation
(`/docs`). It is a static Next.js 16 site with no backend. The dashboard every
install serves lives in its own repository, and this site never talks to a
control plane.

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
```

## Layout

```
app/
├── (marketing)/      # landing page
└── docs/             # documentation shell and pages
components/
├── docs/             # prose, diagrams, search, sidebar, table of contents
└── marketing/        # header, footer, illustrations, motion clips
lib/
├── docs/             # docs navigation and page content
└── site.ts           # link to the project on GitHub
motion/               # HyperFrames sources of the clips in public/motion
```

The UI primitives (`components/ui.tsx`, `icons.tsx`, `logo.tsx`, the theme
tokens in `app/globals.css`) are copies of the dashboard's, so the site and the
product look the same. Change them in both places.

## Deploying

Any Next.js host works (Vercel, Netlify, a Node server). For a container:

```bash
docker build -t vpspilot/website .
docker run -p 3000:3000 vpspilot/website
```

Once the site is live, set `SITE_URL` in the dashboard's `lib/site.ts` to its
address so the dashboard's Docs links open these pages instead of GitHub.
