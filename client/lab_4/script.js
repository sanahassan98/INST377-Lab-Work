
const first = document.querySelector(".carousel-item.visible");
const last = document.querySelector(".carousel-item:last-of-type");
const prev = document.querySelector("#previous-button");

let current = first;

// Event listeners
document.querySelector("#next-button").onclick = (e) => {
  prev.style.fontWeight = "normal";
  prev.style.backgroundColor = "lightgray";
  current.classList.remove("visible");
  current = current.nextElementSibling ? current.nextElementSibling : first;
  current.classList.add("visible");
};
document.querySelector("#previous-button").onclick = (e) => {
  //css font-weight => js fontWeight
  prev.style.fontWeight = "bold";
  prev.style.backgroundColor = "orange";
  current.classList.remove("visible");
  current = current.previousElementSibling ? current.previousElementSibling : last;
  
  current.classList.add("visible");
};
