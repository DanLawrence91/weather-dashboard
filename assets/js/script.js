/* 

When user opens webpage they will see:
Text input box that takes city entered and a submit button to search for city weather data

to search for city use openweather api, to get the one call data need longitude and latitude

to get longitiude and latitude use geocoding section of openweather api.

this means fetch by city name from search box, this goes to openweather geocoding to get longitude and latitude for that city,
which will then be used in fetch from one call on openweather to get todays date and 5 day forecast.

save geocoding data to json and then use variables from this in search fecth for one call api

example geocoding - http://api.openweathermap.org/geo/1.0/direct?q=London,GB&limit=5&appid={API key}

underneath this is an empty area that will be filled by buttons containing past cities searched for, if they are clicked they
will then search for that city again 

On other part of page there are two elements:
First shows a section that highlights todays weather and includes date, city name, icon of weather, temperature, humidity,
wind speed and uv index. UV index is color coded based on severity.

Underneath this is next 5 day forecast. 5 cards will be created dynamically showing the following data:
date, icon of weather, temperature, wind speed and humidity

Cities will be saved to local storage when searched for and this will be what is used to create the button in search list 
to search again.

*/

var APIKey = "68f6f76ac8c1ec3fb198c68558825996"
var submitForm = document.querySelector("#search-form")

function getWeather(event) {
    event.preventDefault();

    var citySearch = document.querySelector("#city-search").value
    var queryLongLatURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch + '&appid=' + APIKey

    console.log(queryLongLatURL)
  
    fetch(queryLongLatURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //Using console.log to examine the data

        var cityURL = 'https://api.openweathermap.org/data/2.5/onecall?' + 'lat=' + data[0].lat + '&lon=' + data[0].lon + '&exclude=minutely,hourly,alerts&units=metric&appid=' + APIKey
        //console.log(cityURL)
        console.log(citySearch)
        return fetch(cityURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.current.temp)
            console.log(data.current.humidity)
            console.log(data.current.wind_speed)
            console.log(data.current.uvi)
            console.log(data.current.weather.icon)
        })
        });
       
}

submitForm.addEventListener("submit", getWeather)