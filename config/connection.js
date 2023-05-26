// Import the mysql2 package. This package is a MySQL client for Node.js with support for server-side prepared statements.
const mysql = require('mysql2');

// Create a connection to the database using the 'createConnection' function
// The function accepts a configuration object which includes the database 
// details such as host, user, password and database name
const db = mysql.createConnection({
    // host: The hostname of the database you are connecting to.
    host: 'localhost',

    // user: The MySQL user to authenticate as.
    user: 'root',

    // password: The password of that MySQL user.
    password: 'zxcqweasd123!!',

    // database: The name of the database to use.
    database: 'employee_tracker_db'
});

// Expose the database connection object to be imported by other modules.
// This allows us to maintain a single connection object throughout our application.
module.exports = db;
