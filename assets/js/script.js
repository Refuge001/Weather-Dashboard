var APIkey = "f094b3d4247e89d90ebcf38a7e5d3caa";

// $(document).ready(function () {
//   if (localStorage.getItem("lastCity") === null) {
//     alert('localstorage empty');
//   } else {
//     citySearch = localStorage.getItem("lastCity");
//     searchFunction(citySearch);
//   }
// });

function searchFunction() {
  var citySearch = $('.buttonInput').prev().val();
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIkey;
  var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&cnt=40&appid=" + APIkey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    $('.city').html(`<h2>${response.name} - ${moment().format('MMMM DD, YYYY')}</h2>`);
    $('.wind').text(`Wind Speed: ${response.wind.speed} MPH`);
    $('.humidity').text(`Humidity: ${response.main.humidity}%`);
    let temp = `Tempature: ${parseFloat((response.main.temp - 273.15) * 1.80 + 32).toFixed(2)}°F`;
    $('.temp').html(temp);
    lonQuery = (response.coord.lon);
    latQuery = (response.coord.lat);
    uvFunction(lonQuery, latQuery);
  });

  function uvFunction(lonQuery, latQuery) {

    var queryUV = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latQuery + "&lon=" + lonQuery + "&exclude=minutely,hourly,alerts,daily&appid=" + APIkey;
    $.ajax({
      url: queryUV,
      method: "GET"
    }).then(function (response) {
      $('.uv').text(`UV Index: ${response.current.uvi}`)
    });
  }

  $.ajax({
    url: queryForecast,
    method: "GET"
  }).then(function (response) {
    console.log(response);

    $(".fiveday").each(function () {
      var position = $(this).attr('id'); // ID in increments of 8: 8 * 3 = 24 hours (3 hour intervals)
      var day = (response.list[position].dt_txt) // Day inside response
      var iconID = (response.list[position].weather[0].icon) // find icon ID for website URL lookup
      var weatherIcon = "http://openweathermap.org/img/w/" + iconID + ".png"; // weather icons are located on the openweather website, listed by icon ID inside response
      var weatherIconAlt = (response.list[position].weather[0].description) + " weather icon"; // weather icon alt tag response
      let temp = `Temperature: ${parseFloat((response.list[position].main.temp - 273.15) * 1.80 + 32).toFixed(2)}°F`; // temperature converted from Kelvin
      $(this).text(moment(day).format('MMMM DD, YYYY')); // Date display
      $(this).next().attr('src', weatherIcon); // weather icon display
      $(this).next().attr('alt', weatherIconAlt); //img alt definition
      $(this).next().next().text(temp); // Temperature display
      $(this).next().next().next().text(`Humidity: ${response.list[position].main.humidity}%`); // Humidity
    });

  });

  function createRow() {
    const row = $('<div>');
    const cityName = $('<button>').text(citySearch).attr('class', 'savedHistory');
    row.append(cityName);
    row.appendTo('.history');
  }

  createRow();
  localStorage.setItem('lastCity', citySearch);
  $('.savedHistory').on('click', historyFunction);

}

//HISTORY FUNCTION BREAK (must find way to workaround)
function historyFunction() {
  var citySearch = $(this).text();
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIkey;
  var queryForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&cnt=40&appid=" + APIkey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    console.log(response);

    $('.city').html(`<h2>${response.name} - ${moment().format('MMMM DD, YYYY')}</h2>`);
    $('.wind').text(`Wind Speed: ${response.wind.speed} MPH`);
    $('.humidity').text(`Humidity: ${response.main.humidity}%`);
    let temp = `Tempature: ${parseFloat((response.main.temp - 273.15) * 1.80 + 32).toFixed(2)}°F`;
    $('.temp').html(temp);

  });

  $.ajax({
    url: queryForecast,
    method: "GET"
  }).then(function (response) {
    console.log(response);

    $(".fiveday").each(function () {
      var position = $(this).attr('id'); // ID in increments of 8: 8 * 3 = 24 hours (3 hour intervals)
      var day = (response.list[position].dt_txt) // Day inside response
      var iconID = (response.list[position].weather[0].icon) // find icon ID for website URL lookup
      var weatherIcon = "http://openweathermap.org/img/w/" + iconID + ".png"; // weather icons are located on the openweather website, listed by icon ID inside response
      var weatherIconAlt = (response.list[position].weather[0].description) + " weather icon"; // weather icon alt tag response
      let temp = `Temperature: ${parseFloat((response.list[position].main.temp - 273.15) * 1.80 + 32).toFixed(2)}°F`; // temperature converted from Kelvin
      $(this).text(moment(day).format('MMMM DD, YYYY')); // Date display
      $(this).next().attr('src', weatherIcon); // weather icon display
      $(this).next().attr('alt', weatherIconAlt); //img alt definition
      $(this).next().next().text(temp); // Temperature display
      $(this).next().next().next().text(`Humidity: ${response.list[position].main.humidity}%`); // Humidity
    });
  });
  localStorage.setItem('lastCity', citySearch);
}

$('.buttonInput').on('click', searchFunction);
$('#form-search').keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $('.buttonInput').click();
  }
});