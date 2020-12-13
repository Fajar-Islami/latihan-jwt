const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mengecek status Auth
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt; // Mengambil cookies yang namanya jwt

  // check json web token exists & is verified
  if (token) {
    //sesuai di authController
    jwt.verify(token, 'fajar islami secret', (err, decodedToken) => {
      // decodedToken itu isinya _id dari authController, cara liatnya stop next/redirectnya
      // Klo token salah/expired
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      }
      // klo token benar
      else {
        console.log(decodedToken);
        next(); //
      }
    });
  } else {
    // Kalo blm login/sign up redirect login
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, 'fajar islami secret', async (err, decodedToken) => {
      // Klo token salah/expired
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next(); // pindah ke step selanjutnya
      }
      // klo token benar
      else {
        console.log(decodedToken);

        // Mengambil email dari id
        let user = await User.findById(decodedToken.id);
        // Inject ke view
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
