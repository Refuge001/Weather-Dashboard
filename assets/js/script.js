var APIkey = "f094b3d4247e89d90ebcf38a7e5d3caa";
// var cityName = localStorage.getItem("city");
// localStorage.setItem("city", citySearch);


function searchFunction() {
  var citySearch = $(this).prev().val();
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIkey;
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {

    console.log(response);

    $('.city').html(`<h1>${response.name} Weather Details</h1>`);
    $('.wind').text(`Wind Speed: ${response.wind.speed} MPH`);
    $('.humidity').text(`Humidity: ${response.main.humidity}%`);
    let temp = `Tempature: ${parseFloat((response.main.temp - 273.15) * 1.80 + 32).toFixed(2)}(F)`;
    $('.temp').html(temp);

  });
}

$('.btn').on('click', searchFunction);
$('#form-search').keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $('.btn').click();
  }
});