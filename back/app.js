const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const braintree = require("braintree");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const fs = require("node:fs");
const md5 = require("md5");
const app = express();
require("dotenv").config();
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

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

app.get("/clienttoken", async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.send({ data: response.clientToken });
  } catch (err) {
    console.error("Error generating Braintree token:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to process a payment (using the payment nonce)
app.post("/checkout", async (req, res) => {
  const { paymentMethodNonce, amount } = req.body;

  try {
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce,
      options: {
        submitForSettlement: true,
      },
    });

    // Log the full result for debugging
    console.log("Braintree Transaction Result:", result.transaction.amount);
    console.log("Braintree Transaction Result:", result.success);

    if (result.success) {
      res.send({ success: true });
    } else {
      // Send the error message from Braintree for better client-side handling
      res.send({ success: false, error: result.message });
    }
  } catch (err) {
    console.error("Error processing transaction:", err);
    res.status(500).send(err);
  }
});

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
            text: `Welcome back!`,
          },
          session,
          user: rows?.[0],
        })
        .end();
    });
  });
});

app.post("/logout", (req, res) => {
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
});

app.get("/admin/edit/user/:id", (req, res) => {
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
});

app.put("/admin/update/user/:id", (req, res) => {
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
  let sql = "SELECT photo FROM products WHERE id = ?";
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
  if (!checkUserIsAuthorized(req, res, ["admin", "editor"])) {
    return;
  }
  const sql = `
        SELECT *
        FROM products
        ORDER BY updated_at DESC;
        `;
  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res
      .json({
        products: rows,
      })
      .end();
  });
});

app.post("/admin/store/product", (req, res) => {
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

app.get("/admin/edit/product/:id", (req, res) => {
  if (!checkUserIsAuthorized(req, res, ["admin", "editor"])) {
    return;
  }
  const { id } = req.params;
  const sql = `
        SELECT *
        FROM products
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
            title: "Products",
            text: `Product does not exist.`,
          },
        })
        .end();
      return;
    }
    res
      .json({
        product: rows[0],
      })
      .end();
  });
});

app.put("/admin/update/product/:id", (req, res) => {
  const { id } = req.params;

  const { title, photo, price, featured, approved, info, in_stock, discount } =
    req.body;

  if (photo) {
    photo.length > 40 && deleteImage(id);
    const filename = photo.length > 40 ? writeImage(photo) : photo;
    const sql = `
            UPDATE products
            SET title = ?, photo = ?, price = ?, featured = ? , approved = ?, info = ?, in_stock = ?, discount = ?
            WHERE id = ?
            `;
    connection.query(
      sql,
      [
        title,
        filename,
        price,
        featured,
        approved,
        info,
        in_stock,
        discount,
        id,
      ],
      (err, result) => {
        if (err) throw err;
        const updated = result.affectedRows;
        if (!updated) {
          res
            .status(404)
            .json({
              message: {
                type: "info",
                title: "Products",
                text: `Product does not exist`,
              },
            })
            .end();
          return;
        }
        res
          .json({
            message: {
              type: "success",
              title: "Products",
              text: `Product successfully updated.`,
            },
          })
          .end();
      }
    );
  } else {
    deleteImage(id);
    const sql = `
            UPDATE posts
            SET title = ?, photo = null, price = ?, featured = ? , approved = ?, info = ?, in_stock = ?, discount = ?
            WHERE id = ?
            `;
    connection.query(
      sql,
      [title, photo, price, featured, approved, info, in_stock, discount, id],
      (err, result) => {
        if (err) throw err;
        const updated = result.affectedRows;
        if (!updated) {
          res
            .status(404)
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
        res
          .json({
            message: {
              type: "success",
              title: "Products",
              text: `Product successfully updated.`,
            },
          })
          .end();
      }
    );
  }
});

app.get("/web/products", (req, res) => {
  const sql = `
   SELECT title, photo, in_stock, price, rating, id, discount, created_at
   FROM products 
   WHERE approved = TRUE
   ORDER BY updated_at DESC;
  `;

  connection.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.json({ products: rows }).end();
  });
});

app.get("/web/product/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT *
    FROM products
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
            title: "Product",
            text: `Product does not exist.`,
          },
        })
        .end();
      return;
    }
    res
      .json({
        product: rows[0],
      })
      .end();
  });
});

const generateOrderId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

app.post("/store/cart", (req, res) => {
  const {
    user_id,
    name,
    surname,
    email,
    phone,
    address,
    cart,
    total,
    payment_nonce, // Add payment_nonce here
  } = req.body;

  // Validate required fields, including payment_nonce
  if (
    !user_id ||
    !name ||
    !surname ||
    !email ||
    !cart ||
    !total ||
    !phone ||
    !address ||
    !payment_nonce // Make sure the nonce is provided
  ) {
    return res.status(422).json({
      message: {
        type: "danger",
        text: "Name, surname, email, cart, user ID, total, address, phone, and payment nonce are required.",
      },
    });
  }

  const order_id = generateOrderId();

  // Update SQL to include payment_nonce
  const sql = `
    INSERT INTO orders (order_id, user_id, name, surname, email, phone, address, cart, total, payment_nonce, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())
  `;

  connection.query(
    sql,
    [
      order_id,
      user_id,
      name,
      surname,
      email,
      phone,
      address,
      JSON.stringify(cart),
      total,
      payment_nonce, // Insert payment_nonce into the database
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting cart data:", err);
        return res.status(500).json({
          message: {
            type: "danger",
            text: "Failed to store cart data.",
          },
        });
      }

      res.json({
        success: true,
        order_id, // Include the generated order ID in the response
        message: {
          type: "success",
          text: "Thank you for shopping!",
        },
      });
    }
  );
});

app.get("/sale/products", (req, res) => {
  const sql = `
   SELECT title, photo, in_stock, price, rating, id, discount
    FROM products 
    WHERE approved = TRUE AND discount > 0
    ORDER BY updated_at DESC;
  `;

  connection.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.json({ products: rows }).end();
  });
});

app.get("/user/cart/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT order_id, status, total, created_at, cart
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  connection.query(sql, [id], (err, rows) => {
    if (err) throw err;

    res
      .json({
        userCart: rows, // Return all cart entries, with the newest on top
      })
      .end();
  });
});

app.get("/admin/orders", (req, res) => {
  if (!checkUserIsAuthorized(req, res, ["admin", "editor"])) {
    return;
  }
  const sql = `
        SELECT *
        FROM orders
        ORDER BY created_at DESC`;
  connection.query(sql, (err, rows) => {
    if (err) throw err;
    res
      .json({
        orders: rows,
      })
      .end();
  });
});

app.put("/admin/change/order/status/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Get the new status from the request body

  // Ensure the status is valid and within the allowed values
  const validStatuses = [
    "awaiting payment",
    "pending",
    "processing",
    "shipped",
    "completed",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({
        message: {
          type: "danger",
          title: "Order Status",
          text: "Invalid status value.",
        },
      })
      .end();
  }

  const sql = `
      UPDATE orders
      SET status = ?
      WHERE id = ?
    `;

  connection.query(sql, [status, id], (err, result) => {
    if (err) throw err;
    const updated = result.affectedRows;
    if (!updated) {
      res
        .status(404)
        .json({
          message: {
            type: "info",
            title: "Order Status",
            text: `Order not found.`,
          },
        })
        .end();
      return;
    }
    res
      .json({
        message: {
          type: "success",
          title: "Order Status",
          text: `Order status successfully updated.`,
        },
        newId: id,
      })
      .end();
  });
});

app.get("/featured/products", (req, res) => {
  const sql = `
  SELECT title, photo, in_stock, price, rating, id, discount, created_at
  FROM products 
  WHERE approved = TRUE AND featured = TRUE
  ORDER BY updated_at DESC;
`;

  connection.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.json({ products: rows }).end();
  });
});

app.get("/admin/stats", (req, res) => {
  const sqlUsers = "SELECT COUNT(*) AS countUsers FROM users";
  const sqlProducts = "SELECT COUNT(*) AS countProducts FROM products";
  const sqlOrders = "SELECT COUNT(*) AS countOrders FROM orders";
  const sqlTotalQuantity = `
            SELECT SUM(JSON_UNQUOTE(JSON_EXTRACT(cart, CONCAT('$[', idx, '].quantity')))) AS totalQuantity
            FROM orders
            JOIN (
              SELECT 0 AS idx UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
            ) AS indices
            WHERE JSON_EXTRACT(cart, CONCAT('$[', idx, '].quantity')) IS NOT NULL
          `;
  const sqlTotalOrderAmount = `
          SELECT SUM(total) AS totalOrderAmount 
              FROM orders
            `;
  // Query for getting sales count by date
  const sqlSalesByDate = `
          SELECT DATE(created_at) AS saleDate, COUNT(*) AS salesCount
          FROM orders
          GROUP BY DATE(created_at)
          ORDER BY saleDate ASC
          `;

  let stats = {};

  connection.query(sqlUsers, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send(err);
    }
    console.log("Fetched user count:", results[0].countUsers);
    stats.countUsers = results[0].countUsers;

    connection.query(sqlProducts, (err, results) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).send(err);
      }
      console.log("Fetched product count:", results[0].countProducts);
      stats.countProducts = results[0].countProducts;

      connection.query(sqlOrders, (err, results) => {
        if (err) {
          console.error("Error fetching orders:", err);
          return res.status(500).send(err);
        }
        console.log("Fetched order count:", results[0].countOrders);
        stats.countOrders = results[0].countOrders;

        connection.query(sqlTotalQuantity, (err, results) => {
          if (err) {
            console.error("Error fetching total quantity:", err);
            return res.status(500).send(err);
          }
          console.log("Fetched total quantity:", results[0].totalQuantity);
          stats.totalQuantity = results[0].totalQuantity;

          connection.query(sqlTotalOrderAmount, (err, results) => {
            if (err) {
              console.error("Error fetching total order amount:", err);
              return res.status(500).send(err);
            }
            console.log(
              "Fetched total order amount:",
              results[0].totalOrderAmount
            );
            stats.totalOrderAmount = results[0].totalOrderAmount;

            connection.query(sqlSalesByDate, (err, results) => {
              if (err) {
                console.error("Error fetching sales by date:", err);
                return res.status(500).send(err);
              }
              console.log("Fetched sales by date:", results);
              stats.salesByDate = results;

              res.json(stats);
            });
          });
        });
      });
    });
  });
});

app.delete("/admin/delete/order/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
        DELETE 
        FROM orders 
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
            title: "Oders",
            text: `Order does not exist.`,
          },
        })
        .end();
      return;
    }
    res
      .json({
        message: {
          type: "success",
          title: "Order",
          text: `Order was deleted.`,
        },
      })
      .end();
  });
});

app.listen(port, () => {
  console.log(`3d Figurine app listening on port ${port}`);
});
