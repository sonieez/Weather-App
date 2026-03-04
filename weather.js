async function fetchWeatherData() {
  const apiKey = 'ed46d9720c2951f05be4236c97a835c6';
  const cityName = 'London';

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);

  const data = await response.json();
  
  return data;
}


async function changeWeather() {
  const data = await fetchWeatherData();
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
    windSpeed: data.wind.speed
  }
  //console.log(weather);
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
  const temperature = Math.round(weather.temp);
  document.querySelector('.js-temperature').innerHTML = temperature + '°';

  const description = weather.description;
  document.querySelector('.js-description').innerHTML = description;

  const temperatureMax = Math.ceil(weather.tempMax);
  const temperatureMin = Math.floor(weather.tempMin);
  document.querySelector('.js-temp-max-min').innerHTML = 
    `${temperatureMax}°/${temperatureMin}°`;

  const feelsLike = Math.round(weather.feelsLike);
  document.querySelector('.js-feels-like').innerHTML = `Feels like ${feelsLike}°`;
}

function changeDetailsWeather(weather) {
  const humidity = weather.humidity;
  const pressure = weather.pressure;
  const windSpeed = weather.windSpeed;
  const visibility = (weather.visibility) / 1000;

  document.querySelector('.js-humidity').innerHTML = humidity + ' %';
  document.querySelector('.js-pressure').innerHTML = pressure + ' mb';
  document.querySelector('.js-wind-speed').innerHTML = windSpeed + ' km/h';
  document.querySelector('.js-visibility').innerHTML = visibility + ' km';
}


changeWeather();
