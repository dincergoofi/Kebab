# Public Deployment

QR codes must point to a public HTTPS URL. Local development links such as
`http://127.0.0.1:5174/...` or `http://172.20.10.3:5175/...` only work on the
developer machine or local Wi-Fi and must not be printed on tables.

## Production Target

Recommended public URL shape:

```text
https://realistanbul.es/real-kebab-istanbul/masa-1
```

or, before the custom domain is connected:

```text
https://real-kebab-istanbul.vercel.app/real-kebab-istanbul/masa-1
```

## Deploy Options

### Vercel

1. Import this folder as a Vite project.
2. Build command: `npm run build`
3. Output directory: `dist`
4. The included `vercel.json` sends every QR route back to `index.html`.
5. Add env vars only when Supabase is ready:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_DEFAULT_RESTAURANT_SLUG`

### Netlify or Cloudflare Pages

1. Build command: `npm run build`
2. Output directory: `dist`
3. The included `public/_redirects` is copied to `dist/_redirects` and keeps
   deep QR routes working after refresh.
4. Add the same Supabase env vars when the database is ready.

## Demo-First Publish

If Supabase is not ready yet, the app can still be published as a public demo.
Leave Supabase env vars empty and the guest app will use demo data. The admin
route will open in demo preview mode, where edits are local to the session.

Use this for owner review before final data import.

## Data Export

Regenerate demo CSV and seed files:

```bash
npm run export:data
```

Generate the seed with a different table count:

```bash
node scripts/export-demo-data.mjs --tables=24
```

Generated outputs:

```text
docs/menu-export-demo.csv
supabase/seed.demo-generated.sql
```

## Preflight

Before demo publish or production publish:

```bash
npm run preflight
```

This checks required files, warns about missing Supabase env values, regenerates
CSV/seed outputs and runs the production build.

## QR Rule

Print QR codes only after the final public URL is live and tested on mobile data,
not just on Wi-Fi.

## QR Batch Page

After deploy, open:

```text
https://your-domain.example/qr.html
```

Use it to generate print-ready table cards such as:

```text
https://realistanbul.es/real-kebab-istanbul/masa-1
https://realistanbul.es/real-kebab-istanbul/masa-2
```

Before printing the final batch:

1. Test one QR on mobile data.
2. Confirm the correct table label appears in the header.
3. Confirm menu, phone order, feedback and game sections open.
4. Print only after the final domain is connected.
