import { getFavorites } from "./storage.js";

document.getElementById("go-chat").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: "GET_CONVO" });
  });
};

document.getElementById("open-panel").onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { cmd: "OPEN_PANEL" });
  });
};

document.getElementById("show-favorites").onclick = async () => {
  const favs = await getFavorites();
  const wrap = document.getElementById("favorites");
  wrap.innerHTML = favs.map(f => `<div>${f.note}</div>`).join("");
  wrap.hidden = !wrap.hidden;
};
