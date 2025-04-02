console.log("Let's write JavaScript");

let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let response = await fetch(`https://raw.githubusercontent.com/Hegde1122/Groovify-WebPlayer/main/${currfolder}/info.json`);
  let data = await response.json();
  songs = data.songs;

  let songul = document.querySelector(".songlist ul");
  songul.innerHTML = "";
  for (const song of songs) {
    songul.innerHTML += `<li> <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song}</div>
                                <div>Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> </li>`;
  }
  document.querySelectorAll(".songlist li").forEach((e, index) => {
    e.addEventListener("click", () => playMusic(songs[index]));
  });
}

const playMusic = (track, pause = false) => {
  currentsong.src = `https://raw.githubusercontent.com/Hegde1122/Groovify-WebPlayer/main/${currfolder}/${track}`;
  if (!pause) {
    currentsong.play();
    document.getElementById("play").src = "pause.svg";
  }
  document.querySelector(".songinfo").innerText = decodeURIComponent(track);
};

async function displayAlbums() {
  let response = await fetch(`https://raw.githubusercontent.com/Hegde1122/Groovify-WebPlayer/main/songs/albums.json`);
  let albums = await response.json();
  let cardContainer = document.querySelector(".cardContainer");
  let newHTML = "";

  albums.forEach(album => {
    newHTML += `<div data-folder="${album.folder}" class="card">
                    <div class="play">
                        <svg width="64" height="64" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="27" fill="1fdf64" />
                            <path d="M25 42V22L45 32L25 42Z" fill="black" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <img src="https://raw.githubusercontent.com/Hegde1122/Groovify-WebPlayer/main/songs/${album.folder}/cover.jpg" alt="">
                    <h2>${album.title}</h2>
                    <p>${album.description}</p>
                </div>`;
  });
  cardContainer.innerHTML += newHTML;
  document.querySelectorAll(".card").forEach(e => {
    e.addEventListener("click", async () => {
      songs = await getsongs(`songs/${e.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getsongs("songs/ncs");
  playMusic(songs[0], true);
  displayAlbums();
}

main();
