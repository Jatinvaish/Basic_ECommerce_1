const mongoose = require("mongoose");



const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: false }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
}


module.exports = connectDatabase




{/*
                                         FOR  API(Application Programming Interface)

1) what is middleware in node js?
ANS : The middleware in node. js is a function that will have all the access for requesting an object,
      responding to an objectand, moving to the next middleware function in the application request-response cycle


 2) What is async await function ?
 ANS : async functions return a promise. async functions use an implicit Promise to return results. Even if you don't 
       return a promise explicitly, the async function makes sure that your code is passed through a promise. await blocks the 
       code execution within the async function, of which it ( await statement ) is a part

3) what is req and res in node js?
ANS:   The req object represents the HTTP request and has properties for the request query string, parameters,
       body, and HTTP headers. The res object represents the HTTP response that an Express app sends when it gets an HTTP request.


4) What does req res and next do?
ANS :  Middleware functions are functions that have access to the request object ( req ), the response object ( res ),
       and the next function in the application's request-response cycle. The next function is a function in the Express router 
       which, when invoked, executes the middleware succeeding the current middleware.

5) how many type of middleware in node
ANS : There are many types of node. JS middleware, such as application-level, router-level, 
      built-in, error-handling, and third-party middleware.
*/}





{/*
                                                  FOR UI(USER INTERFACE)


1) What Is Redux Middleware? 
ANS :Redux Middleware allows you to intercept every action sent to the reducer so you can make changes to the
    action or cancel the action.

2) How many types of middleware are there?
ANS : The types of middleware include database middleware, application server middleware,
      message-oriented middleware, transaction-processing monitors and Web middleware.

*/}
