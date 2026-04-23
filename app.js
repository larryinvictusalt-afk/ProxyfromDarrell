const urlForm = document.getElementById("urlForm");
const urlInput = document.getElementById("urlInput");
const viewFrame = document.getElementById("viewFrame");
const statusText = document.getElementById("statusText");

const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");
const reloadBtn = document.getElementById("reloadBtn");

let historyStack = [];
let historyIndex = -1;

function normalizeUrl(input) {
  if (!input) return "";
  if (!/^https?:\/\//i.test(input)) {
    return "https://" + input;
  }
  return input;
}

async function loadUrl(rawUrl, pushToHistory = true) {
  const url = normalizeUrl(rawUrl);
  if (!url) return;

  statusText.textContent = "Loading " + url + " …";

  try {
    const proxiedUrl = "/proxy?url=" + encodeURIComponent(url);

    // Option 1: set iframe src directly to proxy
    viewFrame.src = proxiedUrl;

    // Option 2 (commented): fetch HTML and write into iframe
    // const res = await fetch(proxiedUrl);
    // const html = await res.text();
    // const doc = viewFrame.contentWindow.document;
    // doc.open();
    // doc.write(html);
    // doc.close();

    urlInput.value = url;

    if (pushToHistory) {
      // Trim forward history if we navigate after going back
      historyStack = historyStack.slice(0, historyIndex + 1);
      historyStack.push(url);
      historyIndex = historyStack.length - 1;
    }

    updateNavButtons();
    statusText.textContent = "Loaded " + url;
  } catch (err) {
    console.error(err);
    statusText.textContent = "Error loading page";
  }
}

function updateNavButtons() {
  backBtn.disabled = historyIndex <= 0;
  forwardBtn.disabled = historyIndex >= historyStack.length - 1;
}

urlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loadUrl(urlInput.value, true);
});

backBtn.addEventListener("click", () => {
  if (historyIndex > 0) {
    historyIndex--;
    const url = historyStack[historyIndex];
    loadUrl(url, false);
  }
});

forwardBtn.addEventListener("click", () => {
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    const url = historyStack[historyIndex];
    loadUrl(url, false);
  }
});

reloadBtn.addEventListener("click", () => {
  if (historyIndex >= 0) {
    const url = historyStack[historyIndex];
    loadUrl(url, false);
  }
});

// Optional: load a default page
// loadUrl("https://example.com");
