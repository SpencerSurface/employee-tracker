const inquirer = require("inquirer");
const mysql = require("mysql2");

// Define the CLI (Command Line Interface) class
class CLI {
    // Constructor
    constructor() {
        // List of objects containing descriptions of actions the user can take and the corresponding method
        this.prompts = [
            "View All Employees",
            "View Employees By Manager",
            "View Employees By Department",
            "Add Employee",
            "Delete Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles",
            "Add Role",
            "Delete Role",
            "View All Departments",
            "Add Department",
            "Delete Department",
            "View Utilized Budget By Department",
            "Quit"
        ];

        // Connection to the database
        this.db = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "employees_db"
        }, console.log("Connected to the employees_db database."));
    }

    // Run the CLI
    run() {
        this.chooseAction();
    }

    // Prompt the user what they would like to do
    chooseAction() {
        return inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: this.prompts
            }
        ]).then(({action}) => {
            // The promise returns the text of the option the user selected
            // Call the method corresponding to that text
            this.callAction(action);
        });
    }

    // Call the correct method based on the prompt selected
    callAction(prompt) {
        switch (prompt) {
            case "View All Employees":
                this.viewEmployees();
                break;
            case "View Employees By Manager":
                this.viewEmployeesByManager();
                break;
            case "View Employees By Department":
                this.viewEmployeesByDepartment();
                break;
            case "Add Employee":
                this.addEmployee();
                break;
            case "Delete Employee":
                this.deleteEmployee();
                break;
            case "Update Employee Role":
                this.updateEmployeeRole();
                break;
            case "Update Employee Manager":
                this.updateEmployeeManager();
                break;
            case "View All Roles":
                this.viewRoles();
                break;
            case "Add Role":
                this.addRole();
                break;
            case "Delete Role":
                this.deleteRole();
                break;
            case "View All Departments":
                this.viewDepartments();
                break;
            case "Add Department":
                this.addDepartment();
                break;
            case "Delete Department":
                this.deleteDepartment();
                break;
            case "View Utilized Budget By Department":
                this.viewUtilizedDepartmentBudget();
                break;
            case "Quit":
                this.quit();
                break;
            default: 
                return;
        }
    }

    // Display all departments to the user
    viewDepartments() {
        // Select all department information from the database
        this.db.query("SELECT * FROM departments", (err, result) => {
            // Print the department information
            console.table(result);
            // Prompt the user for another action
            return this.chooseAction();
        });
    }

    // Display all roles to the user
    viewRoles() {}

    // Display all employees to the user
    viewEmployees() {}

    // Allow the user to add a department
    addDepartment() {}

    // Allow the user to add a role
    addRole() {}

    // Allow the user to add an employee
    addEmployee() {}

    // Allow the user to update an employee's role
    updateEmployeeRole() {}

    // Allow the user to update an employee's manager
    updateEmployeeManager() {}

    // Allow the user to choose a manager and display that manager's employees
    viewEmployeesByManager() {}

    // Allow the user to choose a department and display that department's employees
    viewEmployeesByDepartment() {}

    // Allow the user to delete a department
    deleteDepartment() {}

    // Allow the user to delete a role
    deleteRole() {}

    // Allow the user to delete an employee
    deleteEmployee() {}

    // Allow the user to choose a department and display the sum of the salaries of the employees of that department
    viewUtilizedDepartmentBudget() {}

    // Quit
    quit() {}
}

module.exports = CLI;