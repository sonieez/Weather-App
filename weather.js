import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


function currentDate() {
  const today = dayjs().format('dddd');
  const todayDate = dayjs().format('DD.MM.YYYY')
  
  document.querySelector('.js-current-day').innerHTML = today;
  document.querySelector('.js-current-date').innerHTML = todayDate;
  searchCity();
}


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
      const days = await daysWeather(cityName);
      otherDays(days);
      document.querySelector('.weather-details').classList.add('weather-container');
    }
  });

  const cityInput = document.querySelector('.js-input-city');
  cityInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      const cityName = document.querySelector('.js-input-city').value;

      if (cityName) {
        const data =  await fetchWeatherData(cityName);
        changeWeather(data);
        const days = await daysWeather(cityName);
        otherDays(days);
        document.querySelector('.weather-details').classList.add('weather-container');
      }
      }
  })
}

function changeWeather(data) {
  //console.log(data);
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
  changeMainWeather(weather);
  changeDetailsWeather(weather);
}


function changeMainWeather(weather) {
  const icon = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
  const temperature = Math.round(weather.temp);
  let description = weather.description;
  description = description[0].toUpperCase() + description.slice(1);
  const temperatureMax = Math.ceil(weather.tempMax);
  const temperatureMin = Math.floor(weather.tempMin);
  const feelsLike = Math.round(weather.feelsLike);
  
  const mainHTML = `
    <div class="city-main-info">
      <p class="city-name js-city-name">${weather.name}</p>
      <div class="main-weather">
        ${temperature}°
        <img class="weather-icon" src=${icon}>
      </div>
      <div class="main-info">
        <p>${description}</p>
        <p>${temperatureMax}°/ ${temperatureMin}°</p>
        <p>Feels like ${feelsLike}°</p>
      </div>
    </div>
  `;

  document.querySelector('.city-main-info-container').innerHTML = mainHTML;
}

function changeDetailsWeather(weather) {
  const humidity = weather.humidity;
  const pressure = weather.pressure;
  const windSpeed = weather.windSpeed;
  const visibility = (weather.visibility) / 1000;


  const otherHTML = `
    <div class="details">
      <img class="icon" src="https://cdn-icons-png.flaticon.com/128/727/727891.png">
      <div>
        <p class="detail-name">Humidity</p>
        <p class="detail-info">${humidity}%</p>
      </div>
    </div>

    <div class="details">
      <img class="icon" src="https://cdn-icons-png.flaticon.com/128/2294/2294639.png">
      <div>
        <p class="detail-name">Pressure</p>
        <p class="detail-info">${pressure} mb</p>
      </div>
    </div>

    <div class="details">
      <img class="icon" src="https://cdn-icons-png.flaticon.com/128/11742/11742598.png">
      <div>
        <p class="detail-name">Wind speed</p>
        <p class="detail-info">${windSpeed} km/h</p>
      </div>
    </div>

    <div class="details">
      <img class="icon" src="https://cdn-icons-png.flaticon.com/128/6339/6339415.png">
      <div>
        <p class="detail-name">Visibility</p>
        <p class="detail-info">${visibility} km</p>
      </div>
    </div>
  `;

  document.querySelector('.city-info-details').innerHTML = otherHTML;
}

async function daysWeather(cityName) {
  const apiKey = 'ed46d9720c2951f05be4236c97a835c6';

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`);

  try {
    if (!response.ok) {
      throw Error('City was not found!');
    }

    const data = await response.json();
    const dailyForecast = data.list.filter(day =>
      day.dt_txt.includes("12:00:00")
    );
    //console.log(dailyForecast);
    return dailyForecast;

  } catch(error) {
    console.log(error);
  }
}

function otherDays(days) {
  
  let today = dayjs();
  let daysHTML = '';

  days.forEach((day) => {
    today = today.add(1, 'day');
    
    const dayName = today.format('ddd')
    const dayIcon = day.weather[0].icon;
    const tempMax = Math.ceil(day.main.temp_max);
    const tempMin = Math.floor(day.main.temp_min);

    daysHTML += `
      <div class="days">
        <p class="day">${dayName}</p>
        <img class="day-icon" src="https://openweathermap.org/img/wn/${dayIcon}@2x.png">
        <p class="days-temperature">${tempMax}°/${tempMin}°</p>
      </div>
    `
  });

  document.querySelector('.js-days-weather').innerHTML = daysHTML;
}

currentDate();
searchCity();
