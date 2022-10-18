import playList from "./playList.js";

const time = document.querySelector(".time");
const dates = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const back = document.querySelector("body");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const quote = document.querySelector(".quote");
const changeQuote = document.querySelector(".change-quote");
const city = document.querySelector(".city");
const play = document.querySelector(".play");
const playPrev = document.querySelector(".play-prev");
const playNext = document.querySelector(".play-next");

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}
showTime();

function showDate() {
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const currentDate = date.toLocaleDateString("ru-RU", options);
  dates.textContent = currentDate;
}

function getTimeOfDay() {
  const hours = new Date().getHours();
  const timeOfDay = [
    "Доброй ночи, ",
    "Доброе утро, ",
    "Добрый день, ",
    "Добрый вечер, ",
  ];
  return timeOfDay[Math.floor(hours / 6)];
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  const greetingText = `${timeOfDay}`;
  greeting.textContent = greetingText;
}
const name1 = document.querySelector(".name");
function setLocalStorage() {
  localStorage.setItem("name", name1.value);
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorage);
function getLocalStorage() {
  if (localStorage.getItem("name")) {
    name1.value = localStorage.getItem("name");
  }
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
  }
}
window.addEventListener("load", getLocalStorage);

function getRandomNum() {
  let a = Math.ceil(Math.random() * 20);
  return a;
}

function getTimeOfDay1() {
  const hours = new Date().getHours();
  const timeOfDay = ["night", "morning", "afternoon", "evening"];
  return timeOfDay[Math.floor(hours / 6)];
}
let bgNum = getRandomNum().toString().padStart(2, "0");
function setBg() {
  const img = new Image();
  const timeOfDay = getTimeOfDay1();
  const url = `https://raw.githubusercontent.com/alexeynakrainikov/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.src = url;
  img.onload = () => {
    back.style.backgroundImage = `url('${url}')`;
  };
}
setBg();

function getSlideNext() {
  bgNum == 20 ? (bgNum = 1) : bgNum++;
  bgNum = bgNum.toString().padStart(2, "0");
  setBg();
}

function getSlidePrev() {
  bgNum == 1 ? (bgNum = 20) : bgNum--;
  bgNum = bgNum.toString().padStart(2, "0");
  setBg();
}

slideNext.addEventListener("click", getSlideNext);
slidePrev.addEventListener("click", getSlidePrev);
let minsk;
if (localStorage.getItem("city")) {
  minsk = localStorage.getItem("city");
} else minsk = "Минск";
let urlW = `https://api.openweathermap.org/data/2.5/weather?q=${minsk}&lang=ru&appid=2c914703bfd84b9090bd092940528ad5&units=metric`;

async function getWeather() {
  const res = await fetch(urlW);
  const data = await res.json();
  if ("message" in data) {
    weatherDescription.textContent = `Некорректно введен населенный пункт!!!`;
    weatherIcon.className = "weather-icon owf";
    temperature.textContent = ``;
    humidity.textContent = ``;
    wind.textContent = ``;
  } else {
    weatherIcon.className = "weather-icon owf";
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `Температура ${Math.round(data.main.temp)} °C`;
    humidity.textContent = `Влажность ${Math.round(data.main.humidity)} %`;
    wind.textContent = `Ветер ${Math.round(data.wind.speed)} м/с`;
    weatherDescription.textContent = `За бортом ${data.weather[0].description}`;
  }
}
getWeather();

function getChangeCity() {
  urlW = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=2c914703bfd84b9090bd092940528ad5&units=metric`;
  getWeather();
}
city.addEventListener("change", getChangeCity);

let DateFoFetch;
function setDate() {
  const date = new Date();
  const options = {
    month: "numeric",
    day: "numeric",
  };
  DateFoFetch = date.toLocaleDateString("ru-RU", options);
}
setDate();

const DateDay = DateFoFetch.slice(0, 2);
const DateMonth = DateFoFetch.slice(3, 5);
let urlquote = `http://numbersapi.com/${DateMonth}/${DateDay}/date`;
async function getQuote() {
  const res = await fetch(urlquote);
  const data = await res.text();
  quote.textContent = `${data}`;
}
getQuote();
changeQuote.addEventListener("click", getQuote);

const audio = new Audio();
let isPlay = false;
let numPlay = 0;
function playAudio() {
  if (!isPlay) {
    audio.src = `${playList[numPlay].src}`;
    audio.volume = 0.2;
    audio.play();
    play.classList.add("pause");
    isPlay = true;
    document
      .querySelectorAll(".play-item")
      [numPlay].classList.add("item-active");
  } else {
    pauseAudio();
  }
}
audio.addEventListener("ended", nextAudio);

play.addEventListener("click", playAudio);

function pauseAudio() {
  document
    .querySelectorAll(".play-item")
    [numPlay].classList.remove("item-active");
  audio.pause();
  play.classList.remove("pause");
  isPlay = false;
}

function nextAudio() {
  numPlay === 3 ? (numPlay = 0) : numPlay++;
  audio.src = `${playList[numPlay].src}`;
  audio.volume = 0.2;
  audio.play();
  play.classList.add("pause");
  isPlay = true;
  document.querySelector(".item-active").classList.remove("item-active");
  document.querySelectorAll(".play-item")[numPlay].classList.add("item-active");
}

playNext.addEventListener("click", nextAudio);

function prevAudio() {
  numPlay === 0 ? (numPlay = 3) : numPlay--;
  audio.src = `${playList[numPlay].src}`;

  audio.volume = 0.2;
  audio.play();
  play.classList.add("pause");
  isPlay = true;
  document.querySelector(".item-active").classList.remove("item-active");
  document.querySelectorAll(".play-item")[numPlay].classList.add("item-active");
}

playPrev.addEventListener("click", prevAudio);

const playListContainer = document.querySelector(".play-list");
playList.forEach((playListItem) => {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = `${playListItem.title}`;
  playListContainer.append(li);
});

function launchAll(launchMissile) {
  for (let i = 0; i < 5; i++) {
    (function (a) {
      setTimeout(launchMissile(a), a * 1000);
    })(i);
  }
}
