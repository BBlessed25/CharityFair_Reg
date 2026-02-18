/**
 * Google Apps Script: doPost(e) for Charity Fair registration (Netlify register function).
 * Deploy as Web app (Execute as: Me, Who has access: Anyone).
 * Uses your spreadsheet and sheet "HicDataBase". Enforces max 51 registrations.
 */

var SPREADSHEET_ID = "1vLOkEOQcmtvjf4yHqD95OMB3p_DjQ8Ce5a_0lqgU0aY";
var SHEET_NAME = "HicDataBase";
var MAX_REGISTRATIONS = 51;

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Row 1 = header, so 51 data rows = up to row 52
    if (sheet.getLastRow() >= MAX_REGISTRATIONS + 1) {
      return ContentService
        .createTextOutput(JSON.stringify({
          ok: false,
          error: "Registration is full. We have reached the maximum of 51 registrations.",
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Charity Fair payload from Netlify register function
    sheet.appendRow([
      body.timestamp || new Date(),
      body.fullName || "",
      body.phone || "",
      body.email || "",
      body.location || "",
      body.gender || "",
      body.age || "",
      body.jacketSize || "",
      body.memberOrVisitor || "",
      body.welfareUpdates || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
