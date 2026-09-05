# Carsl local development

Repository: https://github.com/Mostcharming/art_project (remote `origin`, branch `main`).

Project folder: `E:\Dir\DEV\carsl`.
Source, configuration, and the isolated test database are stored here.
The dependency transfer was interrupted. Use the installation commands below to
complete each app's `node_modules` directory before starting the services.

## Start

From this directory in PowerShell:

```powershell
.\start-local.ps1
```

- Admin dashboard: http://localhost:5174
- Publisher app (web): http://localhost:8081
- API health: http://localhost:3000/api/health

The launcher starts services in the background. Logs and process IDs are in `.local/`.
Expo is limited to two bundler workers to reduce memory use.
The launcher uses Expo's offline mode so startup does not depend on its remote version-check service.
If a service's port is occupied, the launcher skips that service; check its log and URL.

## Configuration

- `apis/.env`: local database credentials, JWT secret, URLs, and allowed browser origins.
- `admin/.env.development.local`: admin API URL.
- `publishers/.env.local`: development mode and publisher API URL.

These files are ignored by Git. The API uses the existing `art_development` database
with development PostgreSQL credentials copied from `E:\Dir\DEV\altuhealth\backend\.env`.
All 46 repository migrations were already present in that database; no migrations
or seeds were run against it during the credential switch.

SMTP credentials were copied from `E:\Dir\DEV\givingback\server\.env` into the API's
`SMTP_*` settings. `EMAIL_TRANSPORT=smtp` selects Nodemailer. The sender uses the source
`EMAIL_FROM` address with the display name Carsl. SMTP connection and authentication
were verified without sending a message. Mailtrap API support remains available when
SMTP is not selected and `MAILTRAP_API_KEY` is configured.

The previous isolated PostgreSQL cluster in `.local/pgdata` is retained for tests and
is stopped by default. `DB_TEST_*` and `DB_NAME_TEST` point to its `carsl_test` database
on `127.0.0.1:5433`. The launcher no longer starts that cluster. If database tests need it:

```powershell
& 'C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe' -D "$PWD\.local\pgdata" -l "$PWD\.local\postgres.log" -o '-h 127.0.0.1 -p 5433' -w start
```

## Install dependencies again

```powershell
npm --prefix apis ci --legacy-peer-deps
npm --prefix admin ci
npm --prefix publishers ci
```

The API's committed Mailtrap and Nodemailer versions have conflicting peer requirements;
`--legacy-peer-deps` installs the existing lockfile without upgrading dependencies.
The publisher app's missing `expo-asset` dependency was added at the Expo SDK 54-compatible version.

## Migrations and checks

```powershell
Push-Location apis
npm run db:migrate
npm run test:email
Pop-Location
npm --prefix admin run build
Push-Location admin
npx vitest run
Pop-Location
Push-Location publishers
npx tsc --noEmit
Pop-Location
```

## Verified setup

These checks passed before the interrupted move to E:. Runtime checks have not
been repeated on the incomplete dependency installation here.

- Existing `art_development` and isolated test database: all 46 migrations present.
- SMTP: authentication verified; 3 transport tests passed without sending email.
- Admin: production build passed and all 5 existing tests passed.
- Publisher: TypeScript check passed and web page returned HTTP 200.
- API health and admin dev page: HTTP 200.
- Expo reports existing warnings about `app/types.ts` being treated as a route and deprecated shadow styles; these did not prevent the web page from rendering.

## Mobile development

For a physical phone, set `EXPO_PUBLIC_API_URL` in `publishers/.env.local` to
`http://YOUR_PC_LAN_IP:3000/api/publishers`, then run `npm run dev` from `publishers`.
For the standard Android emulator, use host `10.0.2.2` instead of `localhost`.
Native Android builds need Android Studio/SDK; native iOS builds need macOS/Xcode.

## Stop

Stop the Node process IDs shown in `.local/api.pid`, `.local/admin.pid`, and
`.local/publishers.pid` after confirming they still belong to these services.
The existing PostgreSQL service is shared and should remain running. If you started
the isolated test cluster, stop only that cluster:

```powershell
& 'C:\Program Files\PostgreSQL\15\bin\pg_ctl.exe' -D "$PWD\.local\pgdata" -m fast -w stop
```
