const playlistUrl =
  "https://raw.githubusercontent.com/abusaeeidx/IPTV-Scraper-Zilla/main/combined-playlist.m3u";

const video = document.getElementById("video");
const channelList = document.getElementById("channelList");
const searchInput = document.getElementById("search");

let channels = [];

fetch(playlistUrl)
  .then(res => res.text())
  .then(data => {
    const lines = data.split("\n");

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#EXTINF")) {
        const name = lines[i].split(",")[1]?.trim();
        const url = lines[i + 1]?.trim();

        if (name && url) {
          channels.push({ name, url });
        }
      }
    }

    renderChannels(channels);
  })
  .catch(err => {
    channelList.innerHTML = "Failed to load playlist.";
    console.error(err);
  });

function renderChannels(list) {
  channelList.innerHTML = "";
  list.forEach(channel => {
    const div = document.createElement("div");
    div.className = "channel";
    div.textContent = channel.name;
    div.onclick = () => playStream(channel.url);
    channelList.appendChild(div);
  });
}

function playStream(url) {
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
  }
}

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = channels.filter(c =>
    c.name.toLowerCase().includes(value)
  );
  renderChannels(filtered);
});


