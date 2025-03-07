const audioFileInput = document.getElementById("audioFile");
const lrcFileInput = document.getElementById("lrcFile");
const audioPlayer = document.getElementById("audioPlayer");
const lyricsContainer = document.getElementById("lyrics");

let lyricsData = [];

audioFileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        audioPlayer.src = url;
    }
});

lrcFileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            parseLRC(e.target.result);
        };
        reader.readAsText(file);
    }
});

function parseLRC(lrcText) {
    lyricsData = [];
    lyricsContainer.innerHTML = "";

    const lines = lrcText.split("\n");
    for (let line of lines) {
        const match = line.match(/(\d+):(\d+\.\d+)(.+)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseFloat(match[2]);
            const time = minutes * 60 + seconds;
            const text = match[3].trim();

            lyricsData.push({ time, text });
        }
    }
}

audioPlayer.addEventListener("timeupdate", function () {
    const currentTime = audioPlayer.currentTime;

    for (let i = 0; i < lyricsData.length; i++) {
        if (
            currentTime >= lyricsData[i].time &&
            (i === lyricsData.length - 1 || currentTime < lyricsData[i + 1].time)
        ) {
            lyricsContainer.innerHTML = `<p class="current-line">${lyricsData[i].text}</p>`;
            break;
        }
    }
});