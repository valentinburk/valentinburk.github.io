/**
 * Shared utilities for math practice worksheets
 * Using namespace pattern to avoid global scope pollution
 */
const MathUtils = {
    /**
     * Shuffles an array in place using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} The shuffled array
     */
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    /**
     * Checks if an equation is too similar to recently generated ones
     * Prevents sequential patterns like 17-5, 17-6, 17-7 or 8+5, 8+6, 8+7
     * @param {number} num1 - First number
     * @param {number} num2 - Second number
     * @param {Array} recentEquations - Recently generated equations
     * @param {boolean} checkCommutative - Whether to check commutative patterns (for addition)
     * @returns {boolean} True if equation is too similar
     */
    isTooSimilar: function(num1, num2, recentEquations, checkCommutative = false) {
        // Check last 5 equations for patterns
        const checkCount = Math.min(5, recentEquations.length);
        for (let i = recentEquations.length - checkCount; i < recentEquations.length; i++) {
            const recent = recentEquations[i];
            
            // Avoid same num1 with sequential num2 (e.g., 17-5, 17-6, 17-7)
            if (recent.num1 === num1 && Math.abs(recent.num2 - num2) <= 2) {
                return true;
            }
            
            // Avoid sequential num1 with same num2 (e.g., 15-7, 16-7, 17-7)
            if (recent.num2 === num2 && Math.abs(recent.num1 - num1) <= 2) {
                return true;
            }
            
            // Check reverse patterns for commutative operations (addition)
            if (checkCommutative) {
                if (recent.num1 === num2 && Math.abs(recent.num2 - num1) <= 2) {
                    return true;
                }
                if (recent.num2 === num1 && Math.abs(recent.num1 - num2) <= 2) {
                    return true;
                }
            }
            
            // Avoid same result/sum appearing too close together with similar operands
            const currentResult = checkCommutative ? (num1 + num2) : (num1 - num2);
            const recentResult = checkCommutative ? recent.sum : recent.result;
            
            if (recentResult === currentResult && 
                (Math.abs(recent.num1 - num1) <= 1 || Math.abs(recent.num2 - num2) <= 1)) {
                return true;
            }
        }
        return false;
    },

    /**
     * Displays equations in a two-column layout
     * @param {string} containerId - ID of the container element
     * @param {Array} equations - Array of equation objects
     * @param {number} totalEquations - Total number of equations to display
     * @param {string} operator - The mathematical operator (+, -, ×, ÷)
     */
    displayEquations: function(containerId, equations, totalEquations, operator) {
        const container = document.getElementById(containerId);
        
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
                <span>${eq.num1} ${operator} ${eq.num2} = <span class="answer-line"></span></span>
            `;
            
            // Distribute equations evenly between columns
            if (index < totalEquations / 2) {
                column1.appendChild(div);
            } else {
                column2.appendChild(div);
            }
        });
        
        container.appendChild(column1);
        container.appendChild(column2);
    }
};
