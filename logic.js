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
            this.scores = state.scores || this.scores;
            this.answers = state.answers || this.answers;
            this.colorMode = state.colorMode || 'normal';
        }
    }

    setColorMode(mode) {
        this.colorMode = mode;
        this.saveState();
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
        if (state) {
            this.scores = state.scores || this.scores;
            this.answers = state.answers || this.answers;
            this.colorMode = state.colorMode || 'normal';
        }
    }

    // Page 1
    checkPage1Answer(selectedColor, targetColor, colorName) {
        const isCorrect = this.compareColors(selectedColor, targetColor);
        this.scores.page1 = isCorrect ? 1 : 0;
        this.answers.push({
            page: 1,
            selected: selectedColor,
            target: targetColor,
            colorName: colorName,
            correct: isCorrect,
            mode: this.colorMode
        });
        this.saveState();
        return isCorrect;
    }

    // Page 2
    checkPage2Answer(selectedColors, targetColors) {
        const results = selectedColors.map((selected, index) => ({
            selected,
            target: targetColors[index],
            colorName: colorNames[index],
            isCorrect: this.compareColors(selected, targetColors[index])
        }));
        
        const correctCount = results.filter(r => r.isCorrect).length;
        this.scores.page2 = correctCount / targetColors.length;
        
        this.answers.push({
            page: 2,
            matches: results,
            mode: this.colorMode
        });
        this.saveState();
        return results;
    }

    // Page 3
    checkPage3Answer(selectedHue, targetHue) {
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
        if (typeof color === 'string') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            return {
                r: parseInt(ctx.fillStyle.slice(1, 3), 16),
                g: parseInt(ctx.fillStyle.slice(3, 5), 16),
                b: parseInt(ctx.fillStyle.slice(5, 7), 16)
            };
        }
        return color;
    }

    analyzeColorBlindness() {
        const results = {
            totalScore: 0,
            wrongAnswers: [],
            conditions: [],
            details: {}
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

        // Collect wrong answers
        this.answers.forEach(answer => {
            if (answer.page === 1 || answer.page === 2) {
                if (answer.page === 1 && !answer.correct) {
                    results.wrongAnswers.push({
                        page: 1,
                        colorName: answer.colorName,
                        selected: answer.selected,
                        target: answer.target
                    });
                } else if (answer.page === 2) {
                    answer.matches.forEach(match => {
                        if (!match.isCorrect) {
                            results.wrongAnswers.push({
                                page: 2,
                                colorName: match.colorName,
                                selected: match.selected,
                                target: match.target
                            });
                        }
                    });
                }
            }
        });

        const redGreenErrors = results.wrongAnswers.filter(answer => 
            this.isRedGreenError(answer.selected, answer.target)
        ).length;

        const blueYellowErrors = results.wrongAnswers.filter(answer => 
            this.isBlueYellowError(answer.selected, answer.target)
        ).length;

        results.details = {
            tritanopia: {
                name: "Tritanopia",
                description: "A rare type of color blindness that affects the ability to distinguish between blue and green, purple and red, and yellow and pink colors.",
                detected: blueYellowErrors > 1
            },
            deuteranopia: {
                name: "Deuteranopia",
                description: "A common type of red-green color blindness where the green cone photopigments are absent, making it difficult to distinguish between reds and greens.",
                detected: redGreenErrors > 1 && this.hasGreenWeakness(results.wrongAnswers)
            },
            protanopia: {
                name: "Protanopia",
                description: "A type of red-green color blindness where the red cone photopigments are absent, making reds appear darker and reducing the brightness of red, orange, and yellow colors.",
                detected: redGreenErrors > 1 && this.hasRedWeakness(results.wrongAnswers)
            }
        };

        return results;
    }

    isRedGreenError(selected, target) {
        const s = this.parseColor(selected);
        const t = this.parseColor(target);
        return Math.abs(s.r - t.r) > 30 || Math.abs(s.g - t.g) > 30;
    }

    isBlueYellowError(selected, target) {
        const s = this.parseColor(selected);
        const t = this.parseColor(target);
        return Math.abs(s.b - t.b) > 30;
    }

    hasGreenWeakness(wrongAnswers) {
        return wrongAnswers.some(answer => {
            const t = this.parseColor(answer.target);
            const s = this.parseColor(answer.selected);
            return t.g > t.r && t.g > t.b && s.g < s.r;
        });
    }

    hasRedWeakness(wrongAnswers) {
        return wrongAnswers.some(answer => {
            const t = this.parseColor(answer.target);
            const s = this.parseColor(answer.selected);
            return t.r > t.g && t.r > t.b && s.r < s.g;
        });
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