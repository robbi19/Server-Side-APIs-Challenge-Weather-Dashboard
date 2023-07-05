
// need  temp,city,humid,wind,uv
var currTemp = $("#Temperature");
var currCity = $("#currentCity");
var currHumidity = $("#humidity");
var currwindSpeed = $("#windSpeed");
var currUvIndex = $("#uvIndex");
var searchHistory = $(".searchHistory");
var searchCity = $(".input");
var searchButton = $("#searchBtn");

// func. day
var today = new Date();
let mm = String(today.getMonth() + 1)
    .padStart(2, "0");
let dd = String(today.getDate())
    .padStart(2, "0");
let yyyy = today.getFullYear();
var date = mm + "/" + dd + "/" + yyyy;
console.log(date);

//local storage city//
var cityList = localStorage.getItem("city-list");
if (cityList === null) {
    cityList = [];
} else {
    cityList = JSON.parse(cityList);
    renderList();
}

// action- search 
searchButton.on("click", function () {

    searchCity.val();
    // saves to local storage
    cityList.push(searchCity.val());
    localStorage.setItem("city-list", JSON.stringify(cityList));

    //current weather 
    getWeather();
    //5-Day weather 
    Get5DayForecast();
});

// display render 
function renderList() {
    var cityListTag = document.querySelector("ul");

    //list will be create
    if (cityListTag === null) {
        cityListTag = document.createElement("ul");
        searchHistory.append(cityListTag);
    }
    var innerList = "";
    for (var e = 0; e < cityList.length; e++) {
        innerList += `<li> ${cityList[e]} </li>`;
    }
    cityListTag.innerHTML = innerList;
}
renderList();

// current weather
function getWeather() {

  var apiKey = "3dc762bb679177895958abafb300419a";
  var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity.val() + "&appid=" + apiKey;

    //ajax call for current weather
    $.ajax({
            url: queryUrl
            , method: "GET"
        , })
        .then(function (response) {
            console.log(queryUrl);
            console.log(response);

            
            var weathericon = response.weather[0].icon;
            var iconurl =
                "  https://openweathermap.org/img/wn/" + weathericon + "@2x.png";

            //name, date and weather will be display
            currCity.html(
                "<h1>" + response.name + " " + date + "<img src=" + iconurl + "></img>" + "</h1>"
            );

            //converts c to f
            let tempfahrenheit = (response.main.temp - 273.15) * 1.8 + 32;
            // diplays temperature in fehrenheit
            currTemp.text("Temperature:" + tempfahrenheit.toFixed(2) + "°F");
            //displays wind speed
            currwindSpeed.text("Wind Speed: " + response.wind.speed + " mph");
            //displays himidity
            currHumidity.text("Humidity: " + response.main.humidity + "%");

            UVIndex(response.coord.lon, response.coord.lat);

        });
}
// UV index
function UVIndex(ln, lt) {
    var queryUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=3dc762bb679177895958abafb300419a" + "&lat=" + lt + "&lon=" + ln;

    $.ajax({
            url: queryUrl
            , method: "GET"
        , })
        .then(function (response) {
            currUvIndex.html("UV Index:" + " " + response.value);
        });
}

function Get5DayForecast() {

    var queryUrlForecast =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchCity.val() + "&appid=3dc762bb679177895958abafb300419a";
    $("#card-row")
        .empty();

    //ajax call to retrieve 5 day forecast
    $.ajax({
            url: queryUrlForecast
            , method: "GET"
        , })
        .then(function (fiveDayReponse) {
            for (let i = 0; i != fiveDayReponse.list.length; i += 8) {
                let cityObj = {
                    date: fiveDayReponse.list[i].dt_txt
                    , icon: fiveDayReponse.list[i].weather[0].icon
                    , temp: fiveDayReponse.list[i].main.temp
                    , humidity: fiveDayReponse.list[i].main.humidity
                , };
                let dateStr = cityObj.date;
                let trimmedDate = dateStr.substring(0, 10);
                let weatherIco = `http:///openweathermap.org/img/w/${cityObj.icon}.png`;


                createForecastCard(
                    trimmedDate
                    , weatherIco
                    , cityObj.temp
                    , cityObj.humidity
                );
            }
        });
}

function createForecastCard(date, icon, temp, humidity) {

    // HTML section//
    let fiveDayCardEl = $("<div>")
        .attr("class", "five-day-card");
    let cardDate = $("<h1>")
        .attr("class", "card-text");
    let cardIcon = $("<img>")
        .attr("class", "weatherIcon");
    let cardTemp = $("<p>")
        .attr("class", "card-text");
    let cardHumidity = $("<p>")
        .attr("class", "card-text");

    $("#card-row")
        .append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${((temp - 273.15) * 1.8 + 32).toFixed(2)} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);
}