// Show signup form and hide login form
document.getElementById('showSignup').addEventListener('click', function() {
    document.getElementById('signup').style.display = 'block';
    document.getElementById('login').style.display = 'none';
});

// Show login form and hide signup form
document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('signup').style.display = 'none';
});

// Toggle password visibility in signup form
document.getElementById('toggleSignupPassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('newPassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        document.getElementById('toggleSignupPassword').innerHTML = '&#128064;';
    } else {
        passwordInput.type = 'password';
        document.getElementById('toggleSignupPassword').innerHTML = '&#128065;';
    }
});

// Toggle password visibility in login form
document.getElementById('toggleLoginPassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        document.getElementById('toggleLoginPassword').innerHTML = '&#128064;';
    } else {
        passwordInput.type = 'password';
        document.getElementById('toggleLoginPassword').innerHTML = '&#128065;';
    }
});

// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
    });

    if (response.ok) {
        alert('Signup successful!');
        window.location.href = 'main.html';
    } else {
        const result = await response.json();
        alert(result.message);
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        alert('Login successful!');
        window.location.href = 'main.html';
    } else {
        const result = await response.json();
        alert(result.message);
    }
});

// Guest login action for signup form
document.getElementById('guestLoginSignup').addEventListener('click', function() {
    // Redirect to the main page
    window.location.href = 'main.html';
});

// Guest login action for login form
document.getElementById('guestLoginLogin').addEventListener('click', function() {
    // Redirect to the main page
    window.location.href = 'main.html';
});
