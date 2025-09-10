import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { text, target } = JSON.parse(event.body);

    // Use Google Translate API, DeepL, or LibreTranslate
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: target,
        format: "text"
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ translatedText: data.translatedText }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ translatedText: text }) };
  }
}
