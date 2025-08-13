document.addEventListener('DOMContentLoaded', function() {
  const showBtn = document.getElementById('showBannerBtn');
  const hideBtn = document.getElementById('hideBannerBtn');
  const statusDiv = document.getElementById('bannerStatus');
  const analysisPreview = document.getElementById('analysisPreview');
  const analysisText = document.getElementById('analysisText');

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    
    chrome.tabs.sendMessage(currentTab.id, { type: "getBannerStatus" }, function(response) {
      if (chrome.runtime.lastError) {
        statusDiv.textContent = "Extension not active on this page";
        statusDiv.className = "status hidden";
        return;
      }
      
      if (response) {
        updateStatus(response.isVisible, response.lastResult);
      }
    });
  });

  // Show banner button
  showBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "showBanner" }, function(response) {
        if (response && response.success) {
          updateStatus(true);
        }
      });
    });
  });

  // Hide banner button
  hideBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "hideBanner" }, function(response) {
        if (response && response.success) {
          updateStatus(false);
        }
      });
    });
  });

  function updateStatus(isVisible, lastResult = null) {
    if (isVisible) {
      statusDiv.textContent = "✅ Health Alert Banner is visible";
      statusDiv.className = "status visible";
      showBtn.disabled = true;
      hideBtn.disabled = false;
    } else {
      statusDiv.textContent = "❌ Health Alert Banner is hidden";
      statusDiv.className = "status hidden";
      showBtn.disabled = false;
      hideBtn.disabled = true;
    }
    
    if (lastResult && lastResult !== "Analyzing page content...") {
      analysisPreview.style.display = "block";
      analysisText.textContent = lastResult.substring(0, 200) + "...";
    }
  }
});