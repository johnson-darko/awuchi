let kiosks = [];
let map, markers = [];
const kioskIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});
let userMarker = null;
let nearestLine = null;

// Load kiosks.json
fetch('kiosks.json')
  .then(res => res.json())
  .then(async data => {
    // Show spinner for 1.2s minimum
    document.getElementById('spinner').style.display = 'flex';
    await new Promise(r => setTimeout(r, 1200));
    kiosks = data;
    initMap();
    renderKioskList();
    document.getElementById('spinner').style.display = 'none';
  });

function initMap() {
  map = L.map('map').setView([kiosks[0].latitude, kiosks[0].longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  markers = kiosks.map((kiosk, idx) => {
    const marker = L.marker([kiosk.latitude, kiosk.longitude], {icon: kioskIcon}).addTo(map);
    marker.bindPopup(`<b>${kiosk.name}</b><br>${kiosk.landmark}<br>${kiosk.open_time} - ${kiosk.close_time}`);
    marker.on('click', () => highlightKiosk(idx));
    return marker;
  });
}

function renderKioskList() {
  const list = document.getElementById('kiosk-list');
  list.innerHTML = '';
  kiosks.forEach((kiosk, idx) => {
    const card = document.createElement('div');
    card.className = 'kiosk-card';
    card.id = `kiosk-${idx}`;
    card.innerHTML = `
      <div class="kiosk-name">${kiosk.name}</div>
      <div class="kiosk-landmark">${kiosk.address} (${kiosk.landmark})</div>
      <div class="kiosk-hours">Open: ${kiosk.open_time} - ${kiosk.close_time}</div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.5rem;">
        <button class="show-on-map">Show on Map</button>
        <button class="take-me-there">Take Me There</button>
        <button class="get-directions">Get Directions</button>
      </div>
      <div class="distance" style="display:none;"></div>
    `;
    card.querySelector('.get-directions').onclick = () => {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${kiosk.latitude},${kiosk.longitude}`);
    };
    card.querySelector('.show-on-map').onclick = (e) => {
      highlightKiosk(idx);
      map.setView([kiosk.latitude, kiosk.longitude], 15);
      markers[idx].openPopup();
    };
    card.querySelector('.take-me-there').onclick = (e) => {
      if (!userMarker) {
        alert('Please use "Find Awuchi Near Me" first to set your location.');
        return;
      }
      if (nearestLine) map.removeLayer(nearestLine);
      nearestLine = L.polyline([
        userMarker.getLatLng(),
        [kiosk.latitude, kiosk.longitude]
      ], {color: '#FF0000', weight: 4, opacity: 0.8}).addTo(map);
      map.fitBounds(L.latLngBounds([
        userMarker.getLatLng(),
        [kiosk.latitude, kiosk.longitude]
      ]));
      highlightKiosk(idx);
      markers[idx].openPopup();
    };
    card.onclick = (e) => {
      if (!e.target.classList.contains('get-directions') && !e.target.classList.contains('show-on-map') && !e.target.classList.contains('take-me-there')) {
        highlightKiosk(idx);
        map.setView([kiosk.latitude, kiosk.longitude], 15);
        markers[idx].openPopup();
      }
    };
    list.appendChild(card);
  });
}

function highlightKiosk(idx) {
  document.querySelectorAll('.kiosk-card').forEach(card => card.classList.remove('highlight'));
  const card = document.getElementById(`kiosk-${idx}`);
  card.classList.add('highlight');
  card.scrollIntoView({behavior: 'smooth', block: 'center'});
}

document.getElementById('find-near-me').onclick = function() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const {latitude, longitude} = pos.coords;
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker([latitude, longitude], {icon: L.icon({iconUrl: 'https://raw.githubusercontent.com/johnson-darko/awuchi/main/awuchi-user.png', iconSize: [32,32]})}).addTo(map);
    map.setView([latitude, longitude], 14);
    const nearest = findNearestKiosk(latitude, longitude);
    highlightKiosk(nearest.idx);
    showDistance(nearest.idx, nearest.distance);
    // Draw line from user to nearest kiosk
    if (nearestLine) map.removeLayer(nearestLine);
    const kiosk = kiosks[nearest.idx];
    nearestLine = L.polyline([[latitude, longitude], [kiosk.latitude, kiosk.longitude]], {color: '#FF0000', weight: 4, opacity: 0.8}).addTo(map);
    // Open popup for nearest kiosk marker
    markers[nearest.idx].openPopup();
  }, () => {
    alert('Unable to retrieve your location.');
  });
};

function findNearestKiosk(lat, lng) {
  let minDist = Infinity, minIdx = -1;
  kiosks.forEach((kiosk, idx) => {
    const dist = getDistanceFromLatLonInKm(lat, lng, kiosk.latitude, kiosk.longitude);
    if (dist < minDist) {
      minDist = dist;
      minIdx = idx;
    }
  });
  return {idx: minIdx, distance: minDist};
}

function showDistance(idx, distance) {
  document.querySelectorAll('.distance').forEach(d => d.style.display = 'none');
  const card = document.getElementById(`kiosk-${idx}`);
  const distDiv = card.querySelector('.distance');
  distDiv.style.display = 'block';
  distDiv.textContent = `Nearest to you – ${distance.toFixed(2)} km away`;
}

// Haversine formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1);
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI/180);
}
