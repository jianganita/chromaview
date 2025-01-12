// logic.js
class ColorGame {
    constructor() {
        this.scores = {
            page1: null,
            page2: null,
            page3: null
        };
        this.answers = [];
        this.colorMode = 'normal'; // normal, tritanopia, deuteranopia, protanopia
        this.initializeLocalStorage();
    }

    initializeLocalStorage() {
        if (!localStorage.getItem('colorGameState')) {
            localStorage.setItem('colorGameState', JSON.stringify({
                scores: this.scores,
                answers: this.answers,
                colorMode: this.colorMode
            }));
        } else {
            const state = JSON.parse(localStorage.getItem('colorGameState'));
            this.colorMode = state.colorMode || 'normal';
        }
    }

    setColorMode(mode) {
        this.colorMode = mode;
        localStorage.setItem('colorGameState', JSON.stringify({
            scores: this.scores,
            answers: this.answers,
            colorMode: this.colorMode
        }));
    }

    saveState() {
        localStorage.setItem('colorGameState', JSON.stringify({
            scores: this.scores,
            answers: this.answers,
            colorMode: this.colorMode
        }));
    }

    loadState() {
        const state = JSON.parse(localStorage.getItem('colorGameState'));
        this.scores = state.scores;
        this.answers = state.answers;
        this.colorMode = state.colorMode || 'normal';
    }

    // Page 1
    checkPage1Answer(selectedColor, targetColor) {
        const isCorrect = this.compareColors(selectedColor, targetColor);
        this.scores.page1 = isCorrect ? 1 : 0;
        this.answers.push({
            page: 1,
            selected: selectedColor,
            target: targetColor,
            correct: isCorrect,
            mode: this.colorMode
        });
        this.saveState();
        return isCorrect;
    }

    // Page 2
    checkPage2Answer(selectedColors, targetColors) {
        let rightCount = 0;
        const results = selectedColors.map((selected, index) => {
            const isCorrect = this.compareColors(selected, targetColors[index]);
            if (isCorrect) rightCount++;
            return isCorrect;
        });
        
        this.scores.page2 = rightCount / targetColors.length;
        this.answers.push({
            page: 2,
            selected: selectedColors,
            target: targetColors,
            correct: results,
            mode: this.colorMode
        });
        this.saveState();
        return results;
    }

    // Page 3
    checkPage3Answer(selectedHue, targetHue) {
        // Allow for some margin of error (+/- 5 degrees)
        const tolerance = 5;
        const difference = Math.abs(selectedHue - targetHue);
        const isCorrect = difference <= tolerance;
        
        this.scores.page3 = isCorrect ? 1 : Math.max(0, 1 - (difference / 180));
        this.answers.push({
            page: 3,
            selected: selectedHue,
            target: targetHue,
            difference: difference,
            mode: this.colorMode
        });
        this.saveState();
        return isCorrect;
    }

    compareColors(color1, color2) {
        const rgb1 = this.parseColor(color1);
        const rgb2 = this.parseColor(color2);
        
        // Different tolerances for different color blindness modes
        let tolerance = 15;
        if (this.colorMode !== 'normal') {
            tolerance = 25; // More forgiving for color blindness modes
        }

        return Math.abs(rgb1.r - rgb2.r) <= tolerance &&
               Math.abs(rgb1.g - rgb2.g) <= tolerance &&
               Math.abs(rgb1.b - rgb2.b) <= tolerance;
    }

    parseColor(color) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        return {
            r: parseInt(ctx.fillStyle.slice(1, 3), 16),
            g: parseInt(ctx.fillStyle.slice(3, 5), 16),
            b: parseInt(ctx.fillStyle.slice(5, 7), 16)
        };
    }

    analyzeColorBlindness() {
        const results = {
            totalScore: 0,
            possibleConditions: [],
            details: [],
            confidence: 'low'
        };

        // Calculate total score
        let totalTests = 0;
        let totalCorrect = 0;

        Object.values(this.scores).forEach(score => {
            if (score !== null) {
                totalTests++;
                totalCorrect += score;
            }
        });

        results.totalScore = (totalCorrect / totalTests) * 100;

        // analyze answers
        const redGreenErrors = this.answers.filter(answer => {
            if (answer.page === 1 || answer.page === 2) {
                const selected = this.parseColor(answer.selected);
                const target = this.parseColor(answer.target);
                return Math.abs(selected.r - target.r) > 30 || 
                       Math.abs(selected.g - target.g) > 30;
            }
            return false;
        }).length;

        const blueYellowErrors = this.answers.filter(answer => {
            if (answer.page === 1 || answer.page === 2) {
                const selected = this.parseColor(answer.selected);
                const target = this.parseColor(answer.target);
                return Math.abs(selected.b - target.b) > 30;
            }
            return false;
        }).length;

        // Accurate diagnoses
        if (redGreenErrors > blueYellowErrors && redGreenErrors > 1) {
            results.possibleConditions.push('Possible Red-Green Color Vision Deficiency');
            if (this.colorMode === 'protanopia' || this.colorMode === 'deuteranopia') {
                results.details.push('Your results align with your selected color blindness mode.');
                results.confidence = 'high';
            }
        }

        if (blueYellowErrors > 1) {
            results.possibleConditions.push('Possible Blue-Yellow Color Vision Deficiency');
            if (this.colorMode === 'tritanopia') {
                results.details.push('Your results align with your selected color blindness mode.');
                results.confidence = 'high';
            }
        }

        // Add feedback
        if (results.totalScore > 90) {
            results.details.push('Your color matching ability appears to be excellent!');
        } else if (results.totalScore > 70) {
            results.details.push('Your color matching ability is good, but there might be room for improvement.');
        } else {
            results.details.push('You might benefit from using color blindness assistance tools.');
        }

        // Add mode-specific feedback
        if (this.colorMode !== 'normal') {
            results.details.push(`Test completed in ${this.colorMode} simulation mode.`);
        }

        return results;
    }

    reset() {
        this.scores = {
            page1: null,
            page2: null,
            page3: null
        };
        this.answers = [];
        this.saveState();
    }
}

export default ColorGame;