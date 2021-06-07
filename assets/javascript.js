const weatherAPiKey = "f46a6b432cc759cfa77ed4d2d06d5ecf";

const searchForLocation = async (cityName) => {
  let forecastData;
  let oneCallData;
  const forecastApiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherAPiKey}`;

  await fetch(forecastApiURL).then(res => {
    return res.json();
  }).then(data => {
    console.log(data);
    forecastData = data;
  }).catch(err => {
    console.log(`There was an error fetching data [${err.message}]`);
    throw new Error(err.message);
  });

  const { lat, lon } = forecastData.city.coord;
  const oneCallApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherAPiKey}`;

  await fetch(oneCallApiUrl).then(res => {
    return res.json();
  }).then(data => {
    console.log(data.current);
    oneCallData = data.current;
  }).catch(err => {
    console.log(`There was an error fetching data [${err.message}]`);
    throw new Error(err.message);
  });

  renderGeneralCityInfo(forecastData, oneCallData);
};

const renderGeneralCityInfo = (forecastData, oneCallData) => {
  const { city } = forecastData;
  const { temp, wind_speed, humidity, uvi } = oneCallData;

  const date = new Date();
  const dateDay = date.getDate();
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();
  const formattedDate = `${dateMonth}/${dateDay}/${dateYear}`;
  const kelvinToFahrenheit = (((temp - 273.15) * (9 / 5)) + 32);
  const getUviClass = (uvIndex) => {
    if (uvIndex < 2) return "low";
    if (uvIndex < 5) return "moderate";
    if (uvIndex < 7) return "high";
    if (uvIndex < 10) return "very-high";
    if (uvIndex > 10) return "extreme";
  };

  const renderedCityName = `${city.name} (${formattedDate})`;
  const renderedTemperture = `Temp: ${Math.round(kelvinToFahrenheit)}°F`;
  const renderedWindSpeed = `Wind: ${wind_speed} MPH`;
  const renderedHumidity = `Humidity: ${humidity} %`;
  const renderedUvIndex = `UV Index: <span class="uvi-pill ${getUviClass(uvi)}">${uvi}</span>`;

  const generalCityWeatherInfo = (`
    <h2>${renderedCityName}</h2>
    <h5>${renderedTemperture}</h5>
    <h5>${renderedWindSpeed}</h5>
    <h5>${renderedHumidity}</h5>
    <h5>${renderedUvIndex}</h5>
  `);

  $('#general-city-weather-info').empty().html(generalCityWeatherInfo);
};

const searchButton = $('#forecast-search-button');
searchButton.on('click', () => {
  const searchInputValue = $('#search-input').val() || '';
  searchForLocation(searchInputValue);
});