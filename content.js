async function copyConversation() {
    window.scrollTo(0, document.body.scrollHeight);
    let lastHeight = 0;
    while (document.documentElement.scrollTop !== 0) {
      window.scrollBy(0, -window.innerHeight);
      await new Promise(r => setTimeout(r, 200));
      if (document.documentElement.scrollTop === lastHeight) break;
      lastHeight = document.documentElement.scrollTop;
    }

    // Simulate drag select (simplified)
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.body);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");

    const text = await navigator.clipboard.readText();
    chrome.storage.local.set({ fullConversation: text });
  }

  function injectPanel() {
    if (document.getElementById("nil-agent-panel")) return;
    const iframe = document.createElement("iframe");␍␊
    iframe.src = chrome.runtime.getURL("panel.html");
    iframe.id = "nil-agent-panel";␍␊
    const iframe = document.createElement("iframe");␊
    iframe.src = chrome.runtime.getURL("sidepanel.html");
    iframe.id = "nil-agent-panel";␊
    Object.assign(iframe.style, {
      position: "fixed",
      top: 0,
      right: 0,
      width: "400px",
      height: "100%",
      border: "none",
      zIndex: 999999
    });
    document.body.appendChild(iframe);
  }
})();
