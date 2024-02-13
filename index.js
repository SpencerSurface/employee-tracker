const CLI = require("./lib/cli.js");
const mysql = require("mysql2/promise");
const figlet = require("figlet");

// Print title
console.log(figlet.textSync(
    "Employee Tracker",
    {
        font: "rectangles",
        horizontalLayout: "default",
        verticalLayout: "full",
        width: 80,
        whitespaceBreak: true
    }
), "\n");

// Connect to the database
mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "employees_db"
}).then((conn) => {
    // Create a new CLI (Command Line Interface object)
    const cli = new CLI(conn);
    // Run the tool
    cli.chooseAction().then(() => cli);
});