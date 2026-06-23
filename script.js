const screenQuestion = document.getElementById("screenQuestion");
const screenDate = document.getElementById("screenDate");
const screenFood = document.getElementById("screenFood");
const screenFinal = document.getElementById("screenFinal");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noZone = document.getElementById("noZone");
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

let noReady = false;
let lastMove = 0;
let isMoving = false;

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach((item) => {
    item.classList.remove("active");
  });

  screen.classList.add("active");

  const foodScroll = document.querySelector(".food-scroll");
  if (foodScroll) {
    foodScroll.scrollTop = 0;
  }

  if (screen === screenQuestion) {
    setTimeout(resetNoButton, 50);
  }
}

yesBtn.addEventListener("click", () => {
  showScreen(screenDate);
});

function setupNoButtonPosition() {
  const zoneRect = noZone.getBoundingClientRect();
  const buttonRect = noBtn.getBoundingClientRect();

  const currentX = buttonRect.left - zoneRect.left;
  const currentY = buttonRect.top - zoneRect.top;

  noBtn.style.transform = "none";
  noBtn.style.left = `${currentX}px`;
  noBtn.style.top = `${currentY}px`;

  noReady = true;
}

function moveNoButton(event) {
  if (!screenQuestion.classList.contains("active")) return;

  const now = Date.now();

  if (isMoving || now - lastMove < 620) {
    return;
  }

  lastMove = now;
  isMoving = true;
  noMessage.classList.add("show");

  if (!noReady) {
    setupNoButtonPosition();
  }

  const zoneRect = noZone.getBoundingClientRect();

  const padding = 12;
  const minY = 42;

  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const minX = padding;
  const maxX = noZone.clientWidth - buttonWidth - padding;
  const maxY = noZone.clientHeight - buttonHeight - padding;

  let currentX = parseFloat(noBtn.style.left);
  let currentY = parseFloat(noBtn.style.top);

  if (Number.isNaN(currentX) || Number.isNaN(currentY)) {
    setupNoButtonPosition();
    currentX = parseFloat(noBtn.style.left);
    currentY = parseFloat(noBtn.style.top);
  }

  const cursorX = event ? event.clientX - zoneRect.left : noZone.clientWidth / 2;
  const cursorY = event ? event.clientY - zoneRect.top : noZone.clientHeight / 2;

  const buttonCenterX = currentX + buttonWidth / 2;
  const buttonCenterY = currentY + buttonHeight / 2;

  let awayX = buttonCenterX - cursorX;
  let awayY = buttonCenterY - cursorY;

  const distance = Math.hypot(awayX, awayY) || 1;

  awayX = awayX / distance;
  awayY = awayY / distance;

  const step = 58 + Math.random() * 34;
  const sideVariation = 24;

  let nextX = currentX + awayX * step + (Math.random() * sideVariation - sideVariation / 2);
  let nextY = currentY + awayY * step + (Math.random() * sideVariation - sideVariation / 2);

  nextX = Math.max(minX, Math.min(nextX, maxX));
  nextY = Math.max(minY, Math.min(nextY, maxY));

  const nextCenterX = nextX + buttonWidth / 2;
  const nextCenterY = nextY + buttonHeight / 2;
  const nextDistance = Math.hypot(nextCenterX - cursorX, nextCenterY - cursorY);

  if (nextDistance < 92) {
    let bestX = nextX;
    let bestY = nextY;
    let bestDistance = nextDistance;

    for (let i = 0; i < 12; i++) {
      const testX = minX + Math.random() * (maxX - minX);
      const testY = minY + Math.random() * (maxY - minY);

      const testCenterX = testX + buttonWidth / 2;
      const testCenterY = testY + buttonHeight / 2;

      const testDistance = Math.hypot(testCenterX - cursorX, testCenterY - cursorY);

      if (testDistance > bestDistance) {
        bestX = testX;
        bestY = testY;
        bestDistance = testDistance;
      }
    }

    nextX = bestX;
    nextY = bestY;
  }

  noBtn.classList.add("moving");
  noBtn.style.left = `${nextX}px`;
  noBtn.style.top = `${nextY}px`;

  setTimeout(() => {
    noBtn.classList.remove("moving");
    isMoving = false;
  }, 580);
}

noZone.addEventListener("pointermove", (event) => {
  if (!screenQuestion.classList.contains("active")) return;

  const buttonRect = noBtn.getBoundingClientRect();

  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonCenterY = buttonRect.top + buttonRect.height / 2;

  const distance = Math.hypot(
    event.clientX - buttonCenterX,
    event.clientY - buttonCenterY
  );

  if (distance < 72) {
    moveNoButton(event);
  }
});

noBtn.addEventListener("mouseenter", (event) => {
  moveNoButton(event);
});

noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton(event);
});

noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();

  const touch = event.touches[0];

  moveNoButton({
    clientX: touch.clientX,
    clientY: touch.clientY
  });
});

function resetNoButton() {
  noBtn.style.left = "50%";
  noBtn.style.top = "calc(100% - 58px)";
  noBtn.style.transform = "translateX(-50%)";
  noBtn.classList.remove("moving");

  noReady = false;
  lastMove = 0;
  isMoving = false;

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
