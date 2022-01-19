/* 

When user opens webpage they will see:
Text input box that takes city entered and a submit button to search for city weather data - DONE

to search for city use openweather api, to get the one call data need longitude and latitude - DONE

to get longitiude and latitude use geocoding section of openweather api - DONE

this means fetch by city name from search box, this goes to openweather geocoding to get longitude and latitude for that city,
which will then be used in fetch from one call on openweather to get todays date and 5 day forecast - DONE 

save geocoding data to json and then use variables from this in search fecth for one call api - DONE

underneath this is an empty area that will be filled by buttons containing past cities searched for, if they are clicked they
will then search for that city again - DONE except for changing display to that city

On other part of page there are two elements:
First shows a section that highlights todays weather and includes date, city name, icon of weather, temperature, humidity,
wind speed and uv index. UV index is color coded based on severity. Use if else statement for color - DONE 

Underneath this is next 5 day forecast. 5 cards will be created dynamically showing the following data:
date, icon of weather, temperature, wind speed and humidity - DONE

Cities will be saved to local storage when searched for and this will be what is used to create the button in search list 
to search again - DONE

*/

var APIKey = "68f6f76ac8c1ec3fb198c68558825996"
var submitForm = document.querySelector("#search-form")
var cityStorage;
var historyEl = document.querySelector("#weather-history")
var savedCity;
var btn;
var temp;
var humidity;
var windSpeed;
var uvi;
var weatherIcon;
var fiveTemp;
var fiveHumidity;
var fiveWindSpeed;
var fiveWeatherIcon;
var citySearch;
var i;
var todayWeather = document.querySelector("#today-weather")
var weatherForecast = document.querySelector("#five-day-weather")

// function to print the weather for the city on the day searched for. Dynamically create a card showing different bits of 
// information about the weather on that day
function printWeather() {
    var weatherData = document.createElement('div');
    weatherData.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

    var weatherBody = document.createElement('div');
    weatherBody.classList.add('card-body', 'p-2');
    weatherData.append(weatherBody);

    var cityEl = document.createElement('h3');
    var date = moment().format("Do MMMM YYYY")
    var iconEl = document.createElement('img')
    iconEl.src = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
    cityEl.textContent = citySearch + ", " + date
    cityEl.append(iconEl)

    var bodyContentEl = document.createElement('p');
    var uviEl = document.createElement('p')
    var uviData = document.createElement('p')
    uviData.classList.add('btn')
    uviData.innerHTML = uvi
    uviData.setAttribute("style", "cursor:auto")

    uviEl.innerHTML = 'UV Index: '
    uviEl.append(uviData)

    if (uvi <= 4) {
        uviData.classList.add('btn-success');
    } else if (uvi <= 9 && uvi > 4) {
        uviData.classList.add('btn-warning');
    } else {
        uviData.classList.add('btn-danger');
    }

    bodyContentEl.innerHTML += 'Temp: ' + temp + ' °F <br/>';
    bodyContentEl.innerHTML += 'Wind Speed: ' + windSpeed + ' MPH <br/>';
    bodyContentEl.innerHTML += 'Humidity: ' + humidity + ' % <br/>';

    weatherBody.append(cityEl, bodyContentEl, uviEl);

    var titleEl = document.createElement('h3');
    titleEl.textContent = '5 Day Forecast: ';

    todayWeather.append(weatherData, titleEl);
}

// function to print the forecast for next 5 days of weather for that city dynamically. Cards created based on inforamtion entered
// to show different bits of information about the weather for next 5 days
function printForecast() {
    var weatherForecastData = document.createElement('div');
    weatherForecastData.classList.add('card', 'bg-light', 'text-dark', 'm-1');

    var weatherForecastBody = document.createElement('div');
    weatherForecastBody.classList.add('card-body', 'p-2');
    weatherForecastData.append(weatherForecastBody);

    var dateEl = document.createElement('h4');
    var futureDate = moment().add(i, 'days')
    var futureText = futureDate.format("Do MMMM YYYY")
    dateEl.textContent = futureText


    var iconForecastEl = document.createElement('img')
    iconForecastEl.src = "http://openweathermap.org/img/wn/" + fiveWeatherIcon + "@2x.png"

    var bodyForecastContentEl = document.createElement('p');

    bodyForecastContentEl.innerHTML += 'Temp: ' + fiveTemp + ' °F <br/>';
    bodyForecastContentEl.innerHTML += 'Wind Speed: ' + fiveWindSpeed + ' MPH <br/>';
    bodyForecastContentEl.innerHTML += 'Humidity: ' + fiveHumidity + ' % <br/>';
    weatherForecastBody.append(dateEl, iconForecastEl, bodyForecastContentEl);

    weatherForecast.append(weatherForecastData);
}

// function to clear the information from the page when a new search is made
function clearPastSearch() {
    todayWeather.innerHTML = ""
    weatherForecast.innerHTML = ""
}

// function to ensure a city is searched for and if data already on display that this is cleared prior to showing new data
// also calls the fetch function and provides the url for that function based on city searched for
// this function also saves the searches to local storage so that they can be logged in search history
function getWeather(event) {
    event.preventDefault();

    if (todayWeather) {
        clearPastSearch()
    }

    citySearch = document.querySelector("#city-search").value

    if (!citySearch) {
        return alert("Please enter a search term")
    }

    var queryLongLatURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch + '&appid=' + APIKey

    //need to sort as replicates list when button pressed
    localStorage.setItem('city', citySearch)
    cityStorage = localStorage.getItem('city')

    submitForm.reset();

    const storedCities = {
        city: cityStorage,
    }

    savedCity.push(storedCities);
    localStorage.setItem("savedCity", JSON.stringify(savedCity));

    btn = document.createElement("a");
    //need to set so when button pressed it changes display
    btn.textContent = cityStorage
    btn.classList.add('btn', 'btn-light', 'm-2', 'w-100')

    historyEl.appendChild(btn)

    fetchWeather(queryLongLatURL)
}

// function to fetch the weather data for the city called for and to call the function to print the data to the page
// searches for longitude and latitude based on city name search which then uses this data to get weather info for that city
function fetchWeather(URL) {

    fetch(URL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var cityURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data[0].lat + '&lon=' + data[0].lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + APIKey

            return fetch(cityURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    for (i = 1; i <= 5; i++) {
                        fiveTemp = data.daily[i].temp.day
                        fiveHumidity = data.daily[i].humidity
                        fiveWindSpeed = data.daily[i].wind_speed
                        fiveWeatherIcon = data.daily[i].weather[0].icon

                        printForecast(data)
                    }

                    temp = data.current.temp
                    humidity = data.current.humidity
                    windSpeed = data.current.wind_speed
                    uvi = data.current.uvi
                    weatherIcon = data.current.weather[0].icon

                    printWeather(data)
                })
        });

}

// capitalise first letter of search for city for when data presented
// var cityUsed = function capitalise(s) {
//     return s[0].toUpperCase() + s.slice(1);
// }

// prints the city to search history bar from local storage
function renderCities() {
    savedCity = JSON.parse(localStorage.getItem("savedCity")) || [];
    for (i = 0; i < savedCity.length; i++) {
        var newCity = savedCity[i];

        btn = document.createElement("button");
        btn.textContent = newCity.city
        btn.classList.add('btn', 'btn-light', 'm-2', 'w-100')

        historyEl.appendChild(btn)
    }
}

renderCities()
submitForm.addEventListener("submit", getWeather)
btn.addEventListener("click", function () {
    
})