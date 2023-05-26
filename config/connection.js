// Import mysql2 package
const mysql = require('mysql2');

// Import dotenv package to manage environment variables
require('dotenv').config();

// Create a connection to the database
const db = mysql.createConnection({
    // Host name, typically 'localhost' for local development
    host: process.env.DB_HOST,

    // Your MySQL username, stored as an environment variable
    user: process.env.DB_USER,

    // Your MySQL password, stored as an environment variable
    password: process.env.DB_PASSWORD,

    // The name of the database you're connecting to
    database: process.env.DB_NAME
});

// Export the connection for use in other files
module.exports = db;
