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
  console.table(anArray); // this is called "dot notation"
  // arrayFromJson.data - we're accessing a key called 'data' on the returned object
  // it contains all 1,000 records we need
  restaurantList.innerHTML = restaurantItems;
}
async function filterOwnerName(event, allOwners) {
  const searchString = event.target.value.toLowerCase();
  const selectOwners = allOwners.filter((owner) => {
    const name = owner.owner.toLowerCase();
    return name.includes(searchString);
  });
  const ownerNames = selectOwners.map((owner) => `${owner.owner}, ${owner.name}`);
  const contentOwner = createListItems(ownerNames);
  const OwnerList = document.getElementById('resto-list');
  OwnerList.innerHTML = contentOwner;
}
async function filterRestaurantName(event, allRestaurants) {
  const searchString = event.target.value.toLowerCase();
  const selectRestaurants = allRestaurants.filter((restaurant) => {
    const name = restaurant.name.toLowerCase();
    return name.includes(searchString);
  });
  const names = selectRestaurants.map((restaurant) => restaurant.name);
  const content = createListItems(names);
  const restaurantList = document.getElementById('resto-list');
  restaurantList.innerHTML = content;
}
async function mainEvent() {
  // the async keyword means we can make API requests
  const name = document.getElementById("name");
  const owner = document.getElementById("owner");
  const form = document.querySelector(".main_form");
  const button = document.querySelector("button");
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
      console.log("form submission"); // this is substituting for a "breakpoint"
      dataHandler(arrayFromJson.data);
    });
    name.addEventListener('input', async (event) => {
      filterRestaurantName(event, arrayFromJson.data);
    });
    owner.addEventListener('input', async (event) => {
      filterOwnerName(event, arrayFromJson.data);
    });
  }
}
// this actually runs first! It's calling the function above
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
