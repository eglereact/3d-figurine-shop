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

const createProductsTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    photo VARCHAR(255) NULL,
    price DECIMAL(10, 2) NOT NULL,
    rating TINYINT UNSIGNED DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    featured BOOLEAN NOT NULL DEFAULT false,
    approved BOOLEAN NOT NULL DEFAULT false,
    info TEXT NOT NULL,
    in_stock INT UNSIGNED DEFAULT 0,
    discount DECIMAL(5, 2) UNSIGNED DEFAULT 0 CHECK (discount BETWEEN 0 AND 100), -- Discount as a percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Products table created");
  });
};

const createCartTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    cart JSON NOT NULL, -- Stores cart details as JSON
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status ENUM('awaiting payment', 'pending', 'processing', 'shipped', 'completed','cancelled') NOT NULL DEFAULT 'awaiting payment', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`;

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Cart table created");
  });
};

const dropProductsTable = () => {
  const sql = "DROP TABLE IF EXISTS products";

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Products table dropped");
  });
};

const dropCartTable = () => {
  const sql = "DROP TABLE IF EXISTS cart";

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Cart table dropped");
  });
};

const seedProductsTable = () => {
  const sql = `
    INSERT INTO products
    (title, photo, price, rating, featured, approved, info, in_stock, discount)
    VALUES
    ('Dragon Warrior', null, 19.99, 5, TRUE, TRUE, 'A fierce dragon warrior miniature perfect for epic battles.', 50, 0.00),
    ('Elven Archer', null, 14.99, 4, FALSE, TRUE, 'An elegant elven archer, skilled in long-range attacks.', 100, 10.00),
    ('Dwarven King', null, 24.99, 5, TRUE, TRUE, 'A mighty dwarven king, ruler of the underground kingdoms.', 30, 0.00),
    ('Orc Brute', null, 9.99, 3, FALSE, TRUE, 'A savage orc brute, perfect for bolstering your horde.', 75, 5.00),
    ('Goblin Scout', null, 7.99, 3, FALSE, TRUE, 'A sneaky goblin scout, ideal for ambushes and surprise attacks.', 200, 0.00)
`;

  connection.query(sql, function (err) {
    if (err) throw err;
    console.log("Products table seeded");
  });
};

// dropUsersTable();
// dropProductsTable();

// createUsersTable();
// createProductsTable();
dropCartTable();
createCartTable();
// seedUsersTable();
// seedProductsTable();

connection.end(function (err) {
  if (err) throw err;
  console.log("Connection closed");
});
