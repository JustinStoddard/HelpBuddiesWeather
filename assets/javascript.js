const weatherAPiKey = "f46a6b432cc759cfa77ed4d2d06d5ecf";

const searchForLocation = async (cityName) => {
  let forecastData;
  let oneCallData;
  const forecastApiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weatherAPiKey}`;

  await fetch(forecastApiURL).then(res => {
    return res.json();
  }).then(data => {
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
    oneCallData = data;
  }).catch(err => {
    console.log(`There was an error fetching data [${err.message}]`);
    throw new Error(err.message);
  });

  renderGeneralCityInfo(forecastData, oneCallData);
  render5DayForecast(oneCallData);
};

const renderGeneralCityInfo = (forecastData, oneCallData) => {
  const { city } = forecastData;
  const { temp, wind_speed, humidity, uvi } = oneCallData.current;

  const date = new Date();
  const dateDay = date.getDate();
  const dateMonth = date.getMonth() + 1;
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

const render5DayForecast = (oneCallData) => {
  const { daily } = oneCallData;

  const renderedForecastData = daily.map((item, i) => {
    const { dt, temp, wind_speed, humidity } = item;

    const date = new Date(dt * 1000);
    const dateDay = date.getDate();
    const dateMonth = date.getMonth() + 1;
    const dateYear = date.getFullYear();

    const formattedDate = `${dateMonth}/${dateDay}/${dateYear}`;
    const kelvinToFahrenheit = (((temp.day - 273.15) * (9 / 5)) + 32);
    const renderedTemperture = `Temp: ${Math.round(kelvinToFahrenheit)}°F`;
    const renderedWindSpeed = `Wind: ${wind_speed} MPH`;
    const renderedHumidity = `Humidity: ${humidity} %`;

    if (i > 5 || i === 0) return "";
    return (`
      <div class="forecast-data-card">
        <h3>${formattedDate}</h3>
        <h3>${renderedTemperture}</h3>
        <h3>${renderedWindSpeed}</h3>
        <h3>${renderedHumidity}</h3>
      </div>
    `);
  });

  $('#forecast-data').empty().html(renderedForecastData);
};

const localStorageUtil = (action, value) => {
  if (action === "set") {
    const searches = JSON.parse(localStorage.getItem("searches") ?? "[]");
    searches.push(value);
    localStorage.setItem("searches", JSON.stringify(searches));
  } else if (action === "get") {
    return JSON.parse(localStorage.getItem("searches") ?? "[]");
  }
};

const renderSaveSearches = () => {
  const searches = localStorageUtil("get");
  const renderedSearches = searches.map((search, i) => {
    const trimmedSearch = search.replace(/ /g, "-");
    return `
      <button id="${trimmedSearch + i}">${search}</button>
    `;
  });
  $("#recent-city").empty().html(renderedSearches);

  searches.map((search, i) => {
    const trimmedSearch = search.replace(/ /g, "-");
    $(`#${trimmedSearch}${i}`).on("click", () => {
      searchForLocation(search);
      $("#search-input").val(search);
    });
  });
};

const searchButton = $('#forecast-search-button');
searchButton.off().on('click', () => {
  const searchInputValue = $('#search-input').val() || '';
  if (searchInputValue !== "") {
    searchForLocation(searchInputValue);
    searchForLocation(searchInputValue);
    localStorageUtil("set", searchInputValue);
    renderSaveSearches();
  }
});