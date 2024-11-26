const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static('public'));

let users = [];
try {
    const data = fs.readFileSync('users.json');
    users = JSON.parse(data);
} catch (err) {
    users = [];
}

const saveUsers = () => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    users.push({ username, password });
    saveUsers();
    res.status(201).json({ message: 'User created' });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
