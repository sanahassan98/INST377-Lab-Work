function initMap() {
  const map = L.map('map').setView([38.9897, -76.9378], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoiYW5jaWVudGRlcHRoc3NoIiwiYSI6ImNsMnh1cjQ0MjB6OWIzbnBmZGE2MXdmMmsifQ.78FEBCP_Xsdb-4Pn_N1Low",
    }
  ).addTo(map);
  return map;
}
function addMarkers(map, markers) {
  markers.forEach((marker) => {
    L.marker(marker).addTo(map);
  });
}

function removeMarkers(map) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
}
function markerPlace(map, markers) {
  removeMarkers(map);
  addMarkers(map, markers);
  if (markers.length >= 1) {
    map.setView(markers[0], 13);
  }
}
function getRestaurantLatLong(restaurant) {
  return restaurant.geocoded_column_1.coordinates.reverse();
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function makeRandomIndexes(max, numberOFIndexes) {
  const range = [...Array(15).keys()];
  return range.map(() => getRandomInt(max));
}
function selectRandomElements(collection, numberOfElements) {
  const randomIndexes = makeRandomIndexes(collection.length, numberOfElements);
  return randomIndexes.map((item) => collection[item]);
}

function createListItems(collection) {
  let result = "";
  // eslint-disable-next-line no-restricted-syntax
  for (item of collection) {
    result += `<li>${item}</li>`;
  }
  return result;
}
function dataHandler(anArray) {
  const randomRestaurants = selectRandomElements(anArray, 15);
  const restaurantNames = randomRestaurants.map((x) => x.name);
  const restaurantItems = createListItems(restaurantNames);
  const restaurantList = document.getElementById("resto-list");
  // arrayFromJson.data - we're accessing a key called 'data' on the returned object
  // it contains all 1,000 records we need
  restaurantList.innerHTML = restaurantItems;
}
async function filterOwnerName(event, allOwners, map) {
  const searchString = event.target.value.toLowerCase();
  const selectOwners = allOwners.filter((owner) => {
    const name = owner.owner.toLowerCase();
    return name.includes(searchString);
  });
  const ownerNames = selectOwners.map(
    (owner) => `${owner.owner}, ${owner.name}`
  );
  const contentOwner = createListItems(ownerNames);
  const OwnerList = document.getElementById("resto-list");
  OwnerList.innerHTML = contentOwner;
   // check weather restaurant has the attribute geocoded_column_1
  const geoOwners = selectOwners.filter((restaurant) => 'geocoded_column_1' in restaurant);
  const points = geoOwners.slice(0, 5).map(getRestaurantLatLong);
  console.log('points & filter owner name');
  console.log(points);
  markerPlace(map, points);
}
async function filterRestaurantName(event, allRestaurants, map) {
  const searchString = event.target.value.toLowerCase();
  const selectRestaurants = allRestaurants.filter((restaurant) => {
    const name = restaurant.name.toLowerCase();
    return name.includes(searchString);
  });
  const names = selectRestaurants.map((restaurant) => restaurant.name);
  const content = createListItems(names);
  const restaurantList = document.getElementById("resto-list");
  restaurantList.innerHTML = content;
  const geoRestaurant = selectRestaurants.filter((restaurant) => 'geocoded_column_1' in restaurant);
  const points = geoRestaurant.slice(0, 5).map(getRestaurantLatLong);
  console.log('points');
  console.log(points);
  markerPlace(map, points);
}
async function mainEvent() {
  // the async keyword means we can make API requests
  const name = document.getElementById("name");
  const owner = document.getElementById("owner");
  const form = document.querySelector(".main_form");
  const button = document.querySelector("button");
  var map = initMap();
  const results = await fetch("/api/foodServicesPG"); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object
  button.style.setProperty("display", "none");
  //NOTE: restore this version of the if statement
  //when the asyn await stuff works
  if (arrayFromJson.data.length > 0) {
    button.style.setProperty("display", "block");

    form.addEventListener("submit", async (submitEvent) => {
      // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      dataHandler(arrayFromJson.data);
    });
    name.addEventListener("input", async (event) => {
      filterRestaurantName(event, arrayFromJson.data, map);
    });
    owner.addEventListener("input", async (event) => {
      filterOwnerName(event, arrayFromJson.data, map);
    });
  }
}
// this actually runs first! It's calling the function above
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
