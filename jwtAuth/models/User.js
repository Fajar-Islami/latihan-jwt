const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Harap masukan email'],
    unique: true, //supaya tidak ada email yang sama
    lowercase: true, //
    validate: [isEmail, 'Harap masukan alamat email yang valid'], //Untuk valid email
  },
  password: {
    type: String,
    required: [true, 'Harap masukan password'],
    minlength: [6, 'Password minimal 6 karakter'],
  },
});

// Fire a function after doc saved to db

//dijalankan ketika save
userSchema.post('save', function (doc, next) {
  console.log('Berhasil daftar user', doc);
  next();
});

// Fire a function before doc saved to db
// ini function biasa, kalo arrow gk dapat valuenya
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); // (password yang akan di hash,salt)
  next();
});

// Static method to login user
// methodnya dinamai login
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });

  // Mengecek data user(email)
  if (user) {
    // Compare password ==>  (password yang dikirim belum di hash, password yang dihash di database)
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
      //  setelah sama dibuat jwnya
    }
    //  jika pw salah
    throw Error('Password salah');
  }
  // Klo email salah
  throw Error('Email salah');
};

const User = mongoose.model('user', userSchema);

module.exports = User;
