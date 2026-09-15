# EST Travel — Working owner-managed version

This is the corrected structure for a website you can sell to the company owner.

## What changed

- Public visitors **cannot edit anything**.
- The owner gets a password-protected admin page at `/admin`.
- Only the owner can:
  - add tours;
  - edit prices;
  - edit English content;
  - edit Georgian content;
  - upload or replace tour photos;
  - remove photos;
  - publish/hide tours;
  - change tour order;
  - delete tours.
- Public website has **English / Georgian switching**.
- The original logo image was separated so the website displays **only the EST emblem** as the image. `EST TRAVEL` and `Your journey starts here` are normal HTML text beside/below it.
- The site is responsive: large desktop → 4 tour cards, tablet → 2, phone → 1.
- If the owner has not uploaded a tour image, the public site displays a designed photo placeholder.

## Important: local run

1. Start Postgres: `docker compose up -d`
2. Install packages once: `npm install`
3. Start the site: `node server.js` or `START_WEBSITE.bat`

Tours live in the `tours` Postgres table. Admin add/edit/delete writes there. The JSON files are only used to seed an empty database.

You need Node.js and Docker installed.

### Windows — easiest start

Double-click:

```text
START_WEBSITE.bat
```

It will open:

```text
Public website: http://localhost:3000
Owner admin:    http://localhost:3000/admin
```

### Or start manually

```bash
node server.js
```

## Demo owner login

```text
Username: owner
Password: EST-Owner-2026!
```

The credentials are in:

```text
private-config.json
```

Before giving the deployed website to EST Travel, change the username/password there.

## Do not open `public/index.html` directly

Because tour data and the secure owner panel use a backend, open the website through:

```text
http://localhost:3000
```

Opening the HTML with `file:///...` bypasses the server and the dynamic parts cannot work.

## File structure

```text
est-travel-final/
├─ server.js                    # starts the website server
├─ config.js                    # reads private settings
├─ private-config.json          # admin login + port
├─ routes/
│  └─ apiRoutes.js              # public + protected API routes
├─ lib/
│  └─ http.js                   # HTTP/static-file helpers
├─ services/
│  ├─ tourStore.js              # tour data in Postgres
│  ├─ db.js                     # Postgres connection
│  ├─ sessionStore.js           # owner login sessions
│  └─ uploadParser.js           # secure photo upload handling
├─ db/
│  └─ init.sql                  # tours table for Docker Postgres
├─ data/
│  └─ tours.json                # seed data for an empty database
├─ public/
│  ├─ index.html                # public website
│  ├─ css/
│  │  └─ site.css
│  ├─ js/
│  │  ├─ i18n.js                # English + Georgian text
│  │  └─ site.js                # public behavior
│  ├─ assets/
│  │  └─ est-emblem.png         # emblem only
│  ├─ uploads/                  # owner-uploaded tour photos
│  └─ admin/
│     ├─ index.html
│     ├─ admin.css
│     └─ admin.js
├─ START_WEBSITE.bat
└─ README.md
```

## Owner workflow

1. Open `/admin`.
2. Log in.
3. Add or choose a tour.
4. Enter English and Georgian versions.
5. Enter the price.
6. Upload the real tour photo.
7. Click **Save changes**.
8. Refresh the public website — the update is visible there.

## Deployment

This project is intentionally simple for a small travel agency and demo/sales use. For a real public deployment, host the Node server on a service that provides persistent storage for `data/tours.json` and `public/uploads`, or later move those to a database/object-storage service.


## Important note about visuals
If you double-click `public/index.html` or `public/admin/index.html`, the visual design now loads correctly because asset paths are relative.
However, the **owner login and live tour management still require the Node server**. For full functionality, run `START_WEBSITE.bat` and open `http://localhost:3000` and `http://localhost:3000/admin`.
