// utils/translate.js
export async function translateText(text, targetLang = "fr") {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: targetLang,
      }),
    }
  );

  const data = await res.json();
  return data.data.translations[0].translatedText;
}
