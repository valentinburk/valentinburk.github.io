// Configuration
const CONFIG = {
    TOTAL_EQUATIONS: 20,
    MAX_NUMBER: 20,
    MAX_SUM: 20,
    MIN_NUMBER_FOR_CHALLENGING: 3,
    MIN_SUM_FOR_CHALLENGING: 10,
    CHALLENGING_PERCENTAGE: 0.9
};

/**
 * Checks if an equation is considered challenging
 * @param {number} num1 - First number
 * @param {number} num2 - Second number
 * @param {number} sum - Sum of the two numbers
 * @returns {boolean} True if equation is challenging
 */
function isChallengingEquation(num1, num2, sum) {
    return sum > CONFIG.MIN_SUM_FOR_CHALLENGING && 
           num1 >= CONFIG.MIN_NUMBER_FOR_CHALLENGING && 
           num2 >= CONFIG.MIN_NUMBER_FOR_CHALLENGING;
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} The shuffled array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generates a set of unique addition equations
 * @returns {Array<{num1: number, num2: number, sum: number}>} Array of equation objects
 */
function generateEquations() {
    const equations = [];
    const used = new Set();
    
    const targetChallenging = Math.floor(CONFIG.TOTAL_EQUATIONS * CONFIG.CHALLENGING_PERCENTAGE);
    const targetSimple = CONFIG.TOTAL_EQUATIONS - targetChallenging;
    
    let countChallenging = 0;
    let countSimple = 0;
    
    while (equations.length < CONFIG.TOTAL_EQUATIONS) {
        const num1 = Math.floor(Math.random() * CONFIG.MAX_NUMBER) + 1;
        const num2 = Math.floor(Math.random() * CONFIG.MAX_NUMBER) + 1;
        const sum = num1 + num2;
        
        // Ensure sum doesn't exceed maximum
        if (sum > CONFIG.MAX_SUM) continue;
        
        const isChallenging = isChallengingEquation(num1, num2, sum);
        
        // Control distribution based on target percentages
        if (isChallenging && countChallenging >= targetChallenging) continue;
        if (!isChallenging && countSimple >= targetSimple) continue;
        
        // Create unique key to avoid duplicates (including reversed versions)
        const key = `${num1}+${num2}`;
        const reverseKey = `${num2}+${num1}`;
        
        if (!used.has(key) && !used.has(reverseKey)) {
            equations.push({ num1, num2, sum });
            used.add(key);
            
            if (isChallenging) {
                countChallenging++;
            } else {
                countSimple++;
            }
        }
    }
    
    return shuffleArray(equations);
}

/**
 * Displays equations in a two-column layout
 */
function displayEquations() {
    const container = document.getElementById('equationsContainer');
    const equations = generateEquations();
    
    // Split into two columns
    const column1 = document.createElement('div');
    column1.className = 'column';
    const column2 = document.createElement('div');
    column2.className = 'column';
    
    equations.forEach((eq, index) => {
        const div = document.createElement('div');
        div.className = 'equation';
        div.innerHTML = `
            <span class="equation-number">${index + 1}.</span>
            <span>${eq.num1} + ${eq.num2} = <span class="answer-line"></span></span>
        `;
        
        // Distribute equations evenly between columns
        if (index < CONFIG.TOTAL_EQUATIONS / 2) {
            column1.appendChild(div);
        } else {
            column2.appendChild(div);
        }
    });
    
    container.appendChild(column1);
    container.appendChild(column2);
}

// Generate equations on page load
document.addEventListener('DOMContentLoaded', displayEquations);