export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: "Method Not Allowed" }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");

    // Basic validation
    if (!payload.fullName || !payload.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, error: "Full Name and Email are required" }),
      };
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_WEBAPP_URL;
    if (!scriptUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: "Registration is not fully set up yet. Please try again later or contact the church." }),
      };
    }

    // Send full registration payload for the sheet (all form fields + timestamp).
    // In Google Apps Script doPost(e), parse with: var data = JSON.parse(e.postData.contents);
    // Enforce max 51 registrations in the script; return { ok: false, error: "..." } when full.
    const sheetPayload = {
      timestamp: new Date().toISOString(),
      fullName: payload.fullName?.trim() ?? "",
      phone: payload.phone?.trim() ?? "",
      email: payload.email?.trim() ?? "",
      location: payload.location?.trim() ?? "",
      gender: payload.gender ?? "",
      age: payload.age?.trim() ?? "",
      jacketSize: payload.jacketSize ?? "",
      memberOrVisitor: payload.memberOrVisitor ?? "",
      welfareUpdates: payload.welfareUpdates ?? "",
    };

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sheetPayload),
    });

    const text = await res.text();
    let data = {};
    try {
      if (text && text.trim()) data = JSON.parse(text);
    } catch {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: "Google Apps Script returned an unexpected response. Check that the script is deployed as a web app and returns JSON.",
        }),
      };
    }

    if (!res.ok) {
      const message =
        data.error ||
        (res.status === 404
          ? "Registration endpoint not configured. Please contact the organizer."
          : `Server error (${res.status}). Please try again later.`);
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: message }),
      };
    }

    if (data.ok === false) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          error: data.error || "Registration could not be saved. Please try again.",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
}
