export async function translateText(text, targetLang) {
  if (!text) return "";

  try {
    const response = await fetch("/.netlify/functions/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target: targetLang }),
    });

    const data = await response.json();

    // Ensure it's a string
    return typeof data.translatedText === "string" ? data.translatedText : text;
  } catch (err) {
    console.error("Translation error:", err);
    return text; // fallback
  }
}
