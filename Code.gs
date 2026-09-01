/**
 * First Choice Movers - Quote Backend
 *
 * This Google Apps Script receives quote requests from the website
 * and appends every request as a new row in a Google Sheet.
 *
 * Setup:
 * 1. Create/open a Google Sheet.
 * 2. Create a sheet/tab named "Quote Requests".
 * 3. Open Extensions -> Apps Script.
 * 4. Paste this entire file into Code.gs.
 * 5. Change SPREADSHEET_ID below.
 * 6. Save.
 * 7. Deploy -> New deployment -> Web app.
 * 8. Execute as: Me.
 * 9. Who has access: Anyone.
 * 10. Copy the Web app URL into index.html as QUOTE_API_URL.
 */

const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "Quote Requests";

function setupSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const headers = [
    "Timestamp",
    "Name",
    "Phone",
    "Email",
    "Service",
    "Pickup Suburb",
    "Drop-off Suburb",
    "Preferred Move Date",
    "Additional Details",
    "Status"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

function doGet() {
  return jsonResponse_({
    success: true,
    service: "First Choice Movers quote backend",
    status: "online"
  });
}

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return jsonResponse_({
        success: false,
        message: "No form data received."
      });
    }

    const name = clean_(e.parameter.name);
    const phone = clean_(e.parameter.phone);
    const email = clean_(e.parameter.email);
    const service = clean_(e.parameter.service_type);
    const pickup = clean_(e.parameter.pickup_suburb);
    const dropoff = clean_(e.parameter.dropoff_suburb);
    const moveDate = clean_(e.parameter.move_date);
    const message = clean_(e.parameter.message);

    // Basic server-side validation.
    if (!name || !phone || !email || !service || !pickup || !dropoff) {
      return jsonResponse_({
        success: false,
        message: "Please provide all required quote details."
      });
    }

    if (!isValidEmail_(email)) {
      return jsonResponse_({
        success: false,
        message: "Please provide a valid email address."
      });
    }

    const sheet = setupSheet();

    sheet.appendRow([
      new Date(),
      name,
      phone,
      email,
      service,
      pickup,
      dropoff,
      moveDate,
      message,
      "New"
    ]);

    // Optional notification email.
    // Change this to your preferred notification address.
    const notificationEmail = "info@first-choicemovers.co.nz";

    try {
      MailApp.sendEmail({
        to: notificationEmail,
        subject: "New First Choice Movers Quote Request - " + service,
        htmlBody:
          "<h2>New quote request</h2>" +
          "<p><b>Name:</b> " + escapeHtml_(name) + "</p>" +
          "<p><b>Phone:</b> " + escapeHtml_(phone) + "</p>" +
          "<p><b>Email:</b> " + escapeHtml_(email) + "</p>" +
          "<p><b>Service:</b> " + escapeHtml_(service) + "</p>" +
          "<p><b>Pickup:</b> " + escapeHtml_(pickup) + "</p>" +
          "<p><b>Drop-off:</b> " + escapeHtml_(dropoff) + "</p>" +
          "<p><b>Move date:</b> " + escapeHtml_(moveDate || "Not specified") + "</p>" +
          "<p><b>Details:</b><br>" + escapeHtml_(message || "None") + "</p>"
      });
    } catch (mailError) {
      // The Sheet entry is still successful even if email notification fails.
      console.error("Notification email failed: " + mailError);
    }

    return jsonResponse_({
      success: true,
      message: "Quote request saved successfully."
    });

  } catch (error) {
    console.error(error);

    return jsonResponse_({
      success: false,
      message: "Server error. Please try again later."
    });
  }
}

function clean_(value) {
  return String(value == null ? "" : value).trim().slice(0, 5000);
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
