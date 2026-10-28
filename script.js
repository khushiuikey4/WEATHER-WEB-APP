let decodeHtml = (str) => {
    let txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
};

let latitude, longitude;
let resolvedCityName = "";
let temperature, humidity, wind, weathercode;

let getLL = async (city) => {
    try {
        let LLpromise = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        let LLdata = await LLpromise.json();
        if (!LLdata.results || LLdata.results.length === 0) {
            return false;
        }
        latitude = LLdata.results[0].latitude;
        longitude = LLdata.results[0].longitude;
        resolvedCityName = LLdata.results[0].name;
        return true;
    } catch (err) {
        console.error("Geocoding fetch error:", err);
        return false;
    }
};

let getWeather = async (latitude, longitude) => {
    try {
        let weatherPromise = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,windspeed_10m,weathercode&timezone=auto`);
        let weatherData = await weatherPromise.json();
        if (!weatherData.current) {
            return false;
        }
        temperature = weatherData.current.temperature_2m;
        humidity = weatherData.current.relative_humidity_2m;
        weathercode = weatherData.current.weathercode;
        wind = weatherData.current.windspeed_10m;
        return true;
    } catch (err) {
        console.error("Weather fetch error:", err);
        return false;
    }
};

async function getInfo(city) {
    if (!city) return false;
    let found = await getLL(city);
    if (!found) return false;
    return await getWeather(latitude, longitude);
}

let searchButton = document.querySelector(".search-icon");
let cityContainer = document.querySelector(".city");
let temperatureContainer = document.querySelector(".temperature");
let humidityContainer = document.querySelector(".humidity-reading");
let windContainer = document.querySelector(".wind-reading");
let weatherVisual = document.querySelector(".weather-visual");
let weatherDetails = document.querySelector(".weather-details");
let searchCard = document.querySelector(".card");
let firstContainer = document.querySelector(".first");
let otherDetailsContainer = document.querySelector(".other-details");
let body = document.body;
let cardClassList = document.querySelector(".card");
let wDetailClassList = document.querySelector(".weather-details");
let searchField = document.querySelector(".search-inp");
let searchIcon = document.querySelector(".search-icon");
let searchBar = document.querySelector(".search-bar");
let title = document.querySelector(".title");

let df = () => {
    weatherDetails.style.maxHeight = "0px";
    searchCard.style.borderRadius = "20px";
    firstContainer.style.display = "none";
    otherDetailsContainer.style.display = "none";
    body.style.backgroundColor = "rgb(41, 41, 46)";
    body.style.backgroundImage = "none";
    cardClassList.classList.remove("transparent");
    wDetailClassList.classList.remove("transparent");
    searchField.classList.remove("transparent-search");
    searchIcon.classList.remove("transparent-search");
    searchBar.classList.remove("transparent-background");
    title.classList.remove("color-change");
};

let transparentCard = () => {
    cardClassList.classList.add("transparent");
    wDetailClassList.classList.add("transparent");
    searchField.classList.add("transparent-search");
    searchIcon.classList.add("transparent-search");
    searchBar.classList.add("transparent-background");
    title.classList.add("color-change");
};

let searching = async () => {
    let city = searchField.value.trim();
    if (city === "") {
        df();
        return;
    }

    let success = await getInfo(city);
    if (!success) {
        alert("City not found. Please check spelling.");
        return;
    }

    // Setting data visually
    cityContainer.innerText = resolvedCityName || (city.charAt(0).toUpperCase() + city.slice(1));
    temperatureContainer.innerHTML = temperature + "°C";
    humidityContainer.innerHTML = humidity + "%" + decodeHtml("<br>humidity");
    windContainer.innerHTML = wind + decodeHtml("<br>km/h");

    // Image change using weather code
    if (weathercode === 0) {
        weatherVisual.style.backgroundImage = "url('sunny.png')";
        body.style.backgroundImage = "url('sunnyWeather.avif')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else if (weathercode >= 1 && weathercode <= 3) {
        weatherVisual.style.backgroundImage = "url('partialCloudy.png')";
        body.style.backgroundImage = "url('partialCloudyWeather.avif')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else if (weathercode >= 45 && weathercode <= 48) {
        weatherVisual.style.backgroundImage = "url('foggy.png')";
        body.style.backgroundImage = "url('foggyWeather.jpg')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else if (weathercode >= 51 && weathercode <= 57) {
        weatherVisual.style.backgroundImage = "url('drizzle.png')";
        body.style.backgroundImage = "url('drizzleWeather.avif')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else if (weathercode >= 61 && weathercode <= 67) {
        weatherVisual.style.backgroundImage = "url('Rainy.png')";
        body.style.backgroundImage = "url('RainyWeather.png')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else if ((weathercode >= 71 && weathercode <= 77) || weathercode === 85 || weathercode === 86) {
        weatherVisual.style.backgroundImage = "url('snowy.png')";
        body.style.backgroundImage = "url('snowyWeather.jpg')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else if (weathercode >= 80 && weathercode <= 82) {
        weatherVisual.style.backgroundImage = "url('heavyRain.png')";
        body.style.backgroundImage = "url('heavyRainWeather.png')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else if (weathercode === 95) {
        weatherVisual.style.backgroundImage = "url('thunderstorm.png')";
        body.style.backgroundImage = "url('thunderstormWeather.avif')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else if (weathercode >= 96 && weathercode <= 99) {
        weatherVisual.style.backgroundImage = "url('severethunderstorm.png')";
        body.style.backgroundImage = "url('severethunderstormWeather.jpg')";
        body.style.backgroundSize = "cover";
        transparentCard();
    } else {
        weatherVisual.style.backgroundImage = "url('partialCloudy.png')";
        body.style.backgroundImage = "url('partialCloudyWeather.avif')";
        body.style.backgroundSize = "cover";
        transparentCard();
    }

    weatherDetails.style.height = "453px";
    weatherDetails.style.maxHeight = "453px";
    searchCard.style.borderRadius = "20px 20px 0 0";
    firstContainer.style.display = "flex";
    otherDetailsContainer.style.display = "flex";
};

document.querySelector(".card").addEventListener("click", (e) => {
    e.stopPropagation();
});
document.querySelector(".title").addEventListener("click", (e) => {
    e.stopPropagation();
});
document.querySelector(".weather-details").addEventListener("click", (e) => {
    e.stopPropagation();
});
body.addEventListener("click", df);
searchButton.addEventListener("click", searching);
searchField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searching();
    }
});
