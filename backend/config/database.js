const mongoose = require("mongoose");



const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: false }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
}


module.exports = connectDatabase
