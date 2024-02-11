const inquirer = require("inquirer");
const mysql = require("mysql2");

// Define the CLI (Command Line Interface) class
class CLI {
    // Constructor
    constructor() {
        // List of objects containing descriptions of actions the user can take and the corresponding method
        this.actions = [
            {prompt: "View All Employees", method: this.viewEmployees},
            {prompt: "View Employees By Manager", method: this.viewEmployeesByManager},
            {prompt: "View Employees By Department", method: this.viewEmployeesByDepartment},
            {prompt: "Add Employee", method: this.addEmployee},
            {prompt: "Delete Employee", method: this.deleteEmployee},
            {prompt: "Update Employee Role", method: this.updateEmployeeRole},
            {prompt: "Update Employee Manager", method: this.updateEmployeeManager},
            {prompt: "View All Roles", method: this.viewRoles},
            {prompt: "Add Role", method: this.addRole},
            {prompt: "Delete Role", method: this.deleteRole},
            {prompt: "View All Departments", method: this.viewDepartments},
            {prompt: "Add Department", method: this.addDepartment},
            {prompt: "Delete Department", method: this.deleteDepartment},
            {prompt: "View Utilized Budget By Department", method: this.viewUtilizedDepartmentBudget},
            {prompt: "Quit", method: this.quit}
        ]
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
                // The choices are the prompt properties of the objects in the this.actions array
                choices: this.actions.map((x) => x.prompt)
            }
        ]).then(({action}) => {
            // The promise returns the text of the option the user selected
            // Call the method corresponding to that text
            this.actions.filter((x) => x.prompt === action)[0].method();
        })
    }

    // Display all departments to the user
    viewDepartments() {}

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