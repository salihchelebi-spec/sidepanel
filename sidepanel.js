// sidepanel.js - handles side panel UI and AI interaction

document.addEventListener("DOMContentLoaded", async () => {
  // Populate conversation text from storage
  const convoEl = document.getElementById("conversation");
  try {
    const { fullConversation } = await chrome.storage.local.get("fullConversation");
    if (fullConversation) {
      convoEl.value = fullConversation;
    }
  } catch (err) {
    console.error("Storage read failed", err);
  }

  document.getElementById("send-btn").addEventListener("click", sendToAI);
});

async function sendToAI() {
  const text = document.getElementById("user-input").value.trim();
  if (!text) return;
  const targetLang = document.getElementById("lang-select").value;
  const respEl = document.getElementById("response");
  respEl.textContent = "Bekleniyor...";
  try {
    const res = await chrome.runtime.sendMessage({ type: "AI_REPLY", text, targetLang });
    respEl.textContent = res?.result || "Cevap alınamadı";
  } catch (err) {
    console.error(err);
    respEl.textContent = "Hata: " + err.message;
  }
}
