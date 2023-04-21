const ErrorHandler = require("../utils/errorhandleer")
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


//Registe User

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res);
});

//Login User

exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body;

    //if user has given password and email both 

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password 🫣", 401))
    }

    //must use await i waste 2 hour for this shit await 
    const isPasswordMatced = await user.comparePassword(password);


    if (!isPasswordMatced) {
        return next(new ErrorHandler("Invalid Password 🫣", 401))
    }

    sendToken(user, 200, res);
})

//Logout User

exports.logOut = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });


    res.status(200).json({
        sucess: true,
        message: "Logged Out."
    })
})


//Forgot Password 

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        next(new ErrorHandler(`User not found`, 404));
    }

    //Get resetPasssword Token 

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPassswordUrl =`${req.protocol}://${req.get(
        "host"
      )}/password/reset/${resetToken}`;
    

    const message = `You Password rset token is :-\n\n ${resetPassswordUrl} \n\n 
    If you have not requested this email then, please ignore it `;

    try {

        await sendEmail({
            email: user.email,
            subject: `J&V Password Recovery`,
            message
        })

        res.status(200).json({
            sucess: true,
            message: `Email Send to ${user.email} succesfully.`
        })

    } catch (error) {
        user.restPasswordToken = undefined;
        user.resetPasswordExpired = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
})


//Reset Password

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {


    const restPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        restPasswordToken,
        resetPasswordExpired: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid  or has been expired", 404))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password dosen't match", 404))
    }

    user.password = req.body.password;
    user.restPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//Get User Detail

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        sucess: true,
        user,
    })
})

//Update User Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatced = await user.comparePassword(oldPassword);


    if (!isPasswordMatced) {
        return next(new ErrorHandler("Old Password is Incoreesct", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password dosent match", 400))
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);

})


//Update User Profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });

});


//Get All Users --ADMIN

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        sucess: true,
        users,
    })

});



//Get Single Users --ADMIN

exports.getSingleUsers = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User dose not exist with id ${req.params.id}.`, 404))
    }

    res.status(200).json({
        sucess: true,
        user,
    })


});


//Update User Role --ADMIN

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUSerData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    await User.findByIdAndUpdate(req.params.id, newUSerData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        sucess: true,
    });

});


//Delete User --ADMIN

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);


    //we eill remove clouinary later

    if (!user) {
        return next(new ErrorHandler(`User dosen't exist with id: ${req.params.id}`, 404));
    }
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        sucess: true,
        message: `User ${req.params.id} deleted Successfully.`
    });

});