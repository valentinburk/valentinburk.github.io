function generateEquations() {
    const equations = [];
    const used = new Set();
    
    // Generate 16 equations with sum > 10 (80% of 20)
    let countOver10 = 0;
    let countUnder10 = 0;
    
    while (equations.length < 20) {
        let num1 = Math.floor(Math.random() * 20) + 1;
        let num2 = Math.floor(Math.random() * 20) + 1;
        let sum = num1 + num2;
        
        // Ensure sum <= 20
        if (sum > 20) continue;
        
        // Control distribution: 80% should be > 10
        if (sum > 10 && countOver10 >= 16) continue;
        if (sum <= 10 && countUnder10 >= 4) continue;
        
        // Create unique key to avoid duplicates
        const key = `${num1}+${num2}`;
        const reverseKey = `${num2}+${num1}`;
        
        if (!used.has(key) && !used.has(reverseKey)) {
            equations.push({ num1, num2, sum });
            used.add(key);
            
            if (sum > 10) countOver10++;
            else countUnder10++;
        }
    }
    
    // Shuffle equations
    for (let i = equations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [equations[i], equations[j]] = [equations[j], equations[i]];
    }
    
    return equations;
}

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
        
        if (index < 10) {
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