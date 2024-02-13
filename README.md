# Employee Tracker

## Description

This project is a command line tool to manage a company's employee database. This tool allows users to manager employee information from the command line, allowing workers who are not developers to interact with the company's employee database.

This project is written in JavaScript to be run in Node.js, and SQL to be run in MySQL. It utilizes the package `inquirer.js` to handle user interaction, `mysql2.js` to allow the JavaScript code to interact with the MySQL server, and `figlet` to provide ASCII-art lettering.

The SQL code is located in the files in the `db` directory, the main portion of the program is called from `index.js`, the command line interface is implemented in `lib/cli.js`, and a helper function is included as `helpers/promptForId.js`.

In completing this project, I have improved my skills in SQL and specifically in using SQL from Node.js.

## Installation

Install this project by cloning the repository from GitHub, then navigating to the project directory in your terminal and running `npm install`. The database can be created by running `schema.sql` in MySQL, and can be seeded by running `seeds.sql`.

You may need to change the value of the password the tool uses to log into MySQL. This can be found in `lib/cli.js`, in the constructor of the CLI class.

## Usage

To use this tool, navigate to the project's directory in your terminal and run the command `node index.js`. Follow the command line prompts to use the tool. 

A walkthrough of some of the functionality of the tool is provided in the following video: [Walkthrough video](./walkthrough.webm). The video covers the options to view all departments, roles, and employees; add a department, role, and employee; and updating an employee's role.

## Credits

All code was written on my own. The functionality of the tool was implemented to meet requirements provided by edX Boot Camps LLC. Likewise, though the SQL was written by myself, the design of the database was provided by edX.

## License

This project is licensed under the GNU General Public License version 3. See [LICENSE](./LICENSE) for the full text of the license.