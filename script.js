// temp, city, humid, wind, uv
var currCity = $("#currentCity");
var currTemp = $("#Temperature");
var currHumidity = $("#humidity");
var currwindSpeed = $("#windSpeed");
var currUvIndex = $("#uvIndex");
var searchHistory = $(".searchHistory");
var searchCity = $(".input");
var searchButton = $("#searchBtn");

// func. daily
var today = new Date();
let mm = String(today.getMonth() + 1).padStart(2, "0");
let dd = String(today.getDate()).padStart(2, "0");
let yyyy = today.getFullYear();
var date = mm + "/" + dd + "/" + yyyy;
console.log(date);

// local storage area (city)
var cityList = localStorage.getItem("city-list");
if (cityList === null) {
  cityList = [];
} else {
  cityList = JSON.parse(cityList);
  renderList();
}

// action - search for a city
searchButton.on("click", function () {
  var city = searchCity.val();
  if (city) {
    // save search to local storage
    cityList.push(city);
    localStorage.setItem("city-list", JSON.stringify(cityList));

    // current weather
    getWeather(city);
    // 5-Day weather
    get5DayForecast(city);
  }
});

// display render function area
function renderList() {
  var cityListTag = $("ul");
  if (cityListTag.length === 0) {
    cityListTag = $("<ul>");
    searchHistory.append(cityListTag);
  }
  cityListTag.empty();
  for (var e = 0; e < cityList.length; e++) {
    var listItem = $("<li>").text(cityList[e]);
    cityListTag.append(listItem);
  }}

// current weather for the city API & key
function getWeather(city) {
  var apiKey ="3dc762bb679177895958abafb300419a";
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    apiKey;
  
  $.ajax({
    url: queryURL,
    method: "GET",
  })
  .then(function (response) {
    console.log(queryURL);
    console.log(response);

    // creates current weather icon
    var weathericon = response.weather[0].icon;
    var iconurl =
      "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";

    // name, date, and weather will be displayed
    currCity.html(
      "<h1>" +
        response.name +
        " " +
        date +
        "<img src=" +
        iconurl +
        "></img>" +
        "</h1>"
    );

    // converts celsius to fahrenheit
    let tempfahrenheit = (response.main.temp - 273.15) * 1.8 + 32;
    // displays temperature in fahrenheit
    currTemp.text("Temperature: " + tempfahrenheit.toFixed(2) + "°F");
    // displays wind speed
    currwindSpeed.text("Wind Speed: " + response.wind.speed + " mph");
    // displays humidity
    currHumidity.text("Humidity: " + response.main.humidity + "%");

    getUVIndex(response.coord.lon, response.coord.lat);
  });
}

// UV index
function getUVIndex(ln, lt) {
  var apiKey = "3dc762bb679177895958abafb300419a";
  var queryUrl =
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
    apiKey +
    "&lat=" +
    lt
}