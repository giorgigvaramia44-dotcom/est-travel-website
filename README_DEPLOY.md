# EST Travel deployment

This build is ready for a single hosted Node.js service where:
- `/` is the public website
- `/admin` is the owner dashboard
- owner edits and uploaded photos use the same persistent storage

## Required hosting variables
- `ADMIN_USERNAME=owner`
- `ADMIN_PASSWORD=<choose a strong password>`
- `DATABASE_URL=postgres://esttravel:esttravel@host:5432/esttravel`
- `STORAGE_DIR=/data` (when a Railway volume is mounted at `/data`)

`PORT` is provided automatically by Railway.

Tours are stored in Postgres. Locally, start the database with:

```bash
docker compose up -d
npm install
npm start
```

The first start copies tours from `storage/tours.json` (if present) or `data/tours.json` into the `tours` table.

## Railway volume
Attach a volume to the web service and mount it at:
`/data`

The app stores uploaded photos at:
`/data/uploads/*`

Do not commit `private-config.json` or passwords to GitHub.
