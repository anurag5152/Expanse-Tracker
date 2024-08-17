document.getElementById('expenseForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addExpense();
});

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function addExpense() {
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const expense = { amount, category, date, description };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    document.getElementById('expenseForm').reset();
    displayExpenses();
    updateSummary();
    renderChart();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateSummary();
    renderChart();
}

function displayExpenses() {
    const expensesTableBody = document.querySelector('#expensesTable tbody');
    expensesTableBody.innerHTML = '';
    expenses.forEach((expense, index) => {
        const expenseRow = document.createElement('tr');
        expenseRow.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.description}</td>
            <td><button onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expensesTableBody.appendChild(expenseRow);
    });
}

function updateSummary() {
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    document.getElementById('summary').innerHTML = `Total Expenses: ₹${total.toFixed(2)}`;
}

function renderChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];
    const categoryTotals = categories.map(category => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: categoryTotals,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            }
        }
    });
}

displayExpenses();
updateSummary();
renderChart();
