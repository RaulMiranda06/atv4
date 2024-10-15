let correctCountry;
let options = [];
let timer; // Variável para o temporizador
const timeLimit = 30; // Limite de tempo em segundos

function getCountryNameInPortuguese(country) {
    return country.translations && country.translations.por ? country.translations.por.common : country.name.common;
}

function getRandomCountries() {
    fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        correctCountry = data[randomIndex];
        options = [correctCountry];

        while (options.length < 4) {
            const randomOption = data[Math.floor(Math.random() * data.length)];
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }

        options.sort(() => Math.random() - 0.5);
        displayQuestion();
    })
    .catch(error => console.error('Erro:', error));
}

function displayQuestion() {
    document.getElementById('flagImage').src = correctCountry.flags.png;
    document.getElementById('flagImage').style.display = 'block';
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; 
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = getCountryNameInPortuguese(option);
        button.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });

    startTimer(); // Inicia o temporizador
}

function startTimer() {
    let timeLeft = timeLimit;
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.innerHTML = `Tempo: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerHTML = `Tempo: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('result').innerHTML = `<p>Tempo esgotado! O país correto era: ${getCountryNameInPortuguese(correctCountry)}</p>`;
            document.getElementById('nextButton').style.display = 'block'; // Exibe o botão "Próximo"
            disableOptions(); // Desabilita as opções
        }
    }, 1000);
}

function disableOptions() {
    const buttons = document.querySelectorAll('#options button');
    buttons.forEach(button => button.disabled = true);
}

function checkAnswer(selected) {
    clearInterval(timer); // Para o temporizador
    const resultDiv = document.getElementById('result');
    
    if (selected.name.common === correctCountry.name.common) {
        resultDiv.innerHTML = '<p>Correto!</p>';
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O país correto era: ${getCountryNameInPortuguese(correctCountry)}</p>`;
    }
    
    document.getElementById('nextButton').style.display = 'block';
}

document.getElementById('nextButton').onclick = () => {
    document.getElementById('result').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';
    getRandomCountries(); // Carrega uma nova bandeira
};

getRandomCountries();
