# EST Travel deployment

This build is ready for a single hosted Node.js service where:
- `/` is the public website
- `/admin` is the owner dashboard
- owner edits and uploaded photos use the same persistent storage

## Required hosting variables
- `ADMIN_USERNAME=owner`
- `ADMIN_PASSWORD=<choose a strong password>`
- `STORAGE_DIR=/data` (when a Railway volume is mounted at `/data`)

`PORT` is provided automatically by Railway.

## Railway volume
Attach a volume to the web service and mount it at:
`/data`

The app stores:
- `/data/tours.json`
- `/data/uploads/*`

Do not commit `private-config.json` or passwords to GitHub.
