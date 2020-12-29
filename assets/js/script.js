var APIkey = "f094b3d4247e89d90ebcf38a7e5d3caa";

//Search if localStorage has a saved search in it, pass citySearch to defaultFunction
$(document).ready(function () {
  if (localStorage.getItem("lastCity") === null) {
    alert('localstorage empty');
  } else {
    citySearch = localStorage.getItem("lastCity");
    defaultFunction(citySearch);
  }
});

// runs query and displays search from localStorage (try to collapse into searchFunction)
function defaultFunction(citySearch) {
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
    localStorage.setItem('lastCity', `${response.name}`);
  });

  function uvFunction(lonQuery, latQuery) {

    var queryUV = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latQuery + "&lon=" + lonQuery + "&exclude=minutely,hourly,alerts,daily&appid=" + APIkey;
    $.ajax({
      url: queryUV,
      method: "GET"
    }).then(function (response) {
      var uvColor = response.current.uvi;
      $('.uv').text(uvColor); // Color UV
      if (uvColor <= 3) {
        $('.uv').css('background-color', 'green');
      } else if (uvColor > 3 && uvColor <= 6) {
        $('.uv').css({ 'background-color': 'yellow', 'color': 'black' });
      } else if (uvColor > 6 && uvColor <= 8) {
        $('.uv').css({ 'backgrond-color': 'orange', 'color': 'black' });
      } else if (uvColor > 8 && uvColor <= 11) {
        $('.uv').css('background-color', 'red');
      } else if (uvColor > 11) {
        $('.uv').css('background-color', 'violet');
      }
    });
  }

  $.ajax({
    url: queryForecast,
    method: "GET"
  }).then(function (response) {

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
}

//Primary search function, triggers on enter/click
function searchFunction() {
  citySearch = $('#search').val();
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
    localStorage.setItem('lastCity', `${response.name}`);
  });

  function uvFunction(lonQuery, latQuery) {

    var queryUV = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latQuery + "&lon=" + lonQuery + "&exclude=minutely,hourly,alerts,daily&appid=" + APIkey;
    $.ajax({
      url: queryUV,
      method: "GET"
    }).then(function (response) {
      var uvColor = response.current.uvi;
      $('.uv').text(uvColor); // Color UV
      if (uvColor <= 3) {
        $('.uv').css('background-color', 'green');
      } else if (uvColor > 3 && uvColor <= 6) {
        $('.uv').css({ 'background-color': 'yellow', 'color': 'black' });
      } else if (uvColor > 6 && uvColor <= 8) {
        $('.uv').css({ 'backgrond-color': 'orange', 'color': 'black' });
      } else if (uvColor > 8 && uvColor <= 11) {
        $('.uv').css('background-color', 'red');
      } else if (uvColor > 11) {
        $('.uv').css('background-color', 'violet');
      }
    });
  }

  $.ajax({
    url: queryForecast,
    method: "GET"
  }).then(function (response) {

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

  $('.savedHistory').on('click', historyFunction);
}

//HISTORY FUNCTION BREAK (must find way to workaround recreating the whole function)
function historyFunction() {
  var citySearch = $(this).text();
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
    localStorage.setItem('lastCity', `${response.name}`);
  });

  function uvFunction(lonQuery, latQuery) {

    var queryUV = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latQuery + "&lon=" + lonQuery + "&exclude=minutely,hourly,alerts,daily&appid=" + APIkey;
    $.ajax({
      url: queryUV,
      method: "GET"
    }).then(function (response) {
      var uvColor = response.current.uvi;
      $('.uv').text(uvColor); // Color UV
      if (uvColor <= 3) {
        $('.uv').css('background-color', 'green');
      } else if (uvColor > 3 && uvColor <= 6) {
        $('.uv').css({ 'background-color': 'yellow', 'color': 'black' });
      } else if (uvColor > 6 && uvColor <= 8) {
        $('.uv').css({ 'backgrond-color': 'orange', 'color': 'black' });
      } else if (uvColor > 8 && uvColor <= 11) {
        $('.uv').css('background-color', 'red');
      } else if (uvColor > 11) {
        $('.uv').css('background-color', 'violet');
      }
    });
  }
  $.ajax({
    url: queryForecast,
    method: "GET"
  }).then(function (response) {

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
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x29D4BE);
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 249);
$('.search-div').append(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x8000FF });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();

$('.buttonInput').on('click', searchFunction);
$('#form-search').keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $('.buttonInput').click();
  }
});