const questions = [
    {
        question: "1. What is JavaScript primarily used for?",
        options: ["Styling web pages", "Building responsive web pages", "Server-side scripting", "Client-side scripting"],
        correctAnswer: "Client-side scripting"
    },
    {
        question: "2. Which keyword is used to declare variables in JavaScript?",
        options: ["var", "let", "const", "variable"],
        correctAnswer: "var"
    },
    {
        question: "3. What is the result of the expression '2' + 2 in JavaScript?",
        options: ["4", "22", "TypeError", "NaN"],
        correctAnswer: "22"
    },
    {
        question: "4. Which syntax is used to create a multi-line comment in JavaScript?",
        options: ["// This is a comment", "/* This is a comment */","/** This is a comment **/", "/* This is a comment"],
        correctAnswer: "/* This is a comment */"
    },
    {
        question: "5. Which built-in method can be used to convert a string to uppercase in JavaScript?",
        options: ["toUpperCase()", "toUpperCaseCase()", "toUpper()", "toUpperCaseString()"],
        correctAnswer: "toUpperCase()"
    }
];

let currentQuestionIndex = 0;
let score = 0;
const wrongAnswers = [];
let questionSubmitted = false; // Variable to track if the question has been submitted

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const feedbackElement = document.getElementById("feedback");
const feedbackElement1 = document.getElementById("feed");
const scoreElement = document.getElementById("score");
const refreshButton = document.getElementById("refresh-button");
const wrongAnswersContainer = document.querySelector(".wrong-answers-container");
const wrongAnswersList = document.getElementById("wrong-answers-list");
const timerElement = document.getElementById("timer"); // Timer element in HTML

// Initially hide the wrong answers container
wrongAnswersContainer.style.display = "none";

let timer = 20; // Set the initial timer value in seconds
let timerInterval;

// Start the timer when a new question is displayed
function startTimer() {
    timer = 20; // Reset the timer for each question
    clearInterval(timerInterval); // Clear any existing timerInterval
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

function updateTimerDisplay() {
    if (timerElement) {
        timerElement.textContent = `Time Left: ${timer}`;

        if (timer === 0) {
            clearInterval(timerInterval); // Stop the timer
            checkAnswer(null); // Handle time's up logic by checking the answer
            setTimeout(() => {
                moveNext();
            });
        } else if (timer <= 10) {
            // Change text color to red when the timer is less than or equal to 10 seconds
            timerElement.style.color = "#dc3545";
            timer--; // Decrease the timer by 1 second
        } else {
            timerElement.style.color = "#000"; // Reset text color to black
            timer--; // Decrease the timer by 1 second
        }
    }
}


// Add a function to move to the next question
function moveNext() {
    if (!questionSubmitted) {
        feedbackElement.textContent = "Please submit your answer.";
        return; // Don't move to the next question if the answer is not submitted
    }

    // Remove the fade-in-animation class after the animation completes
    questionElement.classList.remove("fade-in-animation");
    optionsElement.classList.remove("fade-in-animation");

    nextButton.disabled = false;
    optionsElement.removeEventListener("click", () => checkAnswer());

    currentQuestionIndex++;
    questionSubmitted = false; // Reset the question submission status

    if (currentQuestionIndex < questions.length) {
        displayQuestion(questions[currentQuestionIndex]);
    } else {
        displayFinalScore();
    }

    // Clear the feedback after moving to the next question
    feedbackElement.textContent = "";
    feedbackElement.classList.remove("correct", "incorrect", "time-up");

}

function displayQuestion(question) {
    questionElement.textContent = question.question;
    optionsElement.innerHTML = "";
    optionsElement.classList.add("square-checkboxes","fade-in");

    question.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("square-checkbox");
        li.innerHTML = `
            <label>
                <input type="radio" name="option" value="${option}">
                <span class="checkbox-icon"></span>
                ${option}
            </label>
        `;
        optionsElement.appendChild(li);
    });

    // Hide the "Next" button initially
    nextButton.style.display = "none";

    // Create a container for the buttons (Submit and Next)
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // Create the Submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", () => submitQuestion());
    buttonContainer.appendChild(submitButton);

    // Create the Next button
    nextButton.textContent = "Next"; // Reset the Next button text
    buttonContainer.appendChild(nextButton);

    // Append the button container below the options
    optionsElement.appendChild(buttonContainer);

    // Add the fade-in-animation class to the questions container
    questionElement.classList.add("fade-in-animation");
    optionsElement.classList.add("fade-in-animation");

    startTimer(); // Start the timer when a new question is displayed
}

nextButton.style.display = "none";

function checkAnswer(selectedOption) {
    if (questionSubmitted) {
        return; // Prevent submitting the same question multiple times
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Check if the selectedOption is correct
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    // Check if the timer has expired (timer === 0)
    if (timer === 0) {
        feedbackElement.textContent = "Time's up!";
        feedbackElement.classList.remove("correct", "incorrect");
        feedbackElement.classList.add("time-up");
        wrongAnswers.push({ question: currentQuestion.question, selectedOption: "Time's up!", correctAnswer: currentQuestion.correctAnswer });
    } else if (isCorrect) {
        score++;
        feedbackElement.textContent = "Correct!";
        feedbackElement.classList.remove("incorrect", "time-up");
        feedbackElement.classList.add("correct");
        // Highlight the correct option with a green background
        optionsElement.querySelectorAll('input[type="radio"]').forEach((radio) => {
            if (radio.value === currentQuestion.correctAnswer) {
                radio.closest("li").classList.add("selected-correct");
            }
        });
    } else {
        feedbackElement.textContent = "Incorrect.";
        feedbackElement.classList.remove("correct", "time-up");
        feedbackElement.classList.add("incorrect");
        // Highlight the incorrect option with a red background
        optionsElement.querySelectorAll('input[type="radio"]').forEach((radio) => {
            if (radio.value === selectedOption) {
                radio.closest("li").classList.add("selected-incorrect");
            }
        });
        wrongAnswers.push({ question: currentQuestion.question, selectedOption, correctAnswer: currentQuestion.correctAnswer });
    }

    nextButton.disabled = false;
    optionsElement.querySelectorAll('input[type="radio"]').forEach((radio) => {
        radio.disabled = true; // Disable radio buttons after submission
    });
    submitButton.disabled = true; // Disable the submit button after submission
    // Show the "Next" button after the answer is checked
    nextButton.style.display = "block";

    questionSubmitted = true; // Mark the question as submitted
}


function submitQuestion() {
    if (questionSubmitted) {
        return; // Prevent submitting the same question multiple times
    }

    const selectedRadioButton = document.querySelector('input[name="option"]:checked');
    if (!selectedRadioButton) {
        feedbackElement.textContent = "Please select an option.";
        return;
    }

    const selectedOption = selectedRadioButton.value;
    checkAnswer(selectedOption);

    nextButton.disabled = false; // Enable the next button after submission
    questionSubmitted = true; // Mark the question as submitted

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = "View Results"; // Change the button text to "Submit" for the final question
    } else {
        nextButton.textContent = "Next ➤"; // Change the button text back to "Next" for other questions
    }
}

const showWrongAnswersButton = document.getElementById("show-wrong-answers-button");

showWrongAnswersButton.addEventListener("click", () => {
    wrongAnswersContainer.style.display = "block";
    showWrongAnswersButton.style.display = "none"; // Hide the button after showing wrong answers
});


function displayFinalScore() {
    // Change the heading of the quiz container to "Score Report"
    const quizContainerHeading = document.querySelector(".quiz-container h1");
    quizContainerHeading.textContent = "Score Report";
    
    questionElement.textContent = "";
    optionsElement.innerHTML = "";
    timerElement.textContent = ""; // Clear the timer display
    clearInterval(timerInterval); // Stop the timer
    nextButton.style.display = "none";
    feedbackElement1.textContent = `Quiz Completed! Your final score is: ${score} out of ${questions.length}`;
    scoreElement.textContent = `Score: ${score}`;
    scoreElement.style.display = "block";

    if (wrongAnswers.length > 0) {
        const wrongAnswersTitle = document.createElement('h2');
        wrongAnswersTitle.textContent = 'Wrong Answers';

        wrongAnswersList.innerHTML = ""; // Clear any previous wrong answers

        wrongAnswers.forEach((answer) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>Question:</strong> ${answer.question}<br><strong>Your Answer:</strong> ${answer.selectedOption}<br><strong>Correct Answer:</strong> ${answer.correctAnswer}<br>`;
            wrongAnswersList.appendChild(li);
        });

        // Display the button to show wrong answers
        showWrongAnswersButton.style.display = "inline-block";
    }

    refreshButton.style.display = "inline-block"; // Display the refresh button after submitting all questions
}

function refreshQuiz() {
    location.reload();
}

const submitButton = document.createElement("button"); // Declare submitButton variable outside of the functions
submitButton.textContent = "Submit";
submitButton.addEventListener("click", () => submitQuestion());
optionsElement.appendChild(submitButton);

scoreElement.style.display = "none";
showWrongAnswersButton.style.display = "none"; // Hide the button after showing wrong answers
refreshButton.style.display = "none"; // Initially hide the refresh button
nextButton.addEventListener("click", moveNext);
refreshButton.addEventListener("click", refreshQuiz);
displayQuestion(questions[currentQuestionIndex]);
