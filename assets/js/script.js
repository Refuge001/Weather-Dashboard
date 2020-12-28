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

    $('.city').html(`<h1>${response.name} Weather Details</h1>`);
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
      var position = $(this).attr('id');
      var day = (response.list[position].dt_txt)
      console.log(position);
      let temp = `Tempature: ${parseFloat((response.list[position].main.temp - 273.15) * 1.80 + 32).toFixed(2)}(F)`;
      $(this).text(moment(day).format('MMMM DD, YYYY'));
      $(this).next().text(temp);
      $(this).next().next().text(`Humidity: ${response.list[position].main.humidity}%`);
    })

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