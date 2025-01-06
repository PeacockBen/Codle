# read /data/questions.json

# example data/questions.json
# {'levels': [{'level': '1', 'lessons': [{'lesson': 'Lesson 1', 'questions': [{'question': 'What is a variable?', 'answer': 'A variable is a named container that stores a value.', 'type': 'multiple choice'}, {'question': 'What is a loop?', 'answer': 'A loop is a programming construct that repeats a set of instructions.', 'type': 'fill in the blank'}]},


import json
import random
from flask import Flask, jsonify


app = Flask(__name__)

def get_lesson_data():
    with open('data/questions.json') as f:
        questions = json.load(f)
    return questions

def get_lessons_by_level_questions(level=1):
    lessons = get_lesson_data()
    count = 0
    for levelData in lessons['levels']:
        count += 1
        if count == level:
            return levelData

    print('Level not found')
    return None

def get_questions_by_lesson(lessonData, lesson=1):
    count = 0
    for questionData in lessonData['lessons']:
        count += 1
        if count == lesson:
            questions = []
            answers = []
            for question in questionData['questions']:
                questions.append(question['question'])
                answers.append(question['answer'])
            return questions, answers
    

def get_wrong_answers(answer, level=1):
    # get all answers from current level
    lessons = get_lessons_by_level_questions(level)
    allAnswers = []
    for lesson in lessons['lessons']:
        for question in lesson['questions']:
            allAnswers.append(question['answer'])
    # remove correct answers from all answers
    allAnswers.remove(answer)
    # get 3 random answers
    randomAnswers = random.sample(allAnswers, 3)
    randomAnswers.append(answer)
    random.shuffle(randomAnswers)
    return randomAnswers




def get_current_questions_and_answers(level=1, lesson=1, currentQuestion=1):
    # get lessons by level
    lessons = get_lessons_by_level_questions(level)
    # get current lesson questions and answers
    currentQuestions = get_questions_by_lesson(lessons, lesson)
    correctAnswer = currentQuestions[1][currentQuestion-1]
    # generate random answers
    randomAnswers = get_wrong_answers(currentQuestions[1][currentQuestion-1], level)
    question = currentQuestions[0][currentQuestion-1]
    answers = randomAnswers
    return question, answers, correctAnswer

# get current questions and answers for each question in a lesson
def get_all_questions_and_answers(level=1, lesson=1):
    # get lessons by level
    lessons = get_lessons_by_level_questions(level)
    # get current lesson questions and answers
    currentQuestions = get_questions_by_lesson(lessons, lesson)
    questions = currentQuestions[0]
    answers = currentQuestions[1]
    allQuestions = []
    for i in range(len(questions)):
        correctAnswer = answers[i]
        # generate random answers
        randomAnswers = get_wrong_answers(answers[i], level)
        question = questions[i]
        allQuestions.append((question, randomAnswers, correctAnswer))
    return allQuestions

@app.route('/api/questions/<int:level>/<int:lesson>', methods=['GET'])
def fetch_questions(level, lesson):
    questions_and_answers = get_all_questions_and_answers(level, lesson)
    return jsonify(questions_and_answers)

if __name__ == '__main__':
    app.run(port=5000)
