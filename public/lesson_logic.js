document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questions-container');
    const levelSelect = document.getElementById('level-select');
    const lessonSelect = document.getElementById('lesson-select');
    const loadButton = document.getElementById('load-lesson');
    let questions = [];
    let currentQuestionIndex = 0;

    // Event listener for the "Load Lesson" button
    loadButton.addEventListener('click', () => {
        const level = parseInt(levelSelect.value);
        const lesson = parseInt(lessonSelect.value);
        loadQuestions(level, lesson);
    });

    // Fetch questions for the selected level and lesson
    function loadQuestions(level, lesson) {
        questionsContainer.innerHTML = ''; // Clear previous content
        currentQuestionIndex = 0; // Reset question index
        questions = []; // Clear previous questions

        fetch(`/api/questions/${level}/${lesson}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch questions: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                questions = data; // Store questions
                displayCurrentQuestion(); // Display the first question
            })
            .catch(error => console.error('Error fetching questions:', error));
    }

    // Display the current question
    function displayCurrentQuestion() {
        questionsContainer.innerHTML = ''; // Clear previous content
    
        if (currentQuestionIndex >= questions.length) {
            questionsContainer.innerHTML = '<h3>Quiz Complete! Well done!</h3>';
            return;
        }
    
        const [questionText, options, correctAnswer] = questions[currentQuestionIndex];
    
        // Create the question element
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        const questionHeader = document.createElement('h3');
        questionHeader.textContent = `Q${currentQuestionIndex + 1}: ${questionText}`;
        questionElement.appendChild(questionHeader);
    
        // Create the button container
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('answer-button');
            button.addEventListener('click', () => checkAnswer(option, correctAnswer));
            buttonContainer.appendChild(button);
        });
    
        // Append the questionElement first, then the buttonContainer
        questionsContainer.appendChild(questionElement);
        questionsContainer.appendChild(buttonContainer);
    }

    // Check if the selected answer is correct
    function checkAnswer(selectedAnswer, correctAnswer) {
        const feedbackContainer = document.getElementById('feedback-container');
        
        // Clear previous feedback
        feedbackContainer.innerHTML = '';
    
        // Create feedback box
        const feedbackBox = document.createElement('div');
        feedbackBox.classList.add('feedback-box');
    
        // Set feedback text
        feedbackBox.textContent =
            selectedAnswer === correctAnswer
                ? 'Correct! Moving to the next question...'
                : `Incorrect. The correct answer is: ${correctAnswer}`;
    
        // Add feedback to the container
        feedbackContainer.appendChild(feedbackBox);

        feedbackContainer.classList.add('visible');
    
        // Add a short delay before moving to the next question
        setTimeout(() => {
            feedbackContainer.classList.remove('visible');
            feedbackContainer.innerHTML = ''; // Clear the feedback
            currentQuestionIndex++;
            displayCurrentQuestion();
        }, 2000);
    }
});
