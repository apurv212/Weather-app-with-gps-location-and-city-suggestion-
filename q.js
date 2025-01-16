
const WEATHER_API_KEY = "ur api key WEATHERapi.com"; 
const GEOCODING_API_KEY = "ur api key from opencagedata.com"; 

let jenterCity = document.getElementById('enterCity');
let jcitySearch = document.getElementById('citySearch');
let jstate = document.getElementById('state');
let jtemp = document.getElementById('temp');
let jaqi = document.getElementById('aqi');
let jicon = document.getElementById('icon');
let jgps = document.getElementById('gps');
let citySuggestions = document.getElementById('citySuggestions');

async function getWeatherData(city) {
    const result = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=yes`
    );
    return await result.json();
}


async function getCitySuggestions(query) {
    const result = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${GEOCODING_API_KEY}&limit=5`
    );
    return await result.json();
}


jenterCity.addEventListener('input', async () => {
    const query = jenterCity.value;
    if (query.length < 3) return;

    const data = await getCitySuggestions(query);
    citySuggestions.innerHTML = ""; 

    data.results.forEach((location) => {
        const option = document.createElement('option');
        option.value = location.formatted;
        citySuggestions.appendChild(option);
    });
});


async function performSearch() {
    let city = jenterCity.value;

    const weatherData = await getWeatherData(city);
    jstate.innerHTML = `Location: ${weatherData.location.name}, ${weatherData.location.country}`;
    jtemp.innerHTML = `Temperature: ${weatherData.current.temp_c}°C`;
    jaqi.innerHTML = `UV Index: ${weatherData.current.uv}`;
    jicon.src = weatherData.current.condition.icon;

    jenterCity.value = ""; 
}

jcitySearch.addEventListener('click', performSearch);
jenterCity.addEventListener('keypress', (e) => {
    if (e.key === "Enter") performSearch();
});


async function locate(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const weatherData = await getWeatherData(`${lat},${lon}`);
    jstate.innerHTML = `Location: ${weatherData.location.name}, ${weatherData.location.country}`;
    jtemp.innerHTML = `Temperature: ${weatherData.current.temp_c}°C`;
    jaqi.innerHTML = `UV Index: ${weatherData.current.uv}`;
    jicon.src = weatherData.current.condition.icon;
}

function handleError() {
    alert("Location access denied.");
}

jgps.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(locate, handleError);
});
