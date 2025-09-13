// Global variables
let questions = [];
let currentQuestion = 0;
let userAnswers = [];
let startTime;
let timerInterval;
let timeLeft;

// DOM elements
const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const skipBtn = document.getElementById("skip-btn");
const progressBar = document.getElementById("progress");
const timerElement = document.getElementById("timer");
const resultContainer = document.getElementById("result-container");
const scoreElement = document.getElementById("score");
const correctAnswersElement = document.getElementById("correct-answers");
const percentageElement = document.getElementById("percentage");
const timeTakenElement = document.getElementById("time-taken");
const scoreTextElement = document.getElementById("score-text");
const homeBtn = document.getElementById("home-btn");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notification-text");
const totalQuestionsElement = document.getElementById("total-questions");
const studentNameInput = document.getElementById("student-name");
const studentClassInput = document.getElementById("student-class");
const saveBtn = document.getElementById("save-btn");
const leaderboardBody = document.getElementById("leaderboard-body");

// Initialize the exam
async function initExam() {
  try {
    // Load questions from JSON file
    const response = await fetch("question.json");
    const data = await response.json();
    questions = data.questions;

    // Update UI with test title
    document.querySelector("h1").textContent = data.testTitle;

    // Initialize exam state
    userAnswers = Array(questions.length).fill(null);
    timeLeft = 60 * 60; // 60 minutes in seconds
    startTime = new Date();

    // Update UI
    totalQuestionsElement.textContent = questions.length;
    loadQuestion();
    startTimer();
    renderLeaderboard();

    // Add event listeners
    nextBtn.addEventListener("click", nextQuestion);
    prevBtn.addEventListener("click", prevQuestion);
    skipBtn.addEventListener("click", skipQuestion);
    homeBtn.addEventListener("click", redirectToHome);
    saveBtn.addEventListener("click", saveResults);
  } catch (error) {
    console.error("Error loading questions:", error);
    showNotification("Failed to load questions. Please try again later.");
  }
}

// Load question
function loadQuestion() {
  const question = questions[currentQuestion];

  // Update progress bar
  progressBar.style.width = `${
    ((currentQuestion + 1) / questions.length) * 100
  }%`;

  // Create question HTML
  questionContainer.innerHTML = `
        <div class="question">${currentQuestion + 1}. ${question.question}</div>
        <div class="options">
            ${question.options
              .map(
                (option, index) => `
                <div class="option ${
                  userAnswers[currentQuestion] === index ? "selected" : ""
                }" data-index="${index}">
                    <div class="option-label">${String.fromCharCode(
                      65 + index
                    )}</div>
                    <div class="option-text">${option}</div>
                    <div class="answer-feedback"></div>
                </div>
            `
              )
              .join("")}
        </div>
    `;

  // Add event listeners to options
  document.querySelectorAll(".option").forEach((option) => {
    option.addEventListener("click", selectOption);
  });

  // Update navigation buttons
  prevBtn.style.visibility = currentQuestion === 0 ? "hidden" : "visible";

  if (currentQuestion === questions.length - 1) {
    nextBtn.innerHTML = 'Submit <i class="fas fa-paper-plane"></i>';
    nextBtn.classList.add("btn-submit");
    nextBtn.classList.remove("btn-next");
  } else {
    nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    nextBtn.classList.remove("btn-submit");
    nextBtn.classList.add("btn-next");
  }
}

// Select option
function selectOption(e) {
  if (userAnswers[currentQuestion] !== null) {
    return; // Don't allow changing answers
  }

  const selectedOption = e.currentTarget;
  const optionIndex = parseInt(selectedOption.getAttribute("data-index"));

  // Mark as selected
  userAnswers[currentQuestion] = optionIndex;

  // Update UI
  document.querySelectorAll(".option").forEach((opt) => {
    opt.classList.remove("selected");
  });
  selectedOption.classList.add("selected");

  // Show correct/incorrect feedback
  showAnswerFeedback(optionIndex);
}

// Show answer feedback
function showAnswerFeedback(selectedIndex) {
  const correctIndex = questions[currentQuestion].correct;
  const options = document.querySelectorAll(".option");

  // Disable all options to prevent further selection
  options.forEach((option) => {
    option.style.pointerEvents = "none";
  });

  // Show correct answer with green background and tick
  options[correctIndex].classList.add("correct");
  options[correctIndex].querySelector(".answer-feedback").innerHTML =
    '<i class="fas fa-check"></i>';

  // If wrong answer selected, show red background and cross
  if (selectedIndex !== correctIndex) {
    options[selectedIndex].classList.add("incorrect");
    options[selectedIndex].querySelector(".answer-feedback").innerHTML =
      '<i class="fas fa-times"></i>';
  }

  // Auto-advance to next question after 1.5 seconds
  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion();
    } else {
      finishExam();
    }
  }, 1500);
}

// Next question
function nextQuestion() {
  if (currentQuestion === questions.length - 1) {
    finishExam();
    return;
  }

  if (userAnswers[currentQuestion] === null) {
    showNotification("Please select an answer before proceeding.");
    return;
  }

  currentQuestion++;
  loadQuestion();
}

// Previous question
function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

// Skip question
function skipQuestion() {
  if (currentQuestion === questions.length - 1) {
    showNotification("Cannot skip the last question.");
    return;
  }

  userAnswers[currentQuestion] = null;
  currentQuestion++;
  loadQuestion();
}

// Start timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerElement.textContent = `Time: ${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      finishExam();
    }
  }, 1000);
}

// Finish exam
function finishExam() {
  clearInterval(timerInterval);

  // Calculate score with negative marking
  let correctCount = 0;
  let incorrectCount = 0;

  userAnswers.forEach((answer, index) => {
    if (answer === questions[index].correct) {
      correctCount++;
    } else if (answer !== null) {
      incorrectCount++;
    }
  });

  // Apply negative marking: +1 for correct, -0.25 for incorrect
  const finalScore = Math.max(0, correctCount - incorrectCount * 0.25);
  const percentage = (finalScore / questions.length) * 100;

  // Calculate time taken
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const minutesTaken = Math.floor(timeTaken / 60);
  const secondsTaken = timeTaken % 60;

  // Update result UI
  scoreElement.textContent = `${finalScore.toFixed(2)}/${questions.length}`;
  correctAnswersElement.textContent = `${correctCount} (${incorrectCount} incorrect)`;
  percentageElement.textContent = `${percentage.toFixed(1)}%`;
  timeTakenElement.textContent = `${minutesTaken
    .toString()
    .padStart(2, "0")}:${secondsTaken.toString().padStart(2, "0")}`;

  // Set score text based on performance
  if (percentage >= 90) {
    scoreTextElement.textContent = "Outstanding performance!";
  } else if (percentage >= 75) {
    scoreTextElement.textContent = "Excellent work!";
  } else if (percentage >= 60) {
    scoreTextElement.textContent = "Good job!";
  } else if (percentage >= 50) {
    scoreTextElement.textContent = "You passed! Keep practicing!";
  } else {
    scoreTextElement.textContent = "Keep studying and try again!";
  }

  // Show result container, hide exam container
  document.querySelector(".container:first-child").style.display = "none";
  resultContainer.style.display = "block";
}

// Render leaderboard
function renderLeaderboard() {
  // Load leaderboard from localStorage
  let leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Clear existing content
  leaderboardBody.innerHTML = "";

  if (leaderboardData.length === 0) {
    // Show message if no one has completed the exam yet
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="5" style="text-align: center; padding: 20px; font-style: italic;">
        You are the first one to complete this Exam
      </td>
    `;
    leaderboardBody.appendChild(row);
  } else {
    // Sort leaderboard data by score (descending)
    leaderboardData.sort((a, b) => b.score - a.score);

    // Add rows to leaderboard
    leaderboardData.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="rank">${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.class}</td>
        <td>${student.score.toFixed(2)}/${questions.length}</td>
        <td>${student.time}</td>
      `;
      leaderboardBody.appendChild(row);
    });
  }
}

// Save results to leaderboard
function saveResults() {
  const name = studentNameInput.value.trim();
  const studentClass = studentClassInput.value.trim();

  if (!name || !studentClass) {
    showNotification("Please enter both your name and class.");
    return;
  }

  // Calculate score with negative marking
  let correctCount = 0;
  let incorrectCount = 0;

  userAnswers.forEach((answer, index) => {
    if (answer === questions[index].correct) {
      correctCount++;
    } else if (answer !== null) {
      incorrectCount++;
    }
  });

  const finalScore = Math.max(0, correctCount - incorrectCount * 0.25);

  // Calculate time taken
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const minutesTaken = Math.floor(timeTaken / 60);
  const secondsTaken = timeTaken % 60;
  const timeFormatted = `${minutesTaken
    .toString()
    .padStart(2, "0")}:${secondsTaken.toString().padStart(2, "0")}`;

  // Load existing leaderboard or initialize empty array
  let leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Add new result
  leaderboardData.push({
    name: name,
    class: studentClass,
    score: finalScore,
    time: timeFormatted,
  });

  // Sort by score (descending) and keep only top 10
  leaderboardData.sort((a, b) => b.score - a.score);
  leaderboardData = leaderboardData.slice(0, 10);

  // Save to localStorage
  localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));

  // Update leaderboard
  renderLeaderboard();

  // Show success message
  showNotification("Your results have been saved successfully!", true);

  // Disable save button to prevent duplicate entries
  saveBtn.disabled = true;
  saveBtn.style.opacity = "0.7";
  saveBtn.style.cursor = "not-allowed";
}

// Redirect to home page
function redirectToHome() {
  window.location.href = "/online_exam/onlinehome.html";
}

// Show notification
function showNotification(message, isSuccess = false) {
  notificationText.textContent = message;
  notification.className = isSuccess ? "notification success" : "notification";
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Initialize the exam when the page loads
document.addEventListener("DOMContentLoaded", initExam);
