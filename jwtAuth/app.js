const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost/jwt_auth';
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(3000, () => console.log('Koneksi sukses ke localhost:3000')))
  .catch((err) => console.log(err));

app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  console.log('new user: ', cookies.newUser);
  res.json(cookies);
});

// routes
app.get('*', checkUser); // semua route
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies')); //Mengecek login atau tidakk
app.use(authRoutes);

// // cookies
// app.get('/set-cookies', (req, res) => {
//   // res.setHeader('Set-Cookie', 'newUser=true');
//   res.cookie('newUser', false); //kalau cookie newUsernya tidak ada, maka dibuat || jika ada maka valuenya diganti false
//   // res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, secure: true }); // cookie expired dalam 1 hari || cookie hanya dikirim dalam https
//   res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }); // cookie expired dalam 1 hari || cookie tidak bisa diakses dari javascript

//   res.send('berhasil mengambil cookie');
// });
