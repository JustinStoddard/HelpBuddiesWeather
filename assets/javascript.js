const weatherAPiKey = "f46a6b432cc759cfa77ed4d2d06d5ecf";

const searchForLocation = async (cityName) => {
  let forecastData;
  let uvIndex;
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
    console.log(data.current.uvi);
    uvIndex = data.current.uvi;
  }).catch(err => {
    console.log(`There was an error fetching data [${err.message}]`);
    throw new Error(err.message);
  });
};

const searchButton = document.getElementById("forecast-search-button");
searchButton.addEventListener('click', () => {
  const searchInputValue = document.getElementById("search-input").value || "";
  searchForLocation(searchInputValue);
});