let questions = document.getElementById('questions');
let answersbtn = document.querySelector('.answersbtn')
let nextbtn = document.querySelector('.nextbtn')

let que = [];
let currentindex = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions()
})

    async function fetchQuestions() {
        let api = await fetch('https://opentdb.com/api.php?amount=10&category=9&type=multiple')
        let data = await api.json()

        que = data.results.map((questionData) => {
            const formattedQuestion = {
                question: decodeURIComponent(questionData.question),
                answers: []
            };

            const incorrectAnswers = questionData.incorrect_answers.map(ans => ({
                text: decodeURIComponent(ans),
                correct: false
            }));

            const correctAnswers = {
                text: decodeURIComponent(questionData.correct_answer),
                correct: true
            };

            formattedQuestion.answers = [correctAnswers,...incorrectAnswers].sort(() => Math.random() - 0.5);
            return formattedQuestion;
        });

        // checkNoData();
        startQuiz();
        // checkNoData();
    }

function startQuiz() {
    nextbtn.classList.add('hide')
    currentindex = 0;
    showQuestion(que[currentindex],currentindex)
}

// function checkNoData() {
//     if (que.length === 0 || currentindex === 0) {
//         nextbtn.classList.add('hide');
//         questions.innerText = 'No questions available';
//     }
// }

function showQuestion(que,qno) {
    resetState()
    nextbtn.classList.add('hide')
    questions.innerText = `Question ${qno + 1} : ${que.question}`
    que.answers.forEach(elem => {
        const btn = document.createElement('button');
        btn.innerText = elem.text;
        btn.classList.add('btn');
        if (elem.correct) {
            btn.dataset.correct = true;
        }
        else {
            btn.dataset.correct = false;
        }
        btn.addEventListener('click', selectAnswer)
        answersbtn.appendChild(btn)
    });
}

function resetState() {
    nextbtn.classList.add('hide');
    while (answersbtn.firstChild) {
        answersbtn.removeChild(answersbtn.firstChild)
    }
    nextbtn.classList.add('hide');
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    Array.from(answersbtn.children).forEach(ele => {
        setStatusClass(ele, ele.dataset.correct === 'true')
    });

    if (currentindex === que.length - 1) {
        nextbtn.innerHTML = "Restart";
        nextbtn.classList.remove('hide');
    } else {
        nextbtn.innerText = "Next"
        nextbtn.classList.remove('hide');
    }

}

function setStatusClass(element, correct) {
    clearStatusClass(element)

    if (correct) {
        element.classList.add('correct')
    }
    else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

nextbtn.addEventListener('click', () => {
    currentindex++;

    if (currentindex < que.length) {
        showQuestion(que[currentindex],currentindex);
    } else {
        // Check if it's time to restart the quiz
        restartQuiz();
    }
});

function restartQuiz() {
    // Reset the current index to 0
    currentindex = 0;

    // Fetch new questions and start the quiz
    fetchQuestions();
}
