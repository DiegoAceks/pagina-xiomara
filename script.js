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
let noOrigin = null;
let lastMove = 0;

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");

  const foodScroll = document.querySelector(".food-scroll");
  if (foodScroll) {
    foodScroll.scrollTop = 0;
  }
}

yesBtn.addEventListener("click", () => {
  resetNoButton();
  showScreen(screenDate);
});

function moveNoButton() {
  if (!screenQuestion.classList.contains("active")) return;

  const now = Date.now();

  if (now - lastMove < 260) {
    return;
  }

  lastMove = now;
  noMessage.classList.add("show");

  const areaRect = screenQuestion.getBoundingClientRect();
  const buttonRect = noBtn.getBoundingClientRect();

  if (!noBtn.classList.contains("runaway")) {
    const startX = buttonRect.left - areaRect.left;
    const startY = buttonRect.top - areaRect.top;

    noOrigin = {
      x: startX,
      y: startY
    };

    noBtn.classList.add("runaway");
    noBtn.style.left = `${startX}px`;
    noBtn.style.top = `${startY}px`;
  }

  const padding = 18;
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = screenQuestion.clientWidth - buttonWidth - padding;
  const maxY = screenQuestion.clientHeight - buttonHeight - padding;

  const movementX = Math.min(95, screenQuestion.clientWidth * 0.24);
  const movementY = Math.min(80, screenQuestion.clientHeight * 0.16);

  let randomX = noOrigin.x + (Math.random() * movementX * 2 - movementX);
  let randomY = noOrigin.y + (Math.random() * movementY * 2 - movementY);

  randomX = Math.max(padding, Math.min(randomX, maxX));
  randomY = Math.max(padding, Math.min(randomY, maxY));

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

screenQuestion.addEventListener("pointermove", (event) => {
  if (!screenQuestion.classList.contains("active")) return;

  const buttonRect = noBtn.getBoundingClientRect();

  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonCenterY = buttonRect.top + buttonRect.height / 2;

  const distance = Math.hypot(
    event.clientX - buttonCenterX,
    event.clientY - buttonCenterY
  );

  if (distance < 105) {
    moveNoButton();
  }
});

noBtn.addEventListener("mouseenter", moveNoButton);

noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});

function resetNoButton() {
  noBtn.classList.remove("runaway");
  noBtn.style.left = "";
  noBtn.style.top = "";
  noOrigin = null;
  lastMove = 0;
  noMessage.classList.remove("show");
}

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

nextFoodBtn.addEventListener("click", () => {
  selectedDate = dateInput.value;
  selectedTime = timeInput.value;

  if (!selectedDate || !selectedTime) {
    dateError.textContent = "Falta escoger el día y la hora 😌";
    return;
  }

  dateError.textContent = "";
  showScreen(screenFood);
});

foodCards.forEach((cardItem) => {
  cardItem.addEventListener("click", () => {
    foodCards.forEach((item) => item.classList.remove("selected"));
    cardItem.classList.add("selected");

    selectedFood = cardItem.dataset.food;
    foodError.textContent = "";
  });
});

finishBtn.addEventListener("click", () => {
  if (!selectedFood) {
    foodError.textContent = "Primero elige qué vamos a comer 😂";
    return;
  }

  const formattedDate = formatDate(selectedDate);

  finalText.innerHTML = `
    Entonces queda guardado: 
    <strong>${formattedDate}</strong>, a las 
    <strong>${selectedTime}</strong>, con 
    <strong>${selectedFood}</strong> de por medio.
    <br><br>
    Y quizá sea solo una salida, pero me gusta pensar que hay días pequeños
    que se vuelven especiales cuando se comparten con la persona correcta.
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

  resetNoButton();
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

  const emojis = ["💗", "🌸", "💕", "✨", "💖", "🌷"];
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

setInterval(createHeart, 650);
