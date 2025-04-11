const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const path = require("path");

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mark@396",
    database: "password_manager"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("MySQL Connected");
    }
});

app.use(express.static(path.join(__dirname, "Resources")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true
}));

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        return res.redirect("/signin");
    }
}

function xorEncryptDecrypt(input, key) {
    let output = '';
    const  n= key.length;

    for (let i = 0; i < input.length; i++) {
        const encryptedChar = input.charCodeAt(i) ^ key.charCodeAt(i % n);
        output += String.fromCharCode(encryptedChar);
    }

    return output;
}

function encrypt(pass, key) {
    const encrypted = xorEncryptDecrypt(pass, key);
    return Buffer.from(encrypted, 'utf-8').toString('base64');
}

function decrypt(pass, key) {
    const decoded = Buffer.from(pass, 'base64').toString('utf-8');
    return xorEncryptDecrypt(decoded, key);
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "index.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "signup.html"));
});

app.post("/signup", async (req, res) => {
    const { name, user, gender, email, phone, dob, pass } = req.body;

    const checkUser = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(checkUser, [user, email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.json({ success: false, message: "Database error. Please try again." });
        }
        if (results.length > 0) {
            return res.json({ success: false, message: "Username or Email already exists." });
        }

        const sql = "INSERT INTO users (name, username, gender, email, phone, dob, password) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [name, user, gender, email, phone, dob, pass], (err, result) => {
            if (err) {
                console.error("Error inserting user:", err);
                return res.json({ success: false, message: "Error creating account." });
            }

            res.json({ success: true, message: "Signup successful!", redirect: "/signin" });
        });
    });
});

app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "signin.html"));
});

app.post("/signin", (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(sql, [username, username], (err, results) => {
        if (err) {
            console.error("Error checking credentials:", err);
            return res.json({ success: false, message: "Database error. Try again." });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const user = results[0];
        if (password === user.password) {
            req.session.user = user;
            res.json({ success: true, message: "Login successful!", redirect: "/" });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    });
});

app.get("/functions", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "html", "functions.html"));
});

app.get("/user", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, username: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get("/generator", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "html", "generator.html"));
});

app.get("/checker", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "html", "checker.html"));
});

app.get("/mypass", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "html", "mypass.html"));
});

app.get("/new", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "html", "new.html"));
});

app.get("/view", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "html", "view.html"));
});

app.get("/edit", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "html", "edit.html"));
});

app.get("/delete", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "html", "delete.html"));
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

app.post("/new", isAuthenticated, (req, res) => {
    const { website, user, password } = req.body;
    const user_id = req.session.user?.user_id;
    const userPassword = req.session.user?.password;

    console.log("Received from form:", req.body);
    console.log("Session user_id:", user_id);

    if (!user_id || !website || !password || !userPassword) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const encryptedPassword = encrypt(password, userPassword);

    const insertSQL = `
        INSERT INTO passwords (user_id, website, username, password)
        VALUES (?, ?, ?, ?)
    `;

    db.query(insertSQL, [user_id, website, user, encryptedPassword], (err, result) => {
        if (err) {
            console.error("Error inserting password:", err);
            return res.status(500).json({ success: false, message: "Failed to save password." });
        }

        res.json({ success: true, message: "Password saved successfully!", redirect: "/mypass" });
    });
});

app.post("/view", isAuthenticated, (req, res) => {
    const { website } = req.body;
    const user_id = req.session.user.user_id;
    const userPassword = req.session.user.password;

    if (!website) {
        return res.status(400).send("Website name is required.");
    }

    const sql = "SELECT website, username, password FROM passwords WHERE user_id = ? AND website = ?";
    db.query(sql, [user_id, website], (err, results) => {
        if (err) {
            console.error("Error fetching password:", err);
            return res.status(500).send("Server error");
        }

        if (results.length === 0) {
            return res.send(`
                <h2>No entry found for <i>${website}</i>.</h2>
                <a href="/view">Try Again</a>
            `);
        }

        const { username, password } = results[0];
        const decryptedPassword = decrypt(password, userPassword);

        res.send(`
            <h2>Stored Credentials:</h2>
            <p><strong>Website:</strong> ${website}</p>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Password:</strong> ${decryptedPassword}</p>
            <br><a href="/view">View Another</a>
        `);
    });
});

app.post("/edit", isAuthenticated, (req, res) => {
    const { website, password } = req.body;
    const user_id = req.session.user.user_id;
    const userPassword = req.session.user.password;

    const encryptedPassword = encrypt(password, userPassword);

    const updateSQL = `
        UPDATE passwords 
        SET password = ? 
        WHERE website = ? AND user_id = ?
    `;

    db.query(updateSQL, [encryptedPassword, website, user_id], (err, result) => {
        if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({ success: false, message: "Failed to update password." });
        }

        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "No matching record found to update." });
        }

        res.json({ success: true, message: "Password updated successfully!" });
    });
});

app.post("/delete", isAuthenticated, (req, res) => {
    const { website } = req.body;
    const user_id = req.session.user.user_id;

    const deleteSQL = "DELETE FROM passwords WHERE user_id = ? AND website = ?";
    db.query(deleteSQL, [user_id, website], (err, result) => {
        if (err) {
            console.error("Error deleting password:", err);
            return res.status(500).json({ success: false, message: "Failed to delete password." });
        }

        if (result.affectedRows === 0) {
            return res.json({ success: false, message: "No password found for the given website." });
        }

        res.json({ success: true, message: "Password deleted successfully!" });
    });
});

app.listen(2025, () => {
    console.log("SERVER RUNNING on http://localhost:2025");
});
