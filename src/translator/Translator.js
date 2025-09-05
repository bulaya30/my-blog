async function translateText(text, targetLang) {
  if (!text) return "";

  try {
    const response = await fetch("https://translate.argosopentech.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });

    const data = await response.json();
    return data.translatedText || text;
  } catch (err) {
    console.error("Translation error:", err);
    return text; // fallback to original
  }
}
