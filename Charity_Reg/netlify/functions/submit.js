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
        body: JSON.stringify({ ok: false, error: "Missing GOOGLE_SCRIPT_WEBAPP_URL env var" }),
      };
    }

    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.ok === false) {
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: data.error || "Google Script error" }),
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
