document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signOutButton').addEventListener('click', function(event) {
        event.preventDefault();
        signOut();
    });

    document.getElementById('expenseForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addExpense();
    });

    initializeExpenses();
});

let expenses = [];
let chart;

function getCurrentUser() {
    const userFromLocalStorage = localStorage.getItem('currentUser');
    const userFromSessionStorage = sessionStorage.getItem('currentUser');
    return userFromLocalStorage || userFromSessionStorage;
}

function initializeExpenses() {
    const currentUser = getCurrentUser();
    if (currentUser === 'guest') {
        expenses = JSON.parse(sessionStorage.getItem('expenses_guest')) || [];
    } else if (currentUser) {
        expenses = JSON.parse(localStorage.getItem(`expenses_${currentUser}`)) || [];
    } else {
        expenses = [];
    }
    displayExpenses();
    updateSummary();
    renderChart();
}

function addExpense() {
    const currentUser = getCurrentUser();
    const amount = document.getElementById('amount').value;

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
        alert("Invalid Amount, Please enter a valid Amount");
        return;
    }

    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const expense = { amount: amountValue, category, date, description };
    expenses.push(expense);
    saveExpenses(currentUser);

    document.getElementById('expenseForm').reset();
    displayExpenses();
    updateSummary();
    renderChart();
}

function deleteExpense(index) {
    const currentUser = getCurrentUser();
    expenses.splice(index, 1);
    saveExpenses(currentUser);
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
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${sanitizeInput(expense.description)}</td>
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

    if (chart) {
        chart.destroy();
    }

    if (expenses.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
    }

    chart = new Chart(ctx, {
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

function saveExpenses(currentUser) {
    if (currentUser === 'guest') {
        sessionStorage.setItem('expenses_guest', JSON.stringify(expenses));
    } else if (currentUser) {
        localStorage.setItem(`expenses_${currentUser}`, JSON.stringify(expenses));
    }
}

function signOut() {
    const currentUser = getCurrentUser();
    if (currentUser === 'guest') {
        sessionStorage.removeItem('expenses_guest');
        sessionStorage.removeItem('currentUser');
    } else if (currentUser) {
        localStorage.removeItem('currentUser');
    }
    expenses = [];
    displayExpenses();
    updateSummary();
    renderChart();
    window.location.href = 'index.html';
}

function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
