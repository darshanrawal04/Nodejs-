const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const app = express();
const port = 3000;

// Sample question store
const questionStore = [
  { id: uuidv4(), text: 'What is the capital of France?', difficulty: 'easy', marks: 2 },
  { id: uuidv4(), text: 'Solve the equation: 2x + 5 = 15', difficulty: 'medium', marks: 5 },
  { id: uuidv4(), text: 'Who is the author of "To Kill a Mockingbird"?', difficulty: 'easy', marks: 3 },
  { id: uuidv4(), text: 'What is the main component of Earth\'s atmosphere?', difficulty: 'medium', marks: 4 },
  { id: uuidv4(), text: 'Simplify: (3x + 2)(4x - 5)', difficulty: 'hard', marks: 6 },
  { id: uuidv4(), text: 'In which year did World War II end?', difficulty: 'medium', marks: 3 },
  // Add more questions as needed
];

// Generate a question paper based on the total marks and distribution of marks
function generateQuestionPaper(totalMarks) {
  const questionPaper = [];
  let remainingMarks = totalMarks;

  // Helper function to get a random question of a specific difficulty
  function getRandomQuestion(difficulty) {
    const filteredQuestions = _.filter(questionStore, { difficulty });
    return _.sample(filteredQuestions);
  }

  // Generate questions based on difficulty levels and marks distribution
  const difficultyDistribution = { easy: 0.3, medium: 0.5, hard: 0.2 };
  _.forEach(difficultyDistribution, (percentage, difficulty) => {
    const difficultyMarks = Math.round(totalMarks * percentage);
    _.times(difficultyMarks, () => {
      const question = getRandomQuestion(difficulty);
      if (question && question.marks <= remainingMarks) {
        questionPaper.push(question);
        remainingMarks -= question.marks;
      }
    });
  });

  return questionPaper;
}

app.use(bodyParser.json());

// Endpoint to generate a question paper
app.post('/generate-paper', (req, res) => {
  const { totalMarks } = req.body;

  if (!totalMarks || typeof totalMarks !== 'number' || totalMarks <= 0) {
    return res.status(400).json({ error: 'Invalid totalMarks value' });
  }

  const questionPaper = generateQuestionPaper(totalMarks);
  res.json({ questionPaper });
});

// Start the server
app.listen(port, () => {
  console.log(`Question Paper Generator app listening at http://localhost:${port}`);
});
