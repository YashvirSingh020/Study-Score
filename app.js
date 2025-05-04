// Store all scores
let allScores = [];

// Get DOM elements
const form = document.querySelector('form');
const nameSelect = document.getElementById('name');
const scoreInput = document.getElementById('score');
const scoreTableBody = document.getElementById('scoreTableBody');

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedScores = localStorage.getItem('studyScores');
    if (savedScores) {
        allScores = JSON.parse(savedScores);
        updateTable();
    }
});

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = nameSelect.value;
    const score = parseFloat(scoreInput.value);
    const date = new Date().toISOString().split('T')[0];
    
    // Add new score to array
    allScores.push({
        date,
        name,
        score
    });
    
    // Save to localStorage
    localStorage.setItem('studyScores', JSON.stringify(allScores));
    
    // Update the table
    updateTable();
    
    // Reset form
    form.reset();
});

function updateTable() {
    // Clear existing table content
    scoreTableBody.innerHTML = '';
    
    // Group scores by date
    const scoresByDate = allScores.reduce((acc, score) => {
        if (!acc[score.date]) {
            acc[score.date] = [];
        }
        acc[score.date].push(score);
        return acc;
    }, {});
    
    // Get highest score for each date and sort by date (most recent first)
    const highestScores = Object.entries(scoresByDate)
        .map(([date, scores]) => {
            const highestScore = scores.reduce((max, curr) => 
                curr.score > max.score ? curr : max
            );
            return highestScore;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add rows to table
    highestScores.forEach(score => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(score.date)}</td>
            <td>${score.name}</td>
            <td>${score.score.toFixed(1)} hours</td>
        `;
        scoreTableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}