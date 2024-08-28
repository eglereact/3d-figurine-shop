const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const fs = require("node:fs");
const md5 = require("md5");
const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "figurine",
});

connection.connect();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const checkUserIsAuthorized = (req, res, roles) => {
  if (!req.user) {
    res
      .status(401)
      .json({
        message: {
          type: "error",
          title: "Unauthorized",
          text: `You must be logged in`,
        },
        reason: "not-logged-in",
      })
      .end();
    return false;
  }
  if (!roles.includes(req.user.role)) {
    res
      .status(401)
      .json({
        message: {
          type: "error",
          title: "Unauthorized",
          text: `You are not authorized to view this information`,
        },
        reason: "not-authorized",
      })
      .end();
    return false;
  }
  return true;
};

const checkSession = (req, _, next) => {
  const session = req.cookies["figurine-session"];
  if (!session) {
    return next();
  }
  const sql = `
        SELECT id, name, email, role 
        FROM users
        WHERE session = ?
    `;
  connection.query(sql, [session], (err, rows) => {
    if (err) throw err;
    if (!rows.length) {
      return next();
    }
    req.user = rows[0];
    next();
  });
};

app.use(checkSession);

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!/\S+@\S+\.\S+/.test(email)) {
    res
      .status(422)
      .json({
        message: "There are mistakes in form",
        errorsBag: {
          email: "Email is not correct",
        },
      })
      .end();
    return;
  }

  const sql = `SELECT email FROM users WHERE email = ? `;

  connection.query(sql, [email], (err, rows) => {
    if (err) throw err;
    if (rows.length) {
      res
        .status(422)
        .json({
          message: "There are mistakes in form",
          errorsBag: {
            email: "Email already exist",
          },
        })
        .end();
    } else {
      const sql = `
            INSERT INTO users (name, email, password)
            VALUES ( ?, ?, ? )
            `;
      connection.query(sql, [name, email, md5(password)], (err) => {
        if (err) throw err;
        res
          .status(201)
          .json({
            message: {
              type: "success",
              title: `Hello! ${name}`,
              text: `Account successfully created. Welcome `,
            },
          })
          .end();
      });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const session = md5(uuidv4());

  const sql = `
            UPDATE users
            SET session = ?
            WHERE email = ? AND password = ?
        `;

  connection.query(sql, [session, email, md5(password)], (err, result) => {
    if (err) throw err;
    const logged = result.affectedRows;
    if (!logged) {
      res
        .status(401)
        .json({
          message: {
            type: "error",
            title: "Bad connection",
            text: `Wrong credentials`,
          },
        })
        .end();
      return;
    }
    const sql = `
            SELECT id, name, email, role
            FROM users
            WHERE email = ? AND password = ?
        `;
    connection.query(sql, [email, md5(password)], (err, rows) => {
      if (err) throw err;
      res.cookie("figurine-session", session, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
      res
        .json({
          message: {
            type: "success",
            title: `Hello, ${rows?.[0]?.name}!`,
            text: `Welcome to back!`,
          },
          session,
          user: rows?.[0],
        })
        .end();
    });
  });
});

app.post("/logout", (req, res) => {
  setTimeout(() => {
    const session = req.cookies["figurine-session"];

    const sql = `
                UPDATE users
                SET session = NULL
                WHERE session = ?
            `;

    connection.query(sql, [session], (err, result) => {
      if (err) throw err;
      const logged = result.affectedRows;
      if (!logged) {
        res
          .status(401)
          .json({
            message: {
              type: "error",
              title: "Logout failed",
              text: `Invalid login data`,
            },
          })
          .end();
        return;
      }
      res.clearCookie("figurine-session");
      res
        .json({
          message: {
            type: "success",
            title: `Disconnected`,
            text: `You have successfully logged out`,
          },
        })
        .end();
    });
  }, 1500);
});

app.get("/admin/users", (req, res) => {
  if (!checkUserIsAuthorized(req, res, ["admin"])) {
    return;
  }

  const sql = `
        SELECT *
        FROM users`;

  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res
      .json({
        users: rows,
      })
      .end();
  });
});

app.delete("/admin/delete/user/:id", (req, res) => {
  setTimeout(() => {
    const { id } = req.params;

    const sql = `
        DELETE 
        FROM users 
        WHERE id = ? AND role != 'admin'
        `;

    connection.query(sql, [id], (err, result) => {
      if (err) throw err;
      const deleted = result.affectedRows;
      if (!deleted) {
        res
          .status(422)
          .json({
            message: {
              type: "info",
              title: "Users",
              text: `User is admin or user does not exist.`,
            },
          })
          .end();
        return;
      }
      res
        .json({
          message: {
            type: "success",
            title: "User",
            text: `User was deleted.`,
          },
        })
        .end();
    });
  }, 1500);
});

app.get("/admin/edit/user/:id", (req, res) => {
  setTimeout(() => {
    if (!checkUserIsAuthorized(req, res, ["admin", "editor"])) {
      return;
    }

    const { id } = req.params;
    const sql = `
        SELECT id, name, email, role
        FROM users
        WHERE id = ?
        `;
    connection.query(sql, [id], (err, rows) => {
      if (err) throw err;
      if (!rows.length) {
        res
          .status(404)
          .json({
            message: {
              type: "info",
              title: "Users",
              text: `User does not exist.`,
            },
          })
          .end();
        return;
      }
      res
        .json({
          user: rows[0],
        })
        .end();
    });
  }, 1500);
});

app.put("/admin/update/user/:id", (req, res) => {
  setTimeout(() => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    if (!password) {
      const sql = `
            UPDATE users
            SET name = ?, email = ?, role = ?
            WHERE id = ?
            `;

      connection.query(sql, [name, email, role, id], (err, result) => {
        if (err) throw err;
        const updated = result.affectedRows;
        if (!updated) {
          res
            .status(404)
            .json({
              message: {
                type: "info",
                title: "Users",
                text: `User does not exist.`,
              },
            })
            .end();
          return;
        }
        res
          .json({
            message: {
              type: "success",
              title: "Users",
              text: `User was updated`,
            },
          })
          .end();
      });
    } else {
      const sql = `
                UPDATE users
                SET name = ?, email = ?, role = ?, password = ?
                WHERE id = ?
                `;

      connection.query(
        sql,
        [name, email, role, md5(password), id],
        (err, result) => {
          if (err) throw err;
          const updated = result.affectedRows;
          if (!updated) {
            res
              .status(404)
              .json({
                message: {
                  type: "info",
                  title: "Users",
                  text: `User does not exist.`,
                },
              })
              .end();
            return;
          }
          res
            .json({
              message: {
                type: "success",
                title: "Users",
                text: `User was updated`,
              },
            })
            .end();
        }
      );
    }
  }, 1500);
});

const writeImage = (imageBase64) => {
  if (!imageBase64) {
    return null;
  }
  let type;
  let image;
  if (imageBase64.indexOf("data:image/png;base64,") === 0) {
    type = "png";
    image = Buffer.from(
      imageBase64.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );
  } else if (imageBase64.indexOf("data:image/jpeg;base64,") === 0) {
    type = "jpg";
    image = Buffer.from(
      imageBase64.replace(/^data:image\/jpeg;base64,/, ""),
      "base64"
    );
  } else {
    res.status(500).send("Bad image format");
    return;
  }
  const filename = md5(uuidv4()) + "." + type;
  fs.writeFileSync("public/img/" + filename, image);
  return filename;
};

const deleteImage = (postId) => {
  let sql = "SELECT photo FROM posts WHERE id = ?";
  connection.query(sql, [postId], (err, results) => {
    if (err) {
      res.status;
    } else {
      if (results[0].photo) {
        fs.unlinkSync("public/img/" + results[0].photo);
      }
    }
  });
};

app.get("/admin/products", (req, res) => {
  setTimeout(() => {
    if (!checkUserIsAuthorized(req, res, ["admin", "editor"])) {
      return;
    }
    const sql = `
        SELECT *
        FROM products`;
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      res
        .json({
          products: rows,
        })
        .end();
    });
  }, 1500);
});

app.post("/admin/store/product", (req, res) => {
  setTimeout(() => {
    const { title, photo, price, info, in_stock } = req.body;
    const filename = writeImage(photo);
    const sql = `
            INSERT INTO products (title, photo, price, info, in_stock)
            VALUES ( ?, ?, ?, ?, ? )
            `;
    connection.query(sql, [title, filename, price, info, in_stock], (err) => {
      if (err) throw err;
      res
        .status(201)
        .json({
          message: {
            type: "success",
            title: "Products",
            text: `Product successfully created.`,
          },
        })
        .end();
    });
  }, 1500);
});

app.delete("/admin/delete/product/:id", (req, res) => {
  const { id } = req.params;
  let filename = null;
  let sql = "SELECT photo FROM products WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (results[0].photo) {
      filename = results[0].photo;
      const sql = `
                    DELETE 
                    FROM products 
                    WHERE id = ? 
                    `;
      connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        const deleted = result.affectedRows;
        if (!deleted) {
          res
            .status(422)
            .json({
              message: {
                type: "info",
                title: "Products",
                text: `Product does not exist.`,
              },
            })
            .end();
          return;
        }
        if (filename) {
          fs.unlinkSync("public/img/" + filename);
        }
        res
          .json({
            message: {
              type: "success",
              title: "Product",
              text: `Product successfully deleted.`,
            },
          })
          .end();
      });
    }
  });
});

app.listen(port, () => {
  console.log(`3d Figurine app listening on port ${port}`);
});
