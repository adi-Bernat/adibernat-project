const API_KEY = "4494cfce0f5b6c7cc4a4c576e0862c76";
const URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_KEY}&q=`;


const q = document.getElementById("inputCity");
const button = document.querySelector("button");
const h1 = document.getElementById("city");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const errorMessage = document.getElementById("errorMessage");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const rain = document.getElementById("rain");
const time = document.getElementById("time");


async function getWeather(city) {
    try {
        const response = await fetch(URL + city);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error:", error);
        displayError("שגיאה בטעינת הנתונים");
    }
}


function displayWeather(weatherData) {
    if (weatherData.cod === 200) {

        errorMessage.innerText = "";


        h1.innerText = weatherData.name;
        temp.innerText = `${Math.round(weatherData.main.temp)}°C`;
        description.innerText = getHebrewDescription(weatherData.weather[0].description);
        weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        weatherIcon.alt = weatherData.name;


        humidity.innerText = `לחות: ${weatherData.main.humidity}%`;

        const windSpeed = Math.round(weatherData.wind.speed * 3.6); // המרה למטר/שנייה לקמ"ש
        wind.innerText = `מהירות רוח: ${windSpeed} קמ"ש`;

        const precipitation = weatherData.rain ?
            Math.round((weatherData.rain['1h'] || 0) * 10) / 10 : 0;
        rain.innerText = `משקעים: ${precipitation} מ"מ`;


        const localTime = new Date();
        localTime.setSeconds(localTime.getSeconds() + weatherData.timezone);
        time.innerText = `שעה מקומית: ${localTime.toLocaleTimeString('he-IL')}`;

        console.log(weatherData);
    } else {
        displayError("העיר לא נמצאה");
    }
}

function displayError(message) {
    h1.innerText = "";
    temp.innerText = "";
    description.innerText = "";
    weatherIcon.src = "";
    weatherIcon.alt = "";
    humidity.innerText = "";
    wind.innerText = "";
    rain.innerText = "";
    time.innerText = "";
    errorMessage.innerText = message;
}


function getHebrewDescription(englishDesc) {
    const translations = {
        'clear sky': 'שמיים בהירים',
        'few clouds': 'מעט עננים',
        'scattered clouds': 'עננים מפוזרים',
        'broken clouds': 'עננים מקוטעים',
        'shower rain': 'ממטרים',
        'rain': 'גשם',
        'thunderstorm': 'סופת רעמים',
        'snow': 'שלג',
        'mist': 'ערפל',
        'overcast clouds': 'מעונן',
        'light rain': 'גשם קל',
        'moderate rain': 'גשם בינוני',
        'heavy rain': 'גשם כבד'
    };

    return translations[englishDesc.toLowerCase()] || englishDesc;
}


button.addEventListener("click", () => {
    if (q.value.trim()) {
        getWeather(q.value.trim());
    } else {
        displayError("אנא הכנס שם עיר");
    }
});

q.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && q.value.trim()) {
        getWeather(q.value.trim());
    }
});