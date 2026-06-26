// ==========================================
// 1. TRANSLATIONS & GLOBAL FUNCTIONS
// ==========================================
const translations = {
  en: {
    title: "Hey, Seviko 💞 ",
    welcome: "Because you're against Spotify, I thought I'd bring you a playlist from it anyway.",
    playlist: "Our Playlist",
    memories: "Memories",
    letter: "A Letter For You",
    title1: "hi, Vsevolode",
    playlistTitle: "Our Playlist",
    playlistSubtitle: "Here are songs we listened to in Tbilisi, and some I just wanted to share, enjoyy!"
  },
  ka: {
    title: "გამარჯობა, სევიკო 💞",
    welcome: "რადგან სპოტიფაის წინააღმდეგი ხარ, ერთი ფლეილისტი მაინც მოვიპარე შენთვის.",
    playlist: "ჩვენი ფლეილისტი",
    memories: "მოგონებები",
    letter: "წერილი შენთვის",
    title1: "გამარჯობა, Vsevolode",
    playlistTitle: "ჩვენი ფლეილისტი",
    playlistSubtitle: "ეს ის სიმღერებია, რომლებსაც თბილისში ვუსმენდით და ასევე უბრალოდ მინდა გაგიზიარო, ისიამოვნე!"
  },
  ru: {
    title: "Привет, Севико 💞",
    welcome: "Раз уж ты против Spotify, вот тебе плейлист именно оттуда.",
    playlist: "Наш плейлист",
    memories: "Воспоминания",
    letter: "Письмо для тебя",
    title1: "Привет, Vsevolode",
    playlistTitle: "Наш плейлист",
    playlistSubtitle: "Вот песни, которые мы слушали в Тбилиси, и некоторые, которыми я просто хотела поделиться, наслаждайся!"
  },
  ua: {
    title: "Привіт, Сєвіко 💞",
    welcome: "Раз ти проти Spotify, ось тобі плейлист саме звідти.",
    playlist: "Наш плейлист",
    memories: "Спогади",
    letter: "Лист для тебе",
    title1: "Привіт, Vsevolode",
    playlistTitle: "Наш плейлист",
    playlistSubtitle: "Ось пісні, які ми слухали в Тбілісі, і деякі, якими я просто хотіла поділитися, насолоджуйся!"
  }
};

function changeLanguage(lang) {
    if (!translations[lang]) return; // Safety check
    
    // --- 1. Update the Text ---
    const updateEl = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    updateEl("title", translations[lang].title);
    updateEl("welcome", translations[lang].welcome);
    updateEl("playlist-title", translations[lang].playlistTitle);
    updateEl("playlist-subtitle", translations[lang].playlistSubtitle);
    updateEl("playlist-menu", translations[lang].playlist); 
    updateEl("memories-menu", translations[lang].memories);
    updateEl("letter-menu", translations[lang].letter);

    // --- 2. Update the Highlighted Button ---
    // First, remove the 'active' class from ALL language buttons
    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.remove("active"); 
    });

    // Second, find the button we just clicked and add the 'active' class to it
    const activeBtn = document.getElementById(`lang-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add("active");
    }
}

async function downloadSong(src) {
    try {
        const response = await fetch(src);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = src.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed (might be a CORS issue with the audio source):", error);
    }
}

function showLove() {
    const secretEl = document.getElementById("secret");
    if (secretEl) secretEl.style.display = "block";
}

function correct() {
    alert("Correct ❤️ New surprise unlocked!");
}

function showLemonade() {
    const drink = document.querySelector(".hidden-lemonade");
    if (drink) {
        drink.animate([
            { transform: "scale(1)" },
            { transform: "scale(1.25) rotate(-12deg)" },
            { transform: "scale(1)" }
        ], { duration: 500 });
    }

    const msg = document.getElementById("lemon-message");
    if (msg) {
        msg.style.opacity = 1;
        setTimeout(() => { msg.style.opacity = 0; }, 3000);
    }
}


// ==========================================
// 2. DOM-DEPENDENT LOGIC (Runs after HTML loads)
// ==========================================
// ==========================================
// 2. DOM-DEPENDENT LOGIC (Runs after HTML loads)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    
    // --- AUDIO & HEARTS LOGIC ---
    let audios = Array.from(document.querySelectorAll("audio"));
    const hearts = ["💗", "💖", "💕", "💘"];

    function isAnyAudioPlaying() {
        return audios.some(audio => !audio.paused);
    }

    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("heart-particle");
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = Math.random() * 100 + "vh";
        heart.style.fontSize = (12 + Math.random() * 10) + "px";
        heart.style.animationDuration = (6 + Math.random() * 4) + "s";
        document.body.appendChild(heart);

        setTimeout(() => { heart.remove(); }, 7000);
    }

    setInterval(() => {
        if (isAnyAudioPlaying()) createHeart();
    }, 400);

    // Simplified: Just tell the audio to play. The event listener below handles the rest!
    function playAudio(index) {
        const audio = audios[index];
        if (audio) audio.play(); 
    }
    window.playAudio = playAudio; 

    // THE MAGIC FIX: Listen to the native audio events directly
    audios.forEach((audio, index) => {
        
        // 1. WHEN ANY AUDIO STARTS PLAYING
        audio.addEventListener("play", (e) => {
            // Pause all other songs automatically
            audios.forEach(a => {
                if (a !== e.target) {
                    a.pause();
                }
            });

            // Highlight the correct song card
            document.querySelectorAll(".song-card").forEach(c => c.classList.remove("playing"));
            e.target.closest(".song-card")?.classList.add("playing");

            // Spin vinyl faster (2 seconds per rotation)
            const vinyl = document.querySelector(".vinyl");
            if (vinyl) {
                vinyl.classList.add("playing");
                vinyl.style.animationDuration = "2s"; 
            }

            // Start visualizer bars
            document.querySelectorAll(".visualizer span").forEach(bar => {
                bar.style.animationPlayState = "running";
            });
        });

        // 2. WHEN AUDIO PAUSES
        audio.addEventListener("pause", () => {
            if (!isAnyAudioPlaying()) {
                // Slow down vinyl (10 seconds per rotation)
                const vinyl = document.querySelector(".vinyl");
                if (vinyl) {
                    vinyl.classList.remove("playing");
                    vinyl.style.animationDuration = "10s"; 
                }
                
                // Stop visualizer bars
                document.querySelectorAll(".visualizer span").forEach(bar => {
                    bar.style.animationPlayState = "paused";
                });
            }
        });

        // 3. AUTOPLAY NEXT SONG
        audio.addEventListener("ended", () => {
            if (index + 1 < audios.length) playAudio(index + 1);
        });
    });

    // 4. CARD CLICK LOGIC
    document.querySelectorAll(".song-card").forEach((card, index) => {
        card.addEventListener("click", (e) => {
            // Ignore if they click the actual audio controls (prevents double-firing)
            if (e.target.tagName.toLowerCase() === 'audio') return;
            
            // If the clicked song is already playing, pause it. Otherwise, play it.
            const audio = audios[index];
            if (!audio.paused) {
                audio.pause();
            } else {
                playAudio(index);
            }
        });
    });

    // ... [KEEP YOUR DOWNLOAD PLAYLIST, STACK, AND MINIGAME LOGIC EXACTLY AS IT WAS DOWN HERE] ...
    window.playAudio = playAudio; // Make available globally if needed

    audios.forEach((audio, index) => {
        // Autoplay next
        audio.addEventListener("ended", () => {
            if (index + 1 < audios.length) playAudio(index + 1);
        });

        // Pause UI updates
        audio.addEventListener("pause", () => {
            if (!isAnyAudioPlaying()) {
                document.querySelector(".vinyl")?.classList.remove("playing");
                document.querySelectorAll(".visualizer span").forEach(bar => bar.style.animationPlayState = "paused");
            }
        });
    });

    // Fix the "bubbling" click issue on song cards
    document.querySelectorAll(".song-card").forEach((card, index) => {
        card.addEventListener("click", (e) => {
            // Ignore clicks if the user is clicking the actual audio controls
            if (e.target.tagName.toLowerCase() === 'audio') return;
            playAudio(index);
        });
    });

    // --- PLAYLIST DOWNLOAD ---
    const downloadBtn = document.getElementById("downloadPlaylist");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const songs = document.querySelectorAll(".song-card");
            let m3u = "#EXTM3U\n";

            songs.forEach(card => {
                const audio = card.querySelector("audio");
                const source = audio?.querySelector("source")?.getAttribute("src") || audio?.getAttribute("src");
                const title = card.querySelector(".song-details h3")?.textContent || "Unknown";

                if (source) {
                    m3u += `#EXTINF:-1,${title}\n`;
                    m3u += `${source}\n`;
                }
            });

            const blob = new Blob([m3u], { type: "audio/x-mpegurl" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "playlist.m3u";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
    }

    // --- POLAROID STACK LOGIC ---
    const stack = document.getElementById("stack");
    const spreadArea = document.getElementById("spreadArea");
    const photos = Array.from(document.querySelectorAll(".polaroid"));
    let opened = false;

    if (stack && spreadArea) {
        stack.addEventListener("click", () => {
            opened ? closeStack() : openStack();
            opened = !opened;
        });

        function openStack() {
            spreadArea.innerHTML = "";
            const spacing = 240; 
            photos.forEach((photo, i) => {
                const clone = photo.cloneNode(true);
                clone.classList.remove("polaroid");
                clone.classList.add("spread");

                const x = i * spacing;
                const y = Math.abs(i % 2) * 30;
                const rotateValues = [-8, -4, 0, 4, 8];
                const rotate = rotateValues[i % rotateValues.length];

                clone.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
                clone.style.zIndex = i;
                spreadArea.appendChild(clone);
            });

            photos.forEach(p => p.style.opacity = "0");
        }

        function closeStack() {
            spreadArea.innerHTML = "";
            photos.forEach(p => {
                p.style.opacity = "1";
                p.style.transform = "scale(1) rotate(0deg)";
            });
        }
    }

    // --- MINI GAME LOGIC ---
    const gameArea = document.getElementById("game-area");
    const scoreDisplay = document.getElementById("game-score");
    const reward = document.getElementById("reward");
    const secret = document.getElementById("secret-polaroid");

    let score = 0;
    const targetScore = 20;
    let gameFinished = false;

    // Only run game if elements exist on the page
    if (gameArea && scoreDisplay) {
        function createHeartBurst(x, y) {
            for (let i = 0; i < 8; i++) {
                const heart = document.createElement("div");
                heart.className = "burst-heart";
                heart.innerHTML = "💖";
                heart.style.left = x + "px";
                heart.style.top = y + "px";

                const angle = Math.random() * Math.PI * 2;
                const distance = 40 + Math.random() * 30;

                heart.style.setProperty("--dx", Math.cos(angle) * distance + "px");
                heart.style.setProperty("--dy", Math.sin(angle) * distance + "px");

                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 900);
            }
        }

        function winGame() {
            if (gameFinished) return;
            gameFinished = true;
            if (reward) {
                reward.hidden = false;
                reward.innerHTML = "🎉 HAPPIEST BIRTHDAY";
            }
            if (secret) secret.style.display = "block";
            document.querySelectorAll(".note").forEach(n => n.remove());
        }

        function createNote() {
            if (gameFinished) return;

            const note = document.createElement("div");
            note.classList.add("note");
            const random = Math.random();

            if (random < 0.15) {
                note.innerHTML = "🌟";
                note.dataset.points = 2;
                note.classList.add("gold");
            } else if (random < 0.25) {
                note.innerHTML = "💣";
                note.dataset.points = -1;
                note.classList.add("bomb");
            } else {
                note.innerHTML = Math.random() > 0.5 ? "🎵" : "🎶";
                note.dataset.points = 1;
            }

            note.style.left = Math.random() * (gameArea.offsetWidth - 60) + "px";
            note.style.animationDuration = (2.5 + Math.random() * 2) + "s";
            note.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;

            note.onclick = () => {
                const rect = note.getBoundingClientRect();
                createHeartBurst(rect.left, rect.top);
                score += Number(note.dataset.points);
                if (score < 0) score = 0;
                scoreDisplay.innerHTML = `${score} / ${targetScore}`;
                note.remove();

                if (score >= targetScore) winGame();
            };

            gameArea.appendChild(note);
            setTimeout(() => note.remove(), 4500);
        }

        setInterval(createNote, 900);
    }
});