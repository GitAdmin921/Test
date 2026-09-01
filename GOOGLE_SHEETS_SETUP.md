# Google Sheets Setup — First Choice Movers

## Sheet

Create a Google Sheet named:

`First Choice Movers - Quote Requests`

The Apps Script will create a tab called:

`Quote Requests`

## Spreadsheet ID

For:

`https://docs.google.com/spreadsheets/d/ABC123/edit`

the Spreadsheet ID is:

`ABC123`

Put it in `Code.gs`.

## Deploy

Apps Script:

**Deploy → New deployment → Web app**

Use:

- Execute as: **Me**
- Who has access: **Anyone**

Copy the `/exec` URL.

## Connect

Put that URL in `index.html`:

```js
const QUOTE_API_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

Do not put the Sheet ID in the frontend.

## Test

Submit:

- Name
- Phone
- Email
- Service
- Pickup
- Drop-off

The request should appear as a new row.

## Status workflow

The `Status` column starts as:

`New`

You can manually change it to:

`Contacted`
`Quoted`
`Booked`
`Completed`
`Cancelled`

## Troubleshooting

If submissions fail:

1. Confirm the URL ends in `/exec`.
2. Confirm the deployment is a Web App.
3. Confirm **Who has access = Anyone**.
4. Confirm the Spreadsheet ID is correct.
5. Run `setupSheet()` once in Apps Script.
6. Submit another test quote.
