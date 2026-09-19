const moodInput = document.getElementById('mood-input');
const generateButton = document.getElementById('generate-button');
const moodChips = document.querySelectorAll('.mood-chip');
const resultSection = document.getElementById('result-section');
const moodHistoryContainer = document.getElementById('mood-history');
const regenerateButton = document.getElementById('regenerate-button');

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

let lastMood = null;

async function fetchMoodQuote(mood) {
    const category = moodToQuoteCategory[mood] || "life";
    const response = await fetch(`https://api.api-ninjas.com/v2/randomquotes?categories=${category}`, {
        headers: { 'X-Api-Key': `${NINJA_API_KEY}` } 
    });
    const result = await response.json();
    return result[0];
}

async function fetchMoodImage(mood) {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${mood}&client_id=${UNSPLASH_ACCESS_KEY}`);
    const result = await response.json();
    return result.results[0]?.urls.regular;
}

async function detectMood(text) {
    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: text }),
        }
    );

    const result = await response.json();
    return result[0]?.[0]?.label || "neutral";
}

async function detectMoodFull(text) {
    const response = await fetch(
        "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Conten"
            }
        }
    )
}

async function fetchAndDisplay(mood, isTypedText = false) {
    const generateButtonOriginalText = generateButton.textContent;
    try {
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';
        moodChips.forEach(chip => { chip.disabled = true; });

        let finalMood = mood;

        if (isTypedText) {
            try {
                finalMood = await detectMood(mood);
                console.log(`Detected mood: ${finalMood}`);
            }
            catch (err) {
                console.log(err);
                finalMood = "calm";
            }
        }

        const result = await fetchMoodQuote(finalMood);
        const imageQuery = moodToImageQuery[finalMood] || "calm minimal";
        const imageUrl = await fetchMoodImage(imageQuery);

        resultSection.style.backgroundColor = moodToColor[finalMood] || "#ffffff";

        document.body.style.backgroundColor = moodToColor[finalMood] || "#ffffff";

        resultSection.innerHTML = `
    <img src="${imageUrl}" alt="Mood image" class="mood-image" />
    <p class="quote-text">"${result.quote}" — ${result.author}</p>
`;
        resultSection.style.display = "flex";
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

detectMood("Today my coach gave me a very hard project with two days deadline and my English teacher wants a presentation about it").then(console.log)