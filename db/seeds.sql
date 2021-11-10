INSERT INTO department (department_name)
VALUES  ("Accounts"),
        ("Administration"),
        ("IT"),
        ("Engineering"),
        ("Executive");

INSERT INTO department_role (title, salary, department_id)
VALUES  ("Software Engineer", 100000, 3),
        ("Trainee Customer Service", 20000, 2),
        ("Accounts Payable", 60000, 1),
        ("Accounts Recievable", 60000, 1),
        ("Systems Advisor", 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Sally", "Dodgem", 2, 1),
        ("Frank", "Smith", 3, 1),
        ("David", "Davide", 2, 2),
        ("Billy", "Jones", 4, 1),
        ("James", "Terry", 3, 1);