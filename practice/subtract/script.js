// Configuration
const CONFIG = {
    TOTAL_EQUATIONS: 20,
    MAX_NUMBER: 20,
    MIN_RESULT: 0,
    MIN_NUMBER_FOR_CHALLENGING: 3,
    MIN_NUM1_FOR_CHALLENGING: 10,
    CHALLENGING_PERCENTAGE: 0.9
};

/**
 * Checks if an equation is considered challenging
 * @param {number} num1 - Number to subtract from
 * @param {number} num2 - Number to subtract
 * @param {number} result - Result of the subtraction
 * @returns {boolean} True if equation is challenging
 */
function isChallengingEquation(num1, num2, result) {
    return num1 >= CONFIG.MIN_NUM1_FOR_CHALLENGING && 
           num2 >= CONFIG.MIN_NUMBER_FOR_CHALLENGING && 
           result >= CONFIG.MIN_NUMBER_FOR_CHALLENGING;
}

/**
 * Generates a set of unique subtraction equations
 * @returns {Array<{num1: number, num2: number, result: number}>} Array of equation objects
 */
function generateEquations() {
    const equations = [];
    const used = new Set();
    
    const targetChallenging = Math.floor(CONFIG.TOTAL_EQUATIONS * CONFIG.CHALLENGING_PERCENTAGE);
    const targetSimple = CONFIG.TOTAL_EQUATIONS - targetChallenging;
    
    let countChallenging = 0;
    let countSimple = 0;
    let attempts = 0;
    const maxAttempts = 10000;
    
    while (equations.length < CONFIG.TOTAL_EQUATIONS && attempts < maxAttempts) {
        attempts++;
        
        // Generate num1 (number to subtract from)
        const num1 = Math.floor(Math.random() * CONFIG.MAX_NUMBER) + 1;
        // Generate num2 (number to subtract), ensuring result >= MIN_RESULT
        const maxNum2 = num1 - CONFIG.MIN_RESULT;
        const num2 = Math.floor(Math.random() * maxNum2) + 1;
        const result = num1 - num2;
        
        // Ensure result is not negative
        if (result < CONFIG.MIN_RESULT) continue;
        
        const isChallenging = isChallengingEquation(num1, num2, result);
        
        // Control distribution based on target percentages
        if (isChallenging && countChallenging >= targetChallenging) continue;
        if (!isChallenging && countSimple >= targetSimple) continue;
        
        // Create unique key to avoid duplicates
        const key = `${num1}-${num2}`;
        
        if (!used.has(key) && !MathUtils.isTooSimilar(num1, num2, equations, false)) {
            equations.push({ num1, num2, result });
            used.add(key);
            
            if (isChallenging) {
                countChallenging++;
            } else {
                countSimple++;
            }
        }
    }
    
    return MathUtils.shuffleArray(equations);
}

/**
 * Displays equations in a two-column layout
 */
function displaySubtractionEquations() {
    const equations = generateEquations();
    MathUtils.displayEquations('equationsContainer', equations, CONFIG.TOTAL_EQUATIONS, '−');
}

// Generate equations on page load
document.addEventListener('DOMContentLoaded', displaySubtractionEquations);
