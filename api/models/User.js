const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const crypto = require("crypto");

//si agregas mas datos aqui
const UserSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    birthdate: {
      type: Date,
      trim: true,
    },
    hashedPassword: {
      type: String,
      require: true,
    },
    followupemail: {
      type: String,
      trim: true,
    },
    salt: String,
    validTokens: [String],
  },
  {
    timestamps: true,
  }
);

UserSchema.methods = {
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
  encryptPassword: function (password) {
    if (!password) return "";

    try {
      const encryptedPassword = crypto
        .createHash("sha256", this.salt)
        .update(password)
        .digest("hex");

      return encryptedPassword;
    } catch {
      return "";
    }
  },
  comparePasswords: function (input) {
    return this.encryptPassword(input) === this.hashedPassword;
    // sdkjaldjaslkdasalk == jdsslakdljdl1
    //
  },
};

UserSchema.virtual("password").set(function (password) {
  if (password === "") return;

  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
});
module.exports = mongoose.model("User", UserSchema);
