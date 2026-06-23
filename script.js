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
const card = document.querySelector(".card");

let selectedFood = "";
let selectedDate = "";
let selectedTime = "";
let noOrigin = null;

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");
  card.scrollTop = 0;
}

yesBtn.addEventListener("click", () => {
  showScreen(screenDate);
});

function moveNoButton() {
  if (!screenQuestion.classList.contains("active")) return;

  noMessage.classList.add("show");

  const cardRect = card.getBoundingClientRect();
  const buttonRect = noBtn.getBoundingClientRect();

  if (!noBtn.classList.contains("runaway")) {
    const startX = buttonRect.left - cardRect.left + card.scrollLeft;
    const startY = buttonRect.top - cardRect.top + card.scrollTop;

    noOrigin = {
      x: startX,
      y: startY
    };

    noBtn.classList.add("runaway");
    noBtn.style.left = `${startX}px`;
    noBtn.style.top = `${startY}px`;
  }

  const padding = 24;
  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = card.clientWidth - buttonWidth - padding;
  const maxY = card.clientHeight - buttonHeight - padding;

  const rangeX = 115;
  const rangeY = 85;

  let randomX = noOrigin.x + (Math.random() * rangeX * 2 - rangeX);
  let randomY = noOrigin.y + (Math.random() * rangeY * 2 - rangeY);

  randomX = Math.max(padding, Math.min(randomX, maxX));
  randomY = Math.max(padding, Math.min(randomY, maxY));

  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
}

card.addEventListener("mousemove", (event) => {
  if (!screenQuestion.classList.contains("active")) return;

  const buttonRect = noBtn.getBoundingClientRect();

  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonCenterY = buttonRect.top + buttonRect.height / 2;

  const distance = Math.hypot(
    event.clientX - buttonCenterX,
    event.clientY - buttonCenterY
  );

  if (distance < 95) {
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
    Y aunque parezca solo una salida, para mí será una pequeña pausa bonita:
    un momento para mirarte sin prisa, escucharte con calma
    y dejar que la noche tenga algo nuestro.
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
  noOrigin = null;
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
