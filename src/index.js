// Global variable
let celsuis;

// Update time function
function time() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let day = days[now.getDay()];

    hours = hours <= 9 ? `0${hours}` : hours;
    minutes = minutes <= 9 ? `0${minutes}` : minutes;

    document.querySelector("#time").innerHTML = `${hours}:${minutes}, ${day}`;
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
}

function displayWeatherForecast(response) {
    let weatherForecast = response.data.daily;
    let newWeatherForcast = document.querySelector("#weather-forecast");
    let weatherForecastHTML = `<div class=row>`;

    weatherForecast.forEach(function (weatherForecastDay, index) {
        if (index <= 5) {
            weatherForecastHTML += `
                <div class="col-2">
                    <div id="weather-forecast-day">${formatDay(weatherForecastDay.dt)}</div>
                    <div id="weather-forecast-icon">
                        <img src="http://openweathermap.org/img/wn/${weatherForecastDay.weather[0].icon}@2x.png" alt="" width="42"/>
                    </div>
                    <div id="weather-forecast-tempMin">${Math.round(weatherForecastDay.temp.min)}°</div>
                    <div id="weather-forecast-tempMax">${Math.round(weatherForecastDay.temp.max)}°</div>
                </div>
            `;
        }
    });

    weatherForecastHTML += `</div>`;
    newWeatherForcast.innerHTML = weatherForecastHTML;
}

function getWeatherForecast(coord) {
    const apiKey = "d5a8e815ad3352e76fb600d6bbd808c7";
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl)
        .then(displayWeatherForecast)
        .catch(error => {
            console.error("Error fetching the weather forecast:", error);
        });
}

function displayTemperature(response) {
    const data = response.data;
    celsuis = Math.round(data.main.temp); 

    document.querySelector(".cityName").innerHTML = data.name;
    document.querySelector(".weather-description").innerHTML = data.weather[0].description;
    document.querySelector(".temperature-number").innerHTML = celsuis;
    document.querySelector(".humidity").innerHTML = `Humidity: ${data.main.humidity}%`;
    document.querySelector(".wind").innerHTML = `Wind: ${Math.round(data.wind.speed)}m/s`;
    document.querySelector(".clouds").innerHTML = `Clouds: ${data.clouds.all}%`;
    document.querySelector("#icon").setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    document.querySelector("#icon").setAttribute("alt", data.weather[0].description);

    getWeatherForecast(data.coord);
}

function search(city) {
    const apiKey = "d5a8e815ad3352e76fb600d6bbd808c7";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl)
        .then(displayTemperature)
        .catch(error => {
            console.error("Error fetching the temperature:", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    time();
    setInterval(time, 60000);  // Continuously update time.

    const fahrenheit = document.querySelector("#Fah");
    const cel = document.querySelector("#Celsius");
    const form = document.querySelector("#search-form");
    
    fahrenheit.addEventListener("click", function() {
        cel.classList.remove("active");
        fahrenheit.classList.add("active");
        const tempNew = Math.round((celsuis * 9) / 5 + 32);
        document.querySelector(".temperature-number").innerHTML = tempNew;
    });

    cel.addEventListener("click", function() {
        cel.classList.add("active");
        fahrenheit.classList.remove("active");
        document.querySelector(".temperature-number").innerHTML = celsuis;
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const cityInput = document.querySelector("#cityInput");
        search(cityInput.value);
    });
});


search("Dallas");