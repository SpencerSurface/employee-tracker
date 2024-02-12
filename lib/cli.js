const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const promptForId = require("../helpers/promptForId");

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
        mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "employees_db"
        }).then((conn) => {
            this.db = conn
        });
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
        this.db.query("SELECT * FROM departments")
        .then((result) => {
            // Print the department information
            console.table(result[0]);
        }).then(() => {
            // Prompt the user for another action
            return this.chooseAction();
        });
    }

    // Display all roles to the user
    viewRoles() {
        // Select all role information from the database
        this.db.query("SELECT role_id, title, department_name, salary FROM roles JOIN departments ON roles.department_id = departments.department_id")
        .then((result) => {
            // Print the role information
            console.table(result[0]);
        }).then(() => {
            // Prompt the user for another action
            return this.chooseAction();
        });
    }

    // Display all employees to the user
    viewEmployees() {
        // Select all employee information from the database
        this.db.query("SELECT e.employee_id, e.first_name, e.last_name, title, department_name, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees AS e JOIN roles AS r ON e.role_id = r.role_id JOIN departments AS d ON r.department_id = d.department_id LEFT JOIN employees AS m ON e.manager_id = m.employee_id")
        .then((result) => {
            // Print the employee information
            console.table(result[0]);
        }).then(() => {
            // Prompt the user for another action
            return this.chooseAction();
        })
    }

    // Allow the user to add a department
    addDepartment() {
        inquirer.prompt([
            {
                type: "input",
                name: "department",
                message: "What is the name of the department?"
            }
        ]).then(({department}) => {
            // Add the department to the database
            this.db.query("INSERT INTO departments (department_name) VALUES (?)", department)
            .then(() => {
                console.log(`Added ${department} to the database`);
            }).then(() => {
                // Prompt the user for another action
                return this.chooseAction();
            });
        });
    }

    // Allow the user to add a role
    addRole() {
        let sql = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
        let params = [];
        // Prompt for the information needed to add a new role
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the name of the role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?"
            }
        ]).then((answers) => {
            // Store the title and salary
            params.push(answers.title);
            params.push(answers.salary);
            // Prompt the user for the department, get the department's id
            return promptForId(this.db, "department_id", "department_name", "name", "departments", "Which department does the role belong to?")
        }).then((departmentId) => {
            // Add the departmentId to the parameters
            params.push(departmentId);
            // Insert the new role into the database
            return this.db.query(sql, params);
        }).then(() => {
            console.log(`Added ${params[0]} to the database`);
            // Prompt the user for another action
            return this.chooseAction();
        });
    }

    // Allow the user to add an employee
    addEmployee() {
        let sql = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        let params = [];
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?"
            }
        ]).then((answers) => {
            params.push(answers.firstName);
            params.push(answers.lastName);
            // Prompt the user for the role, get the role's id
            return promptForId(this.db, "role_id", "title", "title", "roles", "What is the employee's role?")
        }).then((roleId) => {
            // Save the role id into the parameters for the query
            params.push(roleId);
            // Get the manager information from the database
            return promptForId(this.db, "employee_id", "CONCAT(first_name, ' ', last_name)", "manager", "employees", "Who is the employee's manager?", ["None"])
        }).then((managerId) => {
            // Save the manager into the parameters for the query
            params.push(managerId);
            // Add the employee to the database
            return this.db.query(sql, params)
        }).then(() => {
            console.log(`Added ${params[0]} ${params[1]} to the database`);
            // Prompt the user for another action
            return this.chooseAction();
        });
    }

    // Allow the user to update an employee's role
    updateEmployeeRole() {
        let sql = "UPDATE employees SET role_id = ? WHERE employee_id = ?";
        let employeeId;
        // Prompt the user for the employee, get the employee's id
        promptForId(this.db, "employee_id", "CONCAT(first_name, ' ', last_name)", "employee_name", "employees", "Which employee's role do you want to update?")
        .then((id) => {
            // Store the employee's id
            employeeId = id;
            // Prompt the user for the role, get the role's id
            return promptForId(this.db, "role_id", "title", "title", "roles", "Which role do you want to assign to the selected employee?");
        }).then((roleId) => {
            // Update the employee's role
            return this.db.query(sql, [roleId, employeeId]);
        }).then(() => {
            console.log("Updated employee's role");
            // Prompt the user for another action
            return this.chooseAction();
        });
    }

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