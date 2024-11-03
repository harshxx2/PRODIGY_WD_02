let startTime, updatedTime = 0;
let timerInterval;
let isRunning = false;
let lapCounter = 1;
let laps = [];

// DOM elements
const timeDisplay = document.getElementById("time-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const lapBtn = document.getElementById("lap-btn");
const saveBtn = document.getElementById("save-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const lapsContainer = document.getElementById("laps");
const circle = document.getElementById("circle");

// Format time function
function formatTime(ms) {
  const minutes = String(Math.floor(ms / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return `${minutes}:${seconds}:${milliseconds}`;
}

// Start/Stop functionality
function toggleStopwatch() {
  if (!isRunning) {
    startTime = Date.now() - updatedTime;
    timerInterval = setInterval(updateTime, 10);
    startBtn.textContent = "Stop";
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    saveBtn.disabled = true;
    isRunning = true;
  } else {
    clearInterval(timerInterval);
    startBtn.textContent = "Start";
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    saveBtn.disabled = laps.length > 0;
    isRunning = false;
  }
}

// Update time display and animate the circle gradient
function updateTime() {
  updatedTime = Date.now() - startTime;
  timeDisplay.textContent = formatTime(updatedTime);

  const degrees = (updatedTime / 100) % 360;
  circle.style.background = `conic-gradient(#4CAF50 ${degrees}deg, #FF5722 0deg)`;
}

// Pause functionality
function pauseStopwatch() {
  clearInterval(timerInterval);
  startBtn.textContent = "Resume";
  pauseBtn.disabled = true;
  isRunning = false;
}

// Reset functionality
function resetStopwatch() {
  clearInterval(timerInterval);
  updatedTime = 0;
  isRunning = false;
  timeDisplay.textContent = "00:00:00";
  startBtn.textContent = "Start";
  pauseBtn.disabled = true;
  lapBtn.disabled = true;
  saveBtn.disabled = true;
  lapsContainer.innerHTML = "";
  laps = [];
  lapCounter = 1;
  circle.style.background = `conic-gradient(#4CAF50, #FF5722, #4CAF50)`;
}

// Add lap functionality
function addLap() {
  const lapTime = formatTime(updatedTime);
  const lastLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
  const individualLapTime = updatedTime - lastLapTime;
  laps.push({ lap: lapCounter, time: updatedTime });

  const lapItem = document.createElement("li");
  lapItem.textContent = `Lap ${lapCounter}: ${lapTime} (+${formatTime(individualLapTime)})`;
  lapsContainer.appendChild(lapItem);

  lapCounter++;
  saveBtn.disabled = false;
}

// Save lap times as CSV
function saveLaps() {
  const csvContent = "data:text/csv;charset=utf-8," + laps.map(lap => `Lap ${lap.lap},${formatTime(lap.time)}`).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "lap_times.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Toggle theme
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

// Event Listeners
startBtn.addEventListener("click", toggleStopwatch);
pauseBtn.addEventListener("click", pauseStopwatch);
resetBtn.addEventListener("click", resetStopwatch);
lapBtn.addEventListener("click", addLap);
saveBtn.addEventListener("click", saveLaps);
themeToggleBtn.addEventListener("click", toggleTheme);
