const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const errorMiddleWare = require("./middleware/error");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require('cors');

//Config 
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

app.use(cookieParser());


app.use(bodyParser.json({ limit: "50mb" }))
//for solve base64 limitation issues when image upload on cloudinary
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(fileUpload());

//Route Imports 
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use(cors());
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);





//=============================for live api check===============================



app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});


// ================================================================






// const corsOptions = {
//   origin: '*',
//   credentials: true,
//   optionSuccessStatus: 200
// }
// app.use(cors(corsOptions))
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
// app.set('trust proxy', 1);

//MidleWare For Error
app.use(errorMiddleWare);

module.exports = app