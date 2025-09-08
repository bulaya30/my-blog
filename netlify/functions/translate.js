export async function handler(event) {
  try {
    const { text, target } = JSON.parse(event.body);

    // Call LibreTranslate API
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: target,
        format: "text",
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ translatedText: data.translatedText }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
