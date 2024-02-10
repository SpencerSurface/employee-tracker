const inquirer = require("inquirer");
const mysql = require("mysql2");

// Define the CLI (Command Line Interface) class
class CLI {
    // Run the CLI
    run() {}

    // Prompt the user what they would like to do
    chooseAction() {}

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
}

module.exports = CLI;