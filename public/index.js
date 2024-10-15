document.getElementById('showSignup').addEventListener('click', function() {
    document.getElementById('signup').style.display = 'block';
    document.getElementById('login').style.display = 'none';
});

document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('signup').style.display = 'none';
});

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
        localStorage.setItem('currentUser', newUsername);
        window.location.href = 'main.html';
    } else {
        const result = await response.json();
        alert(result.message);
    }
});

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
        localStorage.setItem('currentUser', username);
        window.location.href = 'main.html';
    } else {
        const result = await response.json();
        alert(result.message);
    }
});

document.getElementById('guestLoginSignup').addEventListener('click', function() {
    sessionStorage.setItem('currentUser', 'guest');
    window.location.href = 'main.html';
});

document.getElementById('guestLoginLogin').addEventListener('click', function() {
    sessionStorage.setItem('currentUser', 'guest');
    window.location.href = 'main.html';
});
