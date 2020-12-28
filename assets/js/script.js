var APIkey = "f094b3d4247e89d90ebcf38a7e5d3caa";
// var cityName = localStorage.getItem("city");
// localStorage.setItem("city", citySearch);

function searchFunction() {
  var citySearch = $(this).prev().val();
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
    let temp = `Tempature: ${parseFloat((response.main.temp - 273.15) * 1.80 + 32).toFixed(2)}(F)`;
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
      let temp = `Temperature: ${parseFloat((response.list[position].main.temp - 273.15) * 1.80 + 32).toFixed(2)}(F)`; // temperature converted from Kelvin
      $(this).text(moment(day).format('MMMM DD, YYYY')); // Date display
      $(this).next().attr('src', weatherIcon); // weather icon display
      $(this).next().attr('alt', weatherIconAlt); //img alt definition
      $(this).next().next().text(temp); // Temperature display
      $(this).next().next().next().text(`Humidity: ${response.list[position].main.humidity}%`); // Humidity
    });

  });

  function createRow() {
    const row = $('<div>');
    const cityName = $('<button>').text(citySearch);
    row.append(cityName);
    row.appendTo('.history');
  }
  createRow();
}

$('.btn').on('click', searchFunction);
$('#form-search').keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $('.btn').click();
  }
});