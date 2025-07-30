let currentsong = new Audio();
let songs = [];
let currfolder;
let currentSongIndex = 0;

function convertSecondsToMinSec(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function getsongs(folder) {
  currfolder = folder;
  songs = [];

  // Manually define songs to avoid folder fetch
  const res = await fetch(`${folder}/songs.json`);
  songs = await res.json();

  let songul = document.querySelector(".songlist ul");
  if (!songul) return;

  songul.innerHTML = songs.map(song => `
    <li>
      <img class="invert" width="34" src="img/music.svg" alt="">
      <div class="info">
        <div>${song}</div>
        <div>Czy</div>
      </div>
      <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="img/playmusic.svg" alt="">
      </div>    
    </li>
  `).join("");

  Array.from(songul.getElementsByTagName("li")).forEach((e, index) => {
    e.addEventListener("click", () => {
      currentSongIndex = index;
      playMusic(songs[currentSongIndex]);
    });
  });
}

function playMusic(track, pause = false) {
  currentsong.src = `${currfolder}/${track}`;
  if (!pause) {
    currentsong.play();
    document.getElementById("play").src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerText = track;
  document.querySelector(".songtime").innerText = "00:00 / 00:00";
}

async function displayalbum() {
  const res = await fetch(`songs/albums.json`);
  const albums = await res.json();

  let cartcontainer = document.querySelector(".cartcontainer");
  cartcontainer.innerHTML = "";

  for (let album of albums) {
    cartcontainer.innerHTML += `
      <div data-folder="${album.folder}" class="card">
        <div class="play">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="#1DB954" stroke="black" stroke-width="2" />
            <polygon points="40,30 40,70 70,50" fill="black" />
          </svg>
        </div>
        <img src="songs/${album.folder}/${album.cover}" onerror="this.src='img/defaultcover.jpg';" alt="Album Cover">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      </div>`;
  }

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", async () => {
      let folder = card.dataset.folder;
      await getsongs(`songs/${folder}`);
      currentSongIndex = 0;
      playMusic(songs[currentSongIndex]);
    });
  });
}

async function main() {
  await displayalbum();

  document.getElementById("play").addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      document.getElementById("play").src = "img/pause.svg";
    } else {
      currentsong.pause();
      document.getElementById("play").src = "img/playmusic.svg";
    }
  });

  document.getElementById("previous").addEventListener("click", () => {
    if (currentSongIndex > 0) {
      currentSongIndex--;
      playMusic(songs[currentSongIndex]);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    if (currentSongIndex < songs.length - 1) {
      currentSongIndex++;
      playMusic(songs[currentSongIndex]);
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  currentsong.addEventListener("timeupdate", () => {
    if (!isNaN(currentsong.duration)) {
      document.querySelector(".songtime").innerText = `${convertSecondsToMinSec(currentsong.currentTime)} / ${convertSecondsToMinSec(currentsong.duration)}`;
      document.querySelector(".circle").style.left = `${(currentsong.currentTime / currentsong.duration) * 100}%`;
    }
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  const volumeSlider = document.querySelector(".range input");
  volumeSlider.addEventListener("change", (e) => {
    currentsong.volume = e.target.value / 100;
  });

  document.querySelector(".volume>img").addEventListener("click", e => {
    let icon = e.target;
    if (icon.src.includes("volume.svg")) {
      icon.src = "img/mute.svg";
      currentsong.volume = 0;
      volumeSlider.value = 0;
    } else {
      icon.src = "img/volume.svg";
      currentsong.volume = 0.5;
      volumeSlider.value = 50;
    }
  });
}

main();
