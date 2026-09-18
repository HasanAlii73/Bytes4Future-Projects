const moodInput = document.getElementById('mood-input');
const generateButton = document.getElementById('generate-button');
const moodChips = document.querySelectorAll('.mood-chip');
const resultSection = document.getElementById('result-section');

async function fetchMoodImage(mood) {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${mood}&client_id=${UNSPLASH_ACCESS_KEY}`);
        const result = await response.json();
        return result.results[0]?.urls.regular;
}

async function fetchAndDisplay(mood) {
    const generateButtonOriginalText = generateButton.textContent;
    try {
        generateButton.disabled = true;
        generateButton.textContent = 'Generating...';
        moodChips.forEach(chip => { chip.disabled = true; });

        const response = await fetch(`https://dummyjson.com/quotes/random`)
        const result = await response.json();
        console.log(result);
        resultSection.textContent = `${result.quote} - ${result.author}`;
        const imageUrl = await fetchMoodImage(mood);
        console.log(imageUrl);
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
    fetchAndDisplay(mood);
});

moodChips.forEach(chip => {
    chip.addEventListener('click', async () => {
        const mood = chip.getAttribute('data-mood');
        fetchAndDisplay(mood);
    });
});