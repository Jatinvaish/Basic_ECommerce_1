const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name 🫡"],
        maxLength: [40, "Name cannot exceed 40 characters."],
        minLength: [4, "Name should have more than 4 character."]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email 🫡"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password 🙈"],
        minLength: [8, "Password should be grate than 8 characters."],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },

    restPasswordToken: String,
    resetPasswordExpired: Date,
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcryptjs.hash(this.password, 10);
})


//JWT Token
userSchema.methods.getJWTToken = function () {
    return JWT.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};


//ComparePassword 

userSchema.methods.comparePassword = async function (enterdPassword) {
    return await bcryptjs.compare(enterdPassword, this.password);
}


//Genrate ResetPassword Token 

userSchema.methods.getResetPasswordToken = function () {

    //Genrating Token 
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding to userSchema
    this.restPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpired = Date.now() + 15 * 60 * 1000;

    return resetToken;
};
module.exports = mongoose.model("User", userSchema);