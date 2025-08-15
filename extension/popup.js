// Converts milliseconds to "Xh Ym Zs" format
function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Load and display time spent per website
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(null, (data) => {
    const container = document.getElementById("timeData");
    container.innerHTML = ""; // Clear previous content

    const sites = Object.keys(data);

    if (sites.length === 0) {
      container.textContent = "No data available.";
      return;
    }

    sites.forEach((site) => {
      const timeMs = data[site];
      const formattedTime = formatTime(timeMs);

      const row = document.createElement("div");
      row.style.marginBottom = "8px";
      row.innerHTML = `<strong>${site}</strong>: ${formattedTime}`;
      container.appendChild(row);
    });
  });
});

