// background.js – handles AI calls & global events
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "AI_REPLY") {
    const { text, targetLang } = msg;
    // call OpenAI/Translate API (pseudo)
    const aiText = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + (await getKey())
      },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: text }] })
    })
      .then(res => res.json())
      .then(r => r.choices[0].message.content)
      .catch(err => console.error(err));

    sendResponse({ result: aiText });
  }
  return true; // keep channel open
});

async function getKey() {
  const { apiKey } = await chrome.storage.local.get("apiKey");
  return apiKey || "";
}
