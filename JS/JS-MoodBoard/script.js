const moodInput = document.getElementById('mood-input');
const generateButton = document.getElementById('generate-button');
const moodChips = document.querySelectorAll('.mood-chip');
const resultSection = document.getElementById('result-section');
const moodHistoryContainer = document.getElementById('mood-history');
const regenerateButton = document.getElementById('regenerate-button');
const resultCard = document.getElementById('result-card');
const resultContent = document.getElementById('result-content');
const closeButton = document.getElementById('close-button');

let lastMood = null;

const moodToImageQuery = {
    joy: "happiness sunshine",
    sadness: "rain melancholy",
    anger: "storm intense",
    fear: "dark fog",
    surprise: "fireworks colorful",
    disgust: "abstract chaos",
    neutral: "calm minimal",
    happy: "Laughing smiling",
    anxious: "nervous worried",
    calm: "peaceful serene",
    excited: "excited energetic",
    angry: "furious enraged",
};
const moodToColor = {
    joy: "#FFF3B0",
    happy: "#FFF3B0",
    sadness: "#B8D4E8",
    anger: "#F4B6B6",
    angry: "#F4B6B6",
    fear: "#D8D3E8",
    anxious: "#D8D3E8",
    surprise: "#FFD9A8",
    excited: "#FFD9A8",
    disgust: "#C9E4B0",
    neutral: "#F5F5F5",
    calm: "#F5F5F5"
};
const moodToQuoteCategory = {
    joy: "happiness",
    happy: "happiness",
    sadness: "life",
    anger: "courage",
    angry: "courage",
    fear: "fear",
    anxious: "fear",
    surprise: "success",
    excited: "success",
    disgust: "truth",
    neutral: "philosophy",
    calm: "philosophy"
};
const moodToMusicTag = {
    joy: "happy", happy: "happy",
    sadness: "sad",
    anger: "energetic", angry: "energetic",
    fear: "dark", anxious: "dark",
    surprise: "uplifting", excited: "uplifting",
    disgust: "dark",
    neutral: "chillout", calm: "chillout"
};

async function fetchMoodMusic(mood) {
    const tag = moodToMusicTag[mood] || "chillout";
    const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1&tags=${tag}&audioformat=mp32`);
    const result = await response.json();
    console.log(result.results);
    return result.results[0];
}

async function fetchMoodQuote(mood) {
    const category = moodToQuoteCategory[mood] || "life";
    const response = await fetch(`https://api.api-ninjas.com/v2/randomquotes?categories=${category}`, {
        headers: { 'X-Api-Key': `${NINJA_API_KEY}` }
    });
    const result = await response.json();
    return result[0];
}

async function fetchMoodImage(mood) {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${mood}&client_id=${UNSPLASH_ACCESS_KEY}`);
    const result = await response.json();
    return result.urls?.regular;
}

async function detectMoodFull(text) {
    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: text })
        }
    );
    const result = await response.json();
    return result[0] || [{ label: 'neutral', score: 1 }]
}

function buildBreakdownHTML(emotionArray) {
    const top3 = emotionArray.slice(0, 3);
    const rows = top3.map(e =>
        `<div class="emotion-row">
            <span class="emotion-label">${e.label}</span>
            <div class="emotion-bar-track">
                <div class="emotion-bar-fill" style="width:${Math.round(e.score * 100)}%"></div>
            </div>
            <span class="emotion-score">${Math.round(e.score * 100)}%</span>
        </div>`
    ).join("");
    return `<div class="emotion-breakdown">${rows}</div>`;
}

function saveToHistory(entry) {
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]')
    history.unshift(entry)
    const trimmed = history.slice(0, 6);
    localStorage.setItem('moodHistory', JSON.stringify(trimmed))
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    if (history.length === 0) {
        moodHistoryContainer.innerHTML = "";
        return;
    }
    moodHistoryContainer.innerHTML = `
           <h3 id="history-title">Recent moods</h3>
        <div class="history-strip" aria-hidden="true">
            ${history.map(item => `
                <div class="history-card" style="background-color:${moodToColor[item.mood] || '#f5f5f5'}">
                    <img src="${item.imageUrl}" alt="${item.mood}" />
                    <p>${item.mood}</p>
                </div>
            `).join("")}
        </div>`;
    const historyTitle = document.getElementById("history-title");
    const historyStrip = document.querySelector(".history-strip");
    historyTitle.setAttribute("aria-expanded", "false");
    historyTitle.addEventListener("click", () => {
        const isOpen = historyStrip.classList.toggle("is-open");
        historyStrip.setAttribute("aria-hidden", String(!isOpen));
        historyTitle.setAttribute("aria-expanded", String(isOpen));
    });
}

async function generateResult(mood, breakdownHTML = "") {
    resultContent.innerHTML = `<div class="spinner"></div>`;
    resultSection.style.display = "flex";
    resultSection.classList.add("visible");

    const result = await fetchMoodQuote(mood);
    const imageQuery = moodToImageQuery[mood] || "calm minimal";
    const imageUrl = await fetchMoodImage(imageQuery);
    const track = await fetchMoodMusic(mood);

    resultSection.style.backgroundColor = moodToColor[mood] || "#ffffff";

    resultContent.innerHTML = `
        <img src="${imageUrl}" alt="Mood image" class="mood-image" />
        <p class="quote-text">"${result.quote}" — ${result.author}</p>
        ${breakdownHTML}
        ${track ? `
            <audio controls autoplay src="${track.audio}"></audio>
            <p class="track-info">🎵 ${track.name} — ${track.artist_name}</p>
        ` : `<p class="track-info">No matching track found</p>`}
    `;

    saveToHistory({ mood, quote: result.quote, author: result.author, imageUrl });
    lastMood = mood;
    regenerateButton.style.display = "inline-block";
}

async function fetchAndDisplay(mood, isTypedText = false) {
    const generateButtonOriginalText = generateButton.textContent;
    try {
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';
        moodChips.forEach(chip => { chip.disabled = true; });

        let finalMood = mood;
        let breakdownHTML = "";

        if (isTypedText) {
            try {
                const emotionArray = await detectMoodFull(mood);
                finalMood = emotionArray[0]?.label || "neutral";
                breakdownHTML = buildBreakdownHTML(emotionArray);
                console.log(`Detected mood: ${finalMood}`);
            }
            catch (err) {
                console.log(err);
                finalMood = "calm";
            }
        }
        await generateResult(finalMood, breakdownHTML);
    }
    catch (err) {
        console.log(err);
    }
    finally {
        generateButton.disabled = false;
        generateButton.textContent = generateButtonOriginalText;
        moodChips.forEach(chip => { chip.disabled = false; });
    }
}

function start() {
    generateButton.addEventListener('click', async () => {
        const mood = moodInput.value.trim();
        if (!mood) {
            alert('Please type a feeling or pick a mood chip first!');
            return;
        }
        fetchAndDisplay(mood, true);
    });

    moodChips.forEach(chip => {
        chip.addEventListener('click', async () => {
            const mood = chip.getAttribute('data-mood');
            fetchAndDisplay(mood);
        });
    });

    regenerateButton.addEventListener('click', async () => {
        if (!lastMood) return;
        regenerateButton.disabled = true;
        await generateResult(lastMood);
        regenerateButton.disabled = false;
    });

    closeButton.addEventListener('click', () => {
        const audio = resultContent.querySelector('audio');
        if (audio) audio.pause();
        resultSection.classList.remove('visible');
        resultSection.style.display = 'none';
    });

    renderHistory();
}


// detectMoodFull("Today my coach gave me a very hard project with two days deadline and my English teacher wants a presentation about it").then(console.log)
start();