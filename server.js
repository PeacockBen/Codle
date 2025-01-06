const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');



const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/questions/:level/:lesson', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: (path, req) => {
        // Rewrites /api/questions/:level/:lesson to /api/questions/:level/:lesson
        const { level, lesson } = req.params;
        return `/api/questions/${level}/${lesson}`;
    }
}));

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lesson.html'));
});



// // API endpoint to fetch questions
// app.get('/api/questions', (req, res) => {
//     const questionsPath = path.join(__dirname, 'data', 'questions.json');
//     fs.readFile(questionsPath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading questions:', err);
//             res.status(500).send('Error reading questions');
//         } else {
//             res.json(JSON.parse(data));
//         }
//     });
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
