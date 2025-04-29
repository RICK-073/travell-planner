// API Keys
const UNSPLASH_ACCESS_KEY = 'xF9AXSVQiieRxG3fv909eLI5lCdszcJzBfKt_6khAL8';
const WEATHER_API_KEY = 'ec0a75eae925a9c06cf8dfad86ffc030';
const GEO_DB_API_KEY = '78ccdad8f7msh79830f06788333ep1ad644jsn6b5fec5d901c'; 

let currentPlace = '';
let activities = {};

// Main search function
function searchPlace() {
  const place = document.getElementById('placeInput').value.trim();
  if (!place) {
    alert("Please enter a place name!");
    return;
  }

  currentPlace = place;
  fetchImage(place);
  showMap(place);
  fetchWeather(place);
  loadActivities(place);

  document.getElementById('itinerarySection').style.display = 'block';
  document.getElementById('placeName').innerText = place;
}

// Fetch place image from Unsplash
function fetchImage(place) {
  fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(place)}&client_id=${UNSPLASH_ACCESS_KEY}`)
    .then(response => response.json())
    .then(data => {
      const imgUrl = data.results[0]?.urls.small;
      document.getElementById('imageResult').innerHTML = imgUrl
        ? `<img src="${imgUrl}" alt="${place}" style="width:100%; height:auto; border-radius:8px;">`
        : "No Image Found!";
    })
    .catch(() => {
      document.getElementById('imageResult').innerHTML = "Failed to load image.";
    });
}

// Display map using Leaflet.js + OpenStreetMap
function showMap(place) {
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        document.getElementById('mapResult').innerHTML = "Map not available.";
        return;
      }

      const { lat, lon } = data[0];

      document.getElementById('mapResult').innerHTML = `<div id="map" style="height: 300px;"></div>`;

      const map = L.map('map').setView([lat, lon], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      L.marker([lat, lon]).addTo(map)
        .bindPopup(`${place}`)
        .openPopup();
    })
    .catch(() => {
      document.getElementById('mapResult').innerHTML = "Failed to load map.";
    });
}

// Fetch weather from OpenWeatherMap
function fetchWeather(place) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(place)}&appid=${WEATHER_API_KEY}&units=metric`)
    .then(response => response.json())
    .then(data => {
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      document.getElementById('weatherResult').innerHTML = `
        <h3>Weather</h3>
        <p>🌡️ ${temp}°C</p>
        <p>🌥️ ${desc}</p>
      `;
    })
    .catch(() => {
      document.getElementById('weatherResult').innerHTML = "Weather not found!";
    });
}

// Itinerary Functions
function addActivity() {
  const activity = document.getElementById('activityInput').value.trim();
  if (!activity) {
    alert("Enter an activity");
    return;
  }

  if (!activities[currentPlace]) {
    activities[currentPlace] = [];
  }

  activities[currentPlace].push(activity);
  saveActivities();
  renderActivities();
  document.getElementById('activityInput').value = '';
}

function saveActivities() {
  localStorage.setItem('activities', JSON.stringify(activities));
}

function loadActivities(place) {
  const stored = JSON.parse(localStorage.getItem('activities')) || {};
  activities = stored;
  renderActivities();
}

function renderActivities() {
  const list = document.getElementById('activityList');
  list.innerHTML = "";

  const placeActivities = activities[currentPlace] || [];
  placeActivities.forEach((activity, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${activity} <button onclick="deleteActivity(${index})">❌</button>`;
    list.appendChild(li);
  });
}

function deleteActivity(index) {
  activities[currentPlace].splice(index, 1);
  saveActivities();
  renderActivities();
  showNotification("Activity removed!");
}

// Notification pop-up
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2500);
}
