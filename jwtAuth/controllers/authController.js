const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // email salah
  if (err.message === 'Email salah') {
    errors.email = 'Email belum terdaftar';
  }
  // password salah
  if (err.message === 'Password salah') {
    errors.password = 'Password ini salah';
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = 'Email ini sudah terdaftar';
    return errors;
  }

  // Validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

// Membuat JWT
const createToken = (id) => {
  return jwt.sign({ id }, 'fajar islami secret', { expiresIn: maxAge }); // expiresIn ==> masa exprire jwtnya, mirip cookie
};

module.exports.signup_get = (req, res) => {
  res.render('signup');
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  // Membuat new user
  try {
    const user = await User.create({ email, password });
    // Menunggu promise resolved jadi perlu await

    // Membuat JWT berdasarkan _id yang dibuat mongodb
    const token = createToken(user._id);

    // name = jwt , value=token, object/keterangan tambahan = httpOnly, maxAge
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); //harus * 1000 untuk 1hari

    res.status(201).json({ user: user._id }); // dikirim ke signup.js
  } catch (error) {
    // console.log(error);
    const errors = handleErrors(error);
    res.status(400).json({ errors }); // dikirim ke signup.js
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password); // mengirim ke userSchema.statics.login
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); //harus * 1000 untuk 1hari
    res.status(200).json({ user: user._id }); // di console.log
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }); // bukan dihapus, tapi valuenya kosong dan maxAgenya jadi 1ms
  res.redirect('/');
};
