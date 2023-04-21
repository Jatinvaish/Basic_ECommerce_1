//Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {

    const token = user.getJWTToken();
    //Option For Cookies
    const options = {
        expires: new Date(Number(
            new Date()) + (process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    });
};

module.exports = sendToken;