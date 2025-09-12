export async function translateText(text, targetLang) {
  if (!text) return "";

  try {
    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "auto",       
        target: targetLang,   
        format: "text"
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    return data.translatedText || text;
  } catch (err) {
    console.error("Translation error:", err);
    return text; 
  }
}
