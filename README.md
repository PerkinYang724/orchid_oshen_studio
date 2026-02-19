This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Podcast: latest episode from Spotify

The **Latest Episode** block in the Podcast section is filled automatically from Spotify when these env vars are set:

| Variable | Required | Description |
|----------|----------|-------------|
| `SPOTIFY_CLIENT_ID` | Yes | From [Spotify for Developers](https://developer.spotify.com/dashboard) → your app |
| `SPOTIFY_CLIENT_SECRET` | Yes | Same app → Client Secret |
| `SPOTIFY_SHOW_ID` | Yes | Your show ID from the show URL (e.g. `2JdDo1zeJ2fyO5wxxS7ikN`) |
| `LATEST_EPISODE_YOUTUBE_URL` | No | Set to the YouTube URL of the latest episode to show "Watch on YouTube" for it |

After you release a new episode on Spotify, the site will show it as the latest (title, description, duration, embed, Spotify link) without redeploying. Update `LATEST_EPISODE_YOUTUBE_URL` when you publish the same episode on YouTube so that link stays in sync.

Copy `.env.example` to `.env.local` and fill in the values.

---

### If you see: `ENOENT ... /vercel/path0/vercel/path0/.next/routes-manifest.json`

This is caused by a **wrong Root Directory** in Vercel. Fix it:

1. Open your project on [Vercel](https://vercel.com/dashboard) → **Settings** → **General**
2. Under **Build & Development Settings**, find **Root Directory**
3. Set it to **`.`** (a single dot) or leave it **empty** — do **not** set it to `vercel/path0`
4. Save and redeploy (e.g. **Redeploy** from the Deployments tab, with “Clear cache” if needed)
