/* 

When user opens webpage they will see:
Text input box that takes city entered and a submit button to search for city weather data - DONE

to search for city use openweather api, to get the one call data need longitude and latitude - DONE

to get longitiude and latitude use geocoding section of openweather api - DONE

this means fetch by city name from search box, this goes to openweather geocoding to get longitude and latitude for that city,
which will then be used in fetch from one call on openweather to get todays date and 5 day forecast - DONE except for 5 day

save geocoding data to json and then use variables from this in search fecth for one call api - DONE

underneath this is an empty area that will be filled by buttons containing past cities searched for, if they are clicked they
will then search for that city again - DONE except for changing display to that city

On other part of page there are two elements:
First shows a section that highlights todays weather and includes date, city name, icon of weather, temperature, humidity,
wind speed and uv index. UV index is color coded based on severity. Use if else statement for color

Underneath this is next 5 day forecast. 5 cards will be created dynamically showing the following data:
date, icon of weather, temperature, wind speed and humidity

Cities will be saved to local storage when searched for and this will be what is used to create the button in search list 
to search again - DONE

*/

var APIKey = "68f6f76ac8c1ec3fb198c68558825996"
var submitForm = document.querySelector("#search-form")
var cityStorage;
var historyEl = document.querySelector("#weather-history")
var savedCity;
var btn;

function getWeather(event) {
    event.preventDefault();

    var citySearch = document.querySelector("#city-search").value
    
    console.log(cityUsed(citySearch))
    var queryLongLatURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch + '&appid=' + APIKey

    console.log(queryLongLatURL)

    //need to sort as replicates list when button pressed
    localStorage.setItem('city', citySearch)
    cityStorage = localStorage.getItem('city')
    console.log(cityStorage)

    submitForm.reset();

    const storedCities = {
        city: cityStorage,
    }
    console.log(storedCities)
    savedCity.push(storedCities);
    localStorage.setItem("savedCity", JSON.stringify(savedCity));

    btn = document.createElement("a");
    //need to set so when button pressed it changes display
    btn.textContent = cityStorage
    btn.classList.add('btn', 'btn-light')
    
    historyEl.appendChild(btn)

    console.log(savedCity)
    console.log(savedCity.length)
        

    fetch(queryLongLatURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var cityURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + data[0].lat + '&lon=' + data[0].lon + '&exclude=minutely,hourly,alerts&units=metric&appid=' + APIKey

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

// capitalise first letter of search for city for when data presented
// var cityUsed = function capitalise(s) {
//     return s[0].toUpperCase() + s.slice(1);
// }

function renderCities() {
    savedCity = JSON.parse(localStorage.getItem("savedCity")) || [];
    for (var i = 0; i < savedCity.length; i++){
    var newCity = savedCity[i];
    console.log(newCity)
    
    btn = document.createElement("a");
    btn.textContent = newCity.city
    btn.classList.add('btn', 'btn-light')
    
    historyEl.appendChild(btn)
    }
}
renderCities()
submitForm.addEventListener("submit", getWeather)
// submitForm.addEventListener("submit", renderCities)