
// script.js

// References to all the boxes in both containers
const colorBoxes = document.querySelectorAll('.colour-container .box');
const answerBoxes = document.querySelectorAll('.answer-container .ans');

let selectedColorBox = null; // Track the selected color box
let selectedAnswerBox = null; // Track the selected answer box

/**
 * Extracts the last number from an element's ID.
 @param {string} id - The element's ID.
 @returns {string} - The last number in the ID.
 */
function getLastNumber(id) {
  return id.match(/\d+$/)?.[0]; // Match and return the last number
}

/**
 * Checks if the last number of the selected IDs matches.
 */
function checkMatch() {
  if (selectedColorBox && selectedAnswerBox) {
    const colorBoxNumber = getLastNumber(selectedColorBox.id);
    const answerBoxNumber = getLastNumber(selectedAnswerBox.id);

    if (colorBoxNumber === answerBoxNumber) {
      alert('Matched!');
      selectedColorBox.classList.add('hidden'); // Hide matched color box
      selectedAnswerBox.classList.add('hidden'); // Hide matched answer box
    } else {
      alert('No match. Try again!');
    }

    resetSelection(); // Reset selections
  }
}

/**
 * Resets the selected boxes.
 */
function resetSelection() {
  selectedColorBox = null;
  selectedAnswerBox = null;
}

/**
 * Handles clicking on a color box.
 * @param {Event} event - The click event.
 */
function handleColorBoxClick(event) {
  selectedColorBox = event.target; // Set the selected color box
  checkMatch(); // Check if there's a match
}

/**
 * Handles clicking on an answer box.
 * @param {Event} event - The click event.
 */
function handleAnswerBoxClick(event) {
  selectedAnswerBox = event.target; // Set the selected answer box
  checkMatch(); // Check if there's a match
}

// Add event listeners to color and answer boxes
colorBoxes.forEach(box => box.addEventListener('click', handleColorBoxClick));
answerBoxes.forEach(box => box.addEventListener('click', handleAnswerBoxClick));



/*
const colorBoxes = document.querySelectorAll('.colour-container .box');
const answerBoxes = document.querySelectorAll('.answer-container .ans');
console.log(colorBoxes);
console.log(answerBoxes);
let selectedColorBox = null; // Track the selected color box
let selectedAnswerBox = null; // Track the selected answer box

colorBoxes.forEach(box => box.addEventListener('click', handleColorBoxClick));
answerBoxes.forEach(box => box.addEventListener('click', handleAnswerBoxClick));
*/
