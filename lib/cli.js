const inquirer = require("inquirer");
const promptForId = require("../helpers/promptForId");

// Define the CLI (Command Line Interface) class
class CLI {
    // Constructor
    constructor(db) {
        // List of objects containing descriptions of actions the user can take and the corresponding method
        this.prompts = [
            {name: "View all employees", value: "viewEmployees"},
            {name: "View Employees By Manager", value: "viewEmployeesByManager"},
            {name: "View Employees By Department", value: "viewEmployeesByDepartment"},
            {name: "Add Employee", value: "addEmployee"},
            {name: "Delete Employee", value: "deleteEmployee"},
            {name: "Update Employee Role", value: "updateEmployeeRole"},
            {name: "Update Employee Manager", value: "updateEmployeeManager"},
            {name: "View All Roles", value: "viewRoles"},
            {name: "Add Role", value: "addRole"},
            {name: "Delete Role", value: "deleteRole"},
            {name: "View All Departments", value: "viewDepartments"},
            {name: "Add Department", value: "addDepartment"},
            {name: "Delete Department", value: "deleteDepartment"},
            {name: "View Utilized Budget By Department", value: "viewUtilizedDepartmentBudget"},
            {name: "Quit", value: null}
        ];

        this.db = db;
    }

    // Prompt the user what they would like to do
    chooseAction() {
        return inquirer.prompt(
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: this.prompts
            }
        ).then(({action}) => {
            // The promise returns the name of a the method corresponding to the option the user selected
            // If the method exists, call said method and call chooseAction() to prompt the user for another choice
            if (action) {
                this[action]()
                .then(() => {
                    this.chooseAction();
                });
            // Else, quit
            } else {
                this.db.end();
                console.log("Goodbye!");
            }
        });
    }

    // Display all departments to the user
    viewDepartments() {
        // Select all department information from the database
        return this.db.query("SELECT * FROM departments")
        .then((result) => {
            // Print the department information
            console.table(result[0]);
        });
    }

    // Display all roles to the user
    viewRoles() {
        // Select all role information from the database
        return this.db.query("SELECT role_id, title, department_name, salary FROM roles JOIN departments ON roles.department_id = departments.department_id")
        .then((result) => {
            // Print the role information
            console.table(result[0]);
        });
    }

    // Display all employees to the user
    viewEmployees() {
        // Select all employee information from the database
        return this.db.query("SELECT e.employee_id, e.first_name, e.last_name, title, department_name, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees AS e JOIN roles AS r ON e.role_id = r.role_id JOIN departments AS d ON r.department_id = d.department_id LEFT JOIN employees AS m ON e.manager_id = m.employee_id")
        .then((result) => {
            // Print the employee information
            console.table(result[0]);
        });
    }

    // Allow the user to add a department
    addDepartment() {
        return inquirer.prompt([
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
            });
        });
    }

    // Allow the user to add a role
    addRole() {
        let sql = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
        let params = [];
        // Prompt for the information needed to add a new role
        return inquirer.prompt([
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
        });
    }

    // Allow the user to add an employee
    addEmployee() {
        let sql = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        let params = [];
        return inquirer.prompt([
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
            return promptForId(this.db, "employee_id", "CONCAT(first_name, ' ', last_name)", "manager", "employees", "Who is the employee's manager?", [{name: "None", value: null}])
        }).then((managerId) => {
            // Save the manager into the parameters for the query
            params.push(managerId);
            // Add the employee to the database
            return this.db.query(sql, params)
        }).then(() => {
            console.log(`Added ${params[0]} ${params[1]} to the database`);
        });
    }

    // Allow the user to update an employee's role
    updateEmployeeRole() {
        let sql = "UPDATE employees SET role_id = ? WHERE employee_id = ?";
        let employeeId;
        // Prompt the user for the employee, get the employee's id
        return promptForId(this.db, "employee_id", "CONCAT(first_name, ' ', last_name)", "employee_name", "employees", "Which employee's role do you want to update?")
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
        });
    }

    // Allow the user to update an employee's manager
    updateEmployeeManager() {
        let sql = "UPDATE employees SET manager_id = ? WHERE employee_id = ?";
        let employeeId;
        // Prompt the user for the employee, get the employee's id
        return promptForId(this.db, "employee_id", "CONCAT(first_name, ' ', last_name)", "employee_name", "employees", "Which employee's manager do you want to update?")
        .then((id) => {
            // Store the employee's id
            employeeId = id;
            // Prompt the user for the manager, get the manager's id
            return promptForId(this.db, "employee_id", "CONCAT(first_name, ' ', last_name)", "employee_name", "employees", "Which manager do you want to assign to the selected employee?", [{name: "None", value: null}]);
        }).then((managerId) => {
            // Update the employee's manager
            return this.db.query(sql, [managerId, employeeId]);
        }).then(() => {
            console.log("Updated employee's manager");
        });
    }

    // Allow the user to choose a manager and display that manager's employees
    viewEmployeesByManager() {
        let sql = "SELECT e.employee_id, e.first_name, e.last_name, title, department_name, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees AS e JOIN roles AS r ON e.role_id = r.role_id JOIN departments AS d ON r.department_id = d.department_id LEFT JOIN employees AS m ON e.manager_id = m.employee_id WHERE e.manager_id = ?";
        // Prompt the user for the manager, get the manager's id
        return promptForId(this.db, "employee_id", "CONCAT(first_name, ' ', last_name)", "employee_name", "employees", "Which manager's employees do you want to view?")
        .then((managerId) => {
            return this.db.query(sql, managerId);
        }).then((result) => {
            // Display the manager's employees
            (result[0].length === 0) ? console.log("No employees work for this manager") : console.table(result[0]);
        });
    }

    // Allow the user to choose a department and display that department's employees
    viewEmployeesByDepartment() {
        let sql = "SELECT e.employee_id, e.first_name, e.last_name, title, department_name, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees AS e JOIN roles AS r ON e.role_id = r.role_id JOIN departments AS d ON r.department_id = d.department_id LEFT JOIN employees AS m ON e.manager_id = m.employee_id WHERE d.department_id = ?";
        // Prompt the user for the department, get the department's id
        return promptForId(this.db, "department_id", "department_name", "department_name", "departments", "Which department's employees do you want to view?")
        .then((departmentId) => {
            return this.db.query(sql, departmentId);
        }).then((result) => {
            // Display the department's employees
            (result[0].length === 0) ? console.log("No employees work in this department") : console.table(result[0]);
        });
    }

    // Allow the user to delete a department
    deleteDepartment() {
        let sql = "DELETE FROM departments WHERE department_id = ?";
        // Prompt user for the department, get the department's id
        return promptForId(this.db, "department_id", "department_name", "department_name", "departments", "Which department do you want to delete?")
        .then((departmentId) => {
            return this.db.query(sql, departmentId);
        }).then(() => {
            console.log("Deleted department");
        });
    }

    // Allow the user to delete a role
    deleteRole() {
        let sql = "DELETE FROM roles WHERE role_id = ?";
        // Prompt user for the role, get the role's id
        return promptForId(this.db, "role_id", "title", "title", "roles", "Which role do you want to delete?")
        .then((roleId) => {
            return this.db.query(sql, roleId);
        }).then(() => {
            console.log("Deleted role");
        });
    }

    // Allow the user to delete an employee
    deleteEmployee() {
        let sql = "DELETE FROM employees WHERE employee_id = ?";
        // Prompt user for the employee, get the employee's id
        return promptForId(this.db, "employee_id", "CONCAT(first_name, ' ', last_name)", "name", "employees", "Which employee do you want to delete?")
        .then((employeeId) => {
            return this.db.query(sql, employeeId);
        }).then(() => {
            console.log("Deleted employee");
        });
    }

    // Allow the user to choose a department and display the sum of the salaries of the employees of that department
    viewUtilizedDepartmentBudget() {
        let sql = "SELECT SUM(salary) FROM departments AS d JOIN roles AS r ON d.department_id = r.department_id JOIN employees AS e ON r.role_id = e.role_id WHERE d.department_id = ?";
        // Prompt user for the department, get the department's id
        return promptForId(this.db, "department_id", "department_name", "department_name", "departments", "Which department's utilized budget do you want to view?")
        .then((departmentId) => {
            return this.db.query(sql, departmentId);
        }).then((result) => {
            // Display the utilized budget
            console.table(result[0]);
        })
    }
}

module.exports = CLI;