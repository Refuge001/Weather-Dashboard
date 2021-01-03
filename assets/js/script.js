var APIkey = "f094b3d4247e89d90ebcf38a7e5d3caa";

//Search if localStorage has a saved search in it, pass citySearch to searchFunction
$(document).ready(function () {
  if (localStorage.getItem("lastCity") === null) {
  } else {
    citySearch = localStorage.getItem("lastCity");
    searchFunction(citySearch, false);
  }
});


//Primary search function, triggers on enter/click/page reload, queries city/wind/temp/humidity/lat/long/uv/5-day forecast
function searchFunction(citySearch, historySearch) {
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
    lonQuery = response.coord.lon;
    latQuery = response.coord.lat;
    uvFunction(lonQuery, latQuery);
    localStorage.setItem('lastCity', `${response.name}`);
  });

  //gets UV values
  function uvFunction(lonQuery, latQuery) {
    var queryUV = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latQuery + "&lon=" + lonQuery + "&exclude=minutely,hourly,alerts,daily&appid=" + APIkey;
    $.ajax({
      url: queryUV,
      method: "GET"
    }).then(function (response) {
      var uvColor = response.current.uvi;
      $('.uv').text(uvColor); // UV Value
      // UV color coding
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
    //Five Day Forecast forEach loop
    $(".fiveday").each(function () {
      var position = $(this).attr('id'); // ID in increments of 8: 8 * 3 = 24 hours (3 hour intervals)
      var day = (response.list[position].dt_txt); // Day inside response
      var iconID = (response.list[position].weather[0].icon); // find icon ID for website URL lookup
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

  //Check whether to save history or not/save search history if true
  if (historySearch === true) {
    createRow();
    $('.savedHistory').on('click', (function () {
      searchFunction($(this).text(), false);
    }));
  }

  //create Saved Searches buttons
  function createRow() {
    const row = $('<div>');
    const cityName = $('<button>').text(citySearch).attr('class', 'savedHistory');
    row.append(cityName);
    row.appendTo('.history');
  }
}

//three.js polygon - just messing with it
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x29D4BE);
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
$('.appendthreejs').append(renderer.domElement);

const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 3, 3, 3);
const material = new THREE.MeshBasicMaterial({ color: 0x8000FF, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
const cylinder = new THREE.Mesh(cylinderGeometry, material);
scene.add(cylinder);
scene.add(cube);
camera.position.z = 5;

const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  cylinder.rotation.x += 0.01;
  cylinder.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();

$('.buttonInput').on('click', (function () {
  searchFunction($('#search').val(), true);
}));

$('#form-search').keypress(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $('.buttonInput').click();
  }
});