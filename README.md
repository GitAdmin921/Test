# First Choice Movers — Full Website + Google Sheets Backend

This is the standalone version of the First Choice Movers website.

## Architecture

Customer
→ `index.html`
→ Google Apps Script Web App
→ Google Sheet (`Quote Requests`)
→ optional email notification

## Canva dependency

The final website does **not** use:

- Canva Datasheet
- Canva editing SDK
- Canva resizing SDK
- Canva telemetry SDK
- Canva iframe/embed

The Canva design can be used as the visual reference, but the production website is independent HTML/CSS/JavaScript.

## Files

- `index.html` — complete customer-facing website
- `Code.gs` — Google Apps Script backend
- `README.md` — this file

## Backend setup

1. Create a private Google Sheet.
2. Open **Extensions → Apps Script**.
3. Paste `Code.gs`.
4. Replace:

```js
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
```

with your real Spreadsheet ID.
5. Run `setupSheet()` once and approve the requested permissions.
6. Deploy → New deployment → Web app.
7. Set **Execute as:** Me.
8. Set **Who has access:** Anyone.
9. Copy the Web App URL.
10. In `index.html`, replace:

```js
const QUOTE_API_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your Web App URL.

## Sheet columns

The backend creates:

1. Timestamp
2. Name
3. Phone
4. Email
5. Service
6. Pickup Suburb
7. Drop-off Suburb
8. Preferred Move Date
9. Additional Details
10. Status

Every successful submission starts with status `New`.

## Notification

The Apps Script attempts to notify:

`info@first-choicemovers.co.nz`

when a new quote is submitted.

The Sheet entry remains successful even if the notification email fails.

## Important production notes

- Keep the Google Sheet private.
- Never put Google credentials or service-account keys in `index.html`.
- Keep the Spreadsheet ID only in Apps Script.
- Test the form after deployment.
- For a public production site, add stronger anti-spam/rate-limiting if traffic grows.

## Frontend hosting

`index.html` can be hosted on any static host that supports normal HTML/JS.

The Google Apps Script Web App acts as the lightweight backend, so the frontend does not need a traditional server.

## Testing

After deploying Apps Script, submit a test quote from the website.

Expected result:

- browser shows a success message
- a new row appears in `Quote Requests`
- notification email is attempted

If the browser shows a backend error, verify the Apps Script deployment URL and that the deployment access is set to **Anyone**.
