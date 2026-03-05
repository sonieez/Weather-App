async function fetchWeatherData(cityName) {
  const apiKey = 'ed46d9720c2951f05be4236c97a835c6';

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);

  try {
    if (!response.ok) {
      throw Error('City was not found!');
    }

    const data = await response.json();
    return data;

  } catch(error) {
    console.log(error);
  }
    
}

function searchCity() {
  const searchButton = document.querySelector('.js-search-button');
  searchButton.addEventListener('click', async () => {
    const cityName = document.querySelector('.js-input-city').value;

    if (cityName) {
      const data =  await fetchWeatherData(cityName);
      changeWeather(data);
    }
  });

  const cityInput = document.querySelector('.js-input-city');
  cityInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      const cityName = document.querySelector('.js-input-city').value;

      if (cityName) {
        const data =  await fetchWeatherData(cityName);
        changeWeather(data);
      }
      }
  })
}

function changeWeather(data) {
  console.log(data);
  const weather = {
    name: data.name,
    country: data.sys.country,
    visibility: data.visibility,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    temp: data.main.temp,
    tempMax: data.main.temp_max,
    tempMin: data.main.temp_min,
    description: data.weather[0].description,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon
  }
  changeHeader(weather);
  changeMainWeather(weather);
  changeDetailsWeather(weather);
}

function changeHeader(weather) {
  const currentCity = weather.name;
  document.querySelector('.js-city-name').innerHTML = currentCity;

  const currentCountry = weather.country;
  document.querySelector('.js-country-name').innerHTML = currentCountry;
}

function changeMainWeather(weather) {
  const icon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
  const temperature = Math.round(weather.temp);
  const description = weather.description;
  const temperatureMax = Math.ceil(weather.tempMax);
  const temperatureMin = Math.floor(weather.tempMin);
  const feelsLike = Math.round(weather.feelsLike);
  
  const mainHTML = `
    <img class="weather-icon" src="${icon}">
    <p class="temperature js-temperature">${temperature}°</p>
    <p class="weather-status js-description">${description}</p>
    <p class="temperature-max-min js-temp-max-min">
      ${temperatureMax}°/${temperatureMin}°
    </p>
    <p class="temperature-feels-like js-feels-like">
      Feels like ${feelsLike}°
    </p>
  `;

  document.querySelector('.city-main-info').innerHTML = mainHTML;
}

function changeDetailsWeather(weather) {
  const humidity = weather.humidity;
  const pressure = weather.pressure;
  const windSpeed = weather.windSpeed;
  const visibility = (weather.visibility) / 1000;


  const otherHTML = `
    <div class="humidity-container">
      <p class="detail-name">Humidity</p>
      <p class="detail-info js-humidity">${humidity}%</p>
    </div>

    <div class="pressure-container">
      <p class="detail-name">Pressure</p>
      <p class="detail-info js-pressure">${pressure} mb</p>
    </div>

    <div class="wind-speed-container">
      <p class="detail-name">Wind Speed</p>
      <p class="detail-info js-wind-speed">${windSpeed} km/h</p>
    </div>

    <div class="visibility-container">
      <p class="detail-name">Visibility</p>
      <p class="detail-info js-visibility">${visibility} km</p>
    </div>
  `;

  document.querySelector('.city-info-details').innerHTML = otherHTML;
}

searchCity();
