INSERT INTO department (department_name)
VALUES  ("Accounts"),
        ("Administration"),
        ("IT"),
        ("Engineering"),
        ("Executive"),
        ("Sales");

INSERT INTO department_role (title, salary, department_id)
VALUES  ("Software Engineer", 90000, 3),
        ("Trainee Customer Service", 20000, 2),
        ("Accounts Payable", 60000, 1),
        ("Accounts Recievable", 60000, 1),
        ("Systems Advisor", 60000, 3),
        ("Sales Advisor", 60000, 6),
        ("CEO", 200000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Sally", "Dodgem", 7, NULL),
        ("Frank", "Smith", 3, 6),
        ("David", "Davide", 2, 6),
        ("Billy", "Jones", 4, 5),
        ("Jess", "Jones", 6, 1),
        ("James", "Terry", 6, 1);