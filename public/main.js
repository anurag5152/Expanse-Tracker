document.addEventListener('DOMContentLoaded', function() {
    // SignOut Button Handler
    document.getElementById('signOutButton').addEventListener('click', function(event) {
        event.preventDefault();
        signOut();
    });

    // Expense Form Submission
    document.getElementById('expenseForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addExpense();
    });

    // Initialize expenses based on user
    initializeExpenses();
});

let expenses = [];
let chart;

// Function to get current user
function getCurrentUser() {
    const userFromLocalStorage = localStorage.getItem('currentUser');
    const userFromSessionStorage = sessionStorage.getItem('currentUser');
    return userFromLocalStorage || userFromSessionStorage;
}

// Function to initialize expenses
function initializeExpenses() {
    const currentUser = getCurrentUser();
    if (currentUser === 'guest') {
        expenses = JSON.parse(sessionStorage.getItem('expenses_guest')) || [];
    } else if (currentUser) {
        expenses = JSON.parse(localStorage.getItem(`expenses_${currentUser}`)) || [];
    } else {
        // If no user is logged in, treat as guest
        expenses = [];
    }
    displayExpenses();
    updateSummary();
    renderChart();
}

// Function to add expense
function addExpense() {
    const currentUser = getCurrentUser();
    const amount = document.getElementById('amount').value;

    // Validate that amount is a positive number (allow decimals)
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

// Function to delete expense
function deleteExpense(index) {
    const currentUser = getCurrentUser();
    expenses.splice(index, 1);
    saveExpenses(currentUser);
    displayExpenses();
    updateSummary();
    renderChart();
}

// Function to display expenses in the table
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

// Function to update summary
function updateSummary() {
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    document.getElementById('summary').innerHTML = `Total Expenses: ₹${total.toFixed(2)}`;
}

// Function to render chart
function renderChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const categories = ['Food', 'Transport', 'Entertainment', 'Utilities'];
    const categoryTotals = categories.map(category => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    });

    // Destroy previous chart instance if it exists
    if (chart) {
        chart.destroy();
    }

    if (expenses.length === 0) {
        // If no expenses, clear the chart
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

// Function to save expenses based on user
function saveExpenses(currentUser) {
    if (currentUser === 'guest') {
        sessionStorage.setItem('expenses_guest', JSON.stringify(expenses));
    } else if (currentUser) {
        localStorage.setItem(`expenses_${currentUser}`, JSON.stringify(expenses));
    }
}

// Function to handle SignOut
function signOut() {
    const currentUser = getCurrentUser();
    if (currentUser === 'guest') {
        // Clear guest expenses from sessionStorage
        sessionStorage.removeItem('expenses_guest');
        sessionStorage.removeItem('currentUser');
    } else if (currentUser) {
        // For authenticated users, just remove currentUser from localStorage
        localStorage.removeItem('currentUser');
    }
    // Optionally, clear all expenses from the current page
    expenses = [];
    displayExpenses();
    updateSummary();
    renderChart();
    // Redirect to index.html
    window.location.href = 'index.html';
}

// Function to sanitize user input to prevent XSS
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
