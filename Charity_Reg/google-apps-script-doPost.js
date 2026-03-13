/**
 * Google Apps Script: doPost(e) for Charity Fair registration (Netlify register function).
 * Deploy as Web app (Execute as: Me, Who has access: Anyone).
 * Uses your spreadsheet and sheet "HicDataBase".
 */

var SPREADSHEET_ID = "1vLOkEOQcmtvjf4yHqD95OMB3p_DjQ8Ce5a_0lqgU0aY";
var SHEET_NAME = "HicDataBase";

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // IFHP Awareness Initiative payload from Netlify register function
    sheet.appendRow([
      body.timestamp || new Date(),
      body.fullName || "",
      body.phone || "",
      body.email || "",
      body.address || "",
      body.gender || "",
      body.uciNumber || "",
      body.memberOrVisitor || "",
      body.howDidYouKnow || "",
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
