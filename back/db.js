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

const createProductsTable = (_) => {
  const sql = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            photo VARCHAR(255) NULL,
            price DECIMAL(10, 2) NOT NULL,
            rating TINYINT UNSIGNED DEFAULT 0 CHECK (rating BETWEEN 1 AND 5),
            featured BOOLEAN NOT NULL DEFAULT false,
            approved BOOLEAN NOT NULL DEFAULT false,
            info TEXT NOT NULL,
            in_stock INT UNSIGNED DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            discount BOOLEAN DEFAULT FALSE
        )`;

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Products table created");
  });
};

const dropProductsTable = () => {
  const sql = "DROP TABLE IF EXISTS products";

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Products table dropped");
  });
};

const seedProductsTable = () => {
  const sql = `
        INSERT INTO products
        (title, photo, price, rating, featured, approved, info, in_stock, discount)
        VALUES
        ('Dragon Warrior', null, 19.99, 5, TRUE, TRUE, 'A fierce dragon warrior miniature perfect for epic battles.', 50, FALSE),
        ('Elven Archer', null, 14.99, 4, FALSE, TRUE, 'An elegant elven archer, skilled in long-range attacks.', 100, TRUE),
        ('Dwarven King', null, 24.99, 5, TRUE, TRUE, 'A mighty dwarven king, ruler of the underground kingdoms.', 30, FALSE),
        ('Orc Brute', null, 9.99, 3, FALSE, TRUE, 'A savage orc brute, perfect for bolstering your horde.', 75, TRUE),
        ('Goblin Scout', null, 7.99, 3, FALSE, TRUE, 'A sneaky goblin scout, ideal for ambushes and surprise attacks.', 200, FALSE)
    `;

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Products table seeded");
  });
};

dropUsersTable();
dropProductsTable();

createUsersTable();
createProductsTable();

seedUsersTable();
seedProductsTable();

connection.end(function (err) {
  if (err) throw err;
  console.log("Connection closed");
});
