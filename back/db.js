const mysql = require("mysql");
const md5 = require("md5");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "figurine",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the database");
});

// Users table

const createUsersTable = () => {
  const sql = `
        CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(40) NOT NULL,
        email VARCHAR(80) NOT NULL UNIQUE,
        role SET('admin', 'user', 'editor') NOT NULL DEFAULT 'user',
        password CHAR(32) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        session CHAR(32) NULL
    )`;

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Users table created");
  });
};

const dropUsersTable = () => {
  const sql = "DROP TABLE IF EXISTS users";

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Users table dropped");
  });
};

const seedUsersTable = () => {
  const sql = `
        INSERT INTO users
        (name, email, role, password)
        VALUES
        ('admin', 'admin@gmail.com', 'admin', '${md5("123")}'),
        ('bill', 'bill@gmail.com', 'user', '${md5("123")}'),
        ('meg', 'meg@gmail.com', 'editor', '${md5("123")}')
    `;
  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Users table seeded");
  });
};

dropUsersTable();

createUsersTable();

seedUsersTable();

connection.end(function (err) {
  if (err) throw err;
  console.log("Connection closed");
});
