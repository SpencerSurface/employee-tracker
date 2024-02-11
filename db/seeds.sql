INSERT INTO departments (department_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3),
       ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Thi", "Nguyen", 1, NULL),
       ("Ploni", "Almoni", 2, 1),
       ("Anna", "Kovalska", 3, NULL),
       ("Nomen", "Nescio", 4, 3),
       ("San", "Zhang", 5, NULL),
       ("Aparichita", "Vyakti", 6, 5),
       ("Mumei", "Nanashi", 7, NULL),
       ("John", "Doe", 8, 7);
       