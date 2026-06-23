const screenQuestion = document.getElementById("screenQuestion");
const screenDate = document.getElementById("screenDate");
const screenFood = document.getElementById("screenFood");
const screenFinal = document.getElementById("screenFinal");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noMessage = document.getElementById("noMessage");

const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const nextFoodBtn = document.getElementById("nextFoodBtn");
const dateError = document.getElementById("dateError");

const foodCards = document.querySelectorAll(".food-card");
const finishBtn = document.getElementById("finishBtn");
const foodError = document.getElementById("foodError");

const finalText = document.getElementById("finalText");
const restartBtn = document.getElementById("restartBtn");

let selectedFood = "";
let selectedDate = "";
let selectedTime = "";

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
}

yesBtn.addEventListener("click", () => {
  showScreen(screenDate);
});

function moveNoButton() {
  noMessage.classList.add("show");
  noBtn.classList.add("runaway");

  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = window.innerWidth - buttonWidth - 20;
  const maxY = window.innerHeight - buttonHeight - 20;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

nextFoodBtn.addEventListener("click", () => {
  selectedDate = dateInput.value;
  selectedTime = timeInput.value;

  if (!selectedDate || !selectedTime) {
    dateError.textContent = "Falta elegir el día y la hora 😌";
    return;
  }

  dateError.textContent = "";
  showScreen(screenFood);
});

foodCards.forEach((card) => {
  card.addEventListener("click", () => {
    foodCards.forEach((item) => item.classList.remove("selected"));
    card.classList.add("selected");

    selectedFood = card.dataset.food;
    foodError.textContent = "";
  });
});

finishBtn.addEventListener("click", () => {
  if (!selectedFood) {
    foodError.textContent = "Tienes que escoger la comida primero 😂";
    return;
  }

  const formattedDate = formatDate(selectedDate);

  finalText.innerHTML = `
    Me alegra mucho que hayas dicho que sí. 
    Entonces queda pendiente nuestra salida para el 
    <strong>${formattedDate}</strong> a las 
    <strong>${selectedTime}</strong>, con 
    <strong>${selectedFood}</strong>.
  `;

  showScreen(screenFinal);
});

restartBtn.addEventListener("click", () => {
  selectedFood = "";
  selectedDate = "";
  selectedTime = "";

  dateInput.value = "";
  timeInput.value = "";
  foodCards.forEach((item) => item.classList.remove("selected"));

  noBtn.classList.remove("runaway");
  noBtn.style.left = "";
  noBtn.style.top = "";
  noMessage.classList.remove("show");

  showScreen(screenQuestion);
});

function formatDate(dateValue) {
  const date = new Date(dateValue + "T00:00:00");

  return date.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function createHeart() {
  const heartsContainer = document.getElementById("heartsContainer");
  const heart = document.createElement("div");

  const emojis = ["💗", "🌸", "💕", "✨", "💖"];
  heart.classList.add("heart");
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${18 + Math.random() * 18}px`;
  heart.style.animationDuration = `${4 + Math.random() * 4}s`;

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8000);
}

setInterval(createHeart, 600);
