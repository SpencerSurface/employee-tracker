const CLI = require("./lib/cli.js");
const figlet = require("figlet");

// Create a new CLI (Command Line Interface object)
const cli = new CLI();

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

// Run the tool
cli.chooseAction();