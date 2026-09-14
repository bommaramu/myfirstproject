# Academic ERP Portal — Programme Migration Module (Prototype)

This is a front-end-only clickable prototype of the Programme Migration
module: Student, Academic Office, Dean Academics, Accounts, SDC and
Assistant Director logins, covering the full workflow from preference
submission to final account migration.

There is no backend/database here — all data lives in memory in the
browser (`js/app.js`) and resets on every page refresh. It's meant for
walkthroughs, demos, and as a visual/functional spec for the real VTOP
build, not for production use.

## Folder structure

```
erp-migration-portal/
├── index.html        Page shell — loads the CSS and JS below
├── css/
│   └── style.css      All styling (theme, layout, components)
├── js/
│   └── app.js          All app logic (data model, rendering, interactions)
└── README.md          This file
```

## Running it on localhost

You need any simple static file server — the app doesn't need Node,
a database, or a build step. Pick whichever you already have installed.

### Option A — Python (already installed on most machines)
```bash
cd erp-migration-portal
python3 -m http.server 8000
```
Then open **http://localhost:8000** in your browser.

(If you only have Python 2, use `python -m SimpleHTTPServer 8000` instead.)

### Option B — Node.js
```bash
cd erp-migration-portal
npx serve .
```
It will print a local URL (usually **http://localhost:3000**) — open that.

### Option C — VS Code
Install the **"Live Server"** extension, open this folder in VS Code,
right-click `index.html` → **"Open with Live Server."**

> Don't just double-click `index.html` to open it as a `file://` path —
> browsers block some features that way. Always serve it over
> `http://localhost` using one of the options above.

## Logging in

It's a demo — any User ID / Password combination works for any of the
six roles. Pick a role on the login screen and click **Login**.

Sample students are pre-seeded at different stages of the process so
every dashboard has data to show immediately. Log in as **Student**
to walk a fresh application through the entire pipeline yourself.

## Editing

- **Colors, fonts, spacing, layout** → `css/style.css` (CSS variables
  are defined at the top of the file under `:root`).
- **Sample data, workflow logic, screens** → `js/app.js`. The file is
  organised into sections by role (Student, Academic Office, Dean
  Academics, Accounts, SDC, Assistant Director) plus shared helpers
  (stepper, modal, toast) at the top.
- **Page structure / static markup** → `index.html`.

## Next steps toward a real system

This prototype is a UI/UX and workflow reference. To turn it into a
real deployment you'll need, at minimum:
- A backend (e.g. PHP/Node/Django) with a real database instead of
  the in-memory `state` object in `app.js`
- Authentication per role instead of the demo login
- Server-side validation for eligibility, seat caps, and payments
- A real payment gateway integration for the ₹1,000 and ₹9,000 fees
- Email sending for the Assistant Director's issuance step
