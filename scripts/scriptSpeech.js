const synth = window.speechSynthesis;

let currentQuestionIndex = 0;
let score = 0;
const questions = [
  {
    question: "What is the capital of Portugal?",
    answer: "Lisbon",
    feedback: "Correct! The capital of Portugal is Lisbon."
  },
  {
    question: "Which country is best known for its beer, chocolate and fries?",
    answer: "Belgium",
    feedback: "Correct! Belgium is best known for its beer, chocolate and fries."
  },
  {
    question: "How many continents are there?",
    answer: "Seven",
    feedback: "Correct! There are seven different continents!"
  },
  {
    question: "Which animal is known for its long neck?",
    answer: "Giraffe",
    feedback: "Correct! A giraffe is known for its long neck!"
  },
  {
    question: "What is the largest country on earth?",
    answer: "Russia",
    feedback: "Correct! Russia is the largest country on earth!"
  },
  {
    question: "What is the name of the red plumber with a mustache?",
    answer: "Mario",
    feedback: "Correct! Mario is the name of the red plumber with a mustache!"
  }
];

document.querySelector("#startBtn").addEventListener("click", () => {
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('speakBtn').style.display = 'block';
  document.querySelector('h2').style.display = 'block';
  document.querySelector('h2').textContent = `Question 1/${questions.length}`;
  setAndSpeakQuestion(currentQuestionIndex);
});

const setAndSpeakQuestion = (index) => {
  if (index < questions.length) {
    document.querySelector("#output").innerHTML = "";
    const questionText = questions[index].question;
    document.querySelector('h1').textContent = questionText;
    synth.speak(new SpeechSynthesisUtterance(questionText));
  }
};

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const speakBtn = document.querySelector('#speakBtn');

const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript;
  console.log(transcript);
  
  let isCorrect = false;
  const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();
  if (transcript.toLowerCase() === correctAnswer) {
    document.querySelector("#output").innerHTML = `You answered: ${transcript} - Correct!<br>`;
    synth.speak(new SpeechSynthesisUtterance("Correct!"));
    isCorrect = true;
    score++;
  } else {
    document.querySelector("#output").innerHTML += `You answered: ${transcript} - Incorrect. The correct answer is ${correctAnswer}.<br>`;
  }

  if (isCorrect) {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      document.querySelector('h2').textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
      setAndSpeakQuestion(currentQuestionIndex);
    } else {
      document.querySelector('h1').textContent = `Quiz Complete! Your score is ${score}/${questions.length}.`;
      synth.speak(new SpeechSynthesisUtterance(`Quiz Complete! Your score is ${score} out of ${questions.length}.`));
      document.getElementById('speakBtn').style.display = 'none';
      document.getElementById('output').style.display = 'none';
      document.getElementById('restartBtn').style.display = 'block';
    }
  }
  
  speakBtn.disabled = false;
};

speakBtn.addEventListener("click", function () {
  recognition.start();
  speakBtn.disabled = true;
});
