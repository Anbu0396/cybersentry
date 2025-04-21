const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "buwx0payxlnpmswrj3bs-mysql.services.clever-cloud.com",
    user: "ubl6ziutxc6iobhw",
    password: "qoW87AbeiEpGmyPlOzRs",
    database: "buwx0payxlnpmswrj3bs",
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    }
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err.stack);
        return;
    }
    console.log("✅ Connected to Clever Cloud MySQL database!");
    createTablesIfNotExist();
    insertSampleUser(); // <== Added this line to insert the user after connection
});

function createTablesIfNotExist() {
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            username VARCHAR(100) UNIQUE,
            gender VARCHAR(10),
            email VARCHAR(100) UNIQUE,
            phone VARCHAR(15),
            dob DATE,
            password TEXT
        );
    `;

    const createPasswordsTable = `
        CREATE TABLE IF NOT EXISTS passwords (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            website VARCHAR(255),
            username VARCHAR(255),
            password TEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
        );
    `;

    db.query(createUsersTable, (err) => {
        if (err) console.error("❌ Error creating 'users' table:", err);
        else console.log("✅ 'users' table ready");
    });

    db.query(createPasswordsTable, (err) => {
        if (err) console.error("❌ Error creating 'passwords' table:", err);
        else console.log("✅ 'passwords' table ready");
    });
}

function insertSampleUser() {
    const sql = `
        INSERT INTO users (name, username, gender, email, phone, dob, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        "Anbu Selvan",
        "Anbu",
        "male",
        "anbuselvan0396@gmail.com",
        "8778908158",
        "2004-12-27", // ✅ Correct date format
        "Mark@396"
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("❌ Failed to insert user:", err);
        } else {
            console.log("✅ User inserted successfully! ID:", result.insertId);
        }
        db.end(); // Optional: close the DB connection
    });
}
