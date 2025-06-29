const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

exports.login = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }

    if (results.length === 0) {
      console.log(`Login failed: No user with email ${email}`);
      return res.status(401).json({ status: "no record", message: "Email not found" });
    }

    const user = results[0];

    try {
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        console.log("Login failed: Incorrect password");
        return res.status(401).json({ status: "incorrect password", message: "Wrong password" });
      }

      const userData = {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        email: user.email
      };

      res.cookie("user", JSON.stringify(userData), {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
      });

      console.log("Login successful:", userData);
      return res.json({ status: "success", user: userData });

    } catch (e) {
      console.error("bcrypt error:", e);
      return res.status(500).json({ status: "error", message: "Password verification failed" });
    }
  });
};

exports.checkLogin = (req, res) => {
  console.log("Checking login status, cookies:", req.cookies);
  const userCookie = req.cookies.user;

  if (!userCookie) return res.json({ user: null });

  try {
    const user = JSON.parse(userCookie);
    return res.json({ user });
  } catch (err) {
    console.error("Cookie parsing error:", err);
    return res.status(400).json({ user: null });
  }
};

















// const db = require('../config/db');
// const bcrypt = require('bcrypt');

// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   const query = 'SELECT user_id, name, role, email, password_hash FROM users WHERE email = ?';

//   db.query(query, [email], async (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ status: "error", message: "Internal server error" });
//     }

//     if (results.length === 0) {
//       console.log(`Login failed: No user found with email ${email}`);
//       return res.status(401).json({ status: "no record", message: "Email not found" });
//     }

//     const user = results[0];

//     try {
//       const match = await bcrypt.compare(password, user.password_hash);
//       if (!match) {
//         console.log("Login failed: Password mismatch");
//         return res.status(401).json({ status: "incorrect password", message: "Wrong password" });
//       }

//       const userData = {
//         user_id: user.user_id,
//         name: user.name,
//         role: user.role,
//         email: user.email
//       };

//       res.cookie("user", JSON.stringify(userData), {
//         httpOnly: true,
//         secure: false,
//         maxAge: 24 * 60 * 60 * 1000
//       });

//       console.log("Login success:", userData);
//       return res.json({ status: "success", user: userData });

//     } catch (e) {
//       console.error("bcrypt compare error:", e);
//       return res.status(500).json({ status: "error", message: "Password check failed" });
//     }
//   });
// };


// // CHECK LOGIN FUNCTION
// exports.checkLogin = (req, res) => {
//   console.log("checkLogin called, cookies:", req.cookies);
//   const userCookie = req.cookies.user;

//   if (!userCookie) {
//     return res.json({ user: null });
//   }

//   try {
//     const user = JSON.parse(userCookie);
//     return res.json({ user });
//   } catch (err) {
//     console.error("Error parsing user cookie:", err);
//     return res.status(400).json({ user: null });
//   }
// };