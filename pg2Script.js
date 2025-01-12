import ColorGame from './logic.js';
const game = new ColorGame();

document.addEventListener('DOMContentLoaded', () => {
    const colorBoxes = document.querySelectorAll('.colour-container .box, .colour-container1 .box');
    const answerBoxes = document.querySelectorAll('.answer-container .ans, .answer-container1 .ans');
    let selectedColorBox = null;
    let selectedAnswerBox = null;
    let matchedPairs = new Set();

    const colorMapping = {
        'c1': 'a1', // blue -> "blue"
        'c2': 'a2', // purple -> "purple"
        'c3': 'a3', // orange -> "orange"
        'c4': 'a4', // green -> "green"
        'c5': 'a5', // red -> "red"
        'c6': 'a6'  // yellow -> "yellow"
    };

    function handleColorBoxClick(event) {
        if (matchedPairs.has(event.target.id)) return;
        colorBoxes.forEach(box => box.style.border = '');
        event.target.style.border = '5px solid #007bff';
        selectedColorBox = event.target;
        
        checkMatch();
    }

    function handleAnswerBoxClick(event) {
        if (matchedPairs.has(event.target.id)) return;
        answerBoxes.forEach(box => box.style.border = '');
        event.target.style.border = '5px solid #007bff';
        selectedAnswerBox = event.target;
        
        checkMatch();
    }

    function checkMatch() {
        if (selectedColorBox && selectedAnswerBox) {
            const colorId = selectedColorBox.id;
            const answerId = selectedAnswerBox.id;
            
            if (colorMapping[colorId] === answerId) {
                // match
                matchedPairs.add(colorId);
                matchedPairs.add(answerId);

                selectedColorBox.classList.add('hidden');
                selectedAnswerBox.classList.add('hidden');
                
                showMessage('Correct match!', 'success');

                if (matchedPairs.size === Object.keys(colorMapping).length * 2) {
                    showMessage('Congratulations! You\'ve matched all colors!', 'success');
                }
            } else {
                // not match
                showMessage('Try again!', 'error');
            }
            
            // Reset selections
            selectedColorBox.style.border = '';
            selectedAnswerBox.style.border = '';
            selectedColorBox = null;
            selectedAnswerBox = null;
        }
    }

    function showMessage(text, type) {
        let messageEl = document.getElementById('game-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'game-message';
            messageEl.style.position = 'fixed';
            messageEl.style.top = '20px';
            messageEl.style.left = '50%';
            messageEl.style.transform = 'translateX(-50%)';
            messageEl.style.padding = '10px 20px';
            messageEl.style.borderRadius = '5px';
            messageEl.style.zIndex = '1000';
            document.body.appendChild(messageEl);
        }

        messageEl.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        messageEl.style.color = 'white';
        messageEl.textContent = text;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 2000);
    }
    
    colorBoxes.forEach(box => {
        box.addEventListener('click', handleColorBoxClick);
    });

    answerBoxes.forEach(box => {
        box.addEventListener('click', handleAnswerBoxClick);
    });
});