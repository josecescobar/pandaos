# PandaOS

AI workspace for business operations — one command center across CRM, docs, email, data, and deploys.

## Stack

- React 19 + TanStack Start + Vite
- Tailwind CSS v4 + shadcn/ui
- Better Auth (email/password)
- Deploy target: Vercel (Nitro)

## Local development

```bash
npm install
npm run dev
```

App binds to `0.0.0.0:8080`.

### Demo sign-in

- Username: `admin`
- Password: `admin123`

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build + migrate |
| `npm run typecheck` | TypeScript check |
| `npm run preview` | Preview production build |

## Product surfaces

- Marketing: `/`, `/builders`, `/templates`, `/compare`, `/security`, `/pricing`, `/changelog`
- App: `/workspace`, `/integrations`, `/agents`, `/workflows`, `/team`, `/settings`, `/checkout`

Built with Grok.
